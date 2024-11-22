import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Room = () => {
  const myFace = useRef(null);
  const peerFace = useRef(null);
  const [myStream, setMyStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [socket, setSocket] = useState(null);
  const [myPeerConnection, setMyPeerConnection] = useState(null);
  const [peerConnected, setPeerConnected] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const roomId = decodeURIComponent(window.location.pathname.split("/")[2]);

  useEffect(() => {
    const checkAccessToken = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (!token) {
        console.log("!token");
        window.location.href = "/main";
      } else {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_BACKEND_ADDRESS}/home`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const result = await response.json();
          console.log(result);
          if (
            result.user.role !== "teacher" &&
            result.user.role !== "student"
          ) {
            window.location.href = "/main";
          } else {
            setUserRole(result.user.role);
            console.log("good!");
          }
        } catch (error) {
          console.error("checkAccessToken", error);
          window.location.href = "/main";
        }
      }
    };

    checkAccessToken();
  }, []);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/c/room/${roomId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 403) {
          navigate("/");
          return;
        }

        const userId = response.data.userId;

        if (!userId) {
          navigate("/login");
          return;
        }

        const socketConnection = io(
          `${process.env.REACT_APP_BACKEND_ADDRESS}`,
          {
            query: { userId },
          }
        );
        setSocket(socketConnection);
        console.log(userId);

        return () => socketConnection.disconnect();
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchUserId();
  }, [roomId]);

  useEffect(() => {
    if (myStream) {
      makeConnection();
    }
  }, [myStream]);

  const getCameras = async (stream) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      const currentCamera = stream.getVideoTracks()[0];
      cameras.forEach((camera) => {
        const option = document.createElement("option");
        option.value = camera.deviceId;
        option.innerText = camera.label;
        if (currentCamera.label === camera.label) {
          option.selected = true;
        }
      });
    } catch (e) {
      console.log(e);
    }
  };

  const getMedia = async (deviceId) => {
    const constraints = {
      audio: true,
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: "user" },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMyStream(stream);
      myFace.current.srcObject = stream;
      if (!deviceId) {
        await getCameras(stream);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleMuteClick = () => {
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMuted((prev) => !prev);
  };

  const handleCameraClick = () => {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setCameraOff((prev) => !prev);
  };

  const makeConnection = () => {
    if (!myStream || !socket) return;

    if (myPeerConnection) {
      myPeerConnection.close();
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: ["stun:stun.l.google.com:19302"] },
        { urls: ["stun:stun1.l.google.com:19302"] },
        { urls: ["stun:stun2.l.google.com:19302"] },
        { urls: ["stun:stun3.l.google.com:19302"] },
      ],
    });
    setMyPeerConnection(peerConnection);

    peerConnection.addEventListener("icecandidate", (data) => {
      if (data.candidate) {
        socket.emit("ice", data.candidate, roomId);
      }
    });

    peerConnection.addEventListener("track", (data) => {
      peerFace.current.srcObject = data.streams[0];
      setPeerConnected(true);
    });

    peerConnection.addEventListener("connectionstatechange", () => {
      if (peerConnection.connectionState === "disconnected") {
        setPeerConnected(false);
      }
    });

    myStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, myStream));
  };

  useEffect(() => {
    getMedia();
  }, [roomId]);

  useEffect(() => {
    if (!socket || !myPeerConnection) return;

    socket.on("welcome", async () => {
      const offer = await myPeerConnection.createOffer({ iceRestart: true });
      await myPeerConnection.setLocalDescription(offer);
      socket.emit("offer", offer, roomId);
    });

    socket.on("offer", async (offer) => {
      await myPeerConnection.setRemoteDescription(
        new RTCSessionDescription(offer)
      );
      const answer = await myPeerConnection.createAnswer();
      await myPeerConnection.setLocalDescription(answer);
      socket.emit("answer", answer, roomId);
    });

    socket.on("answer", async (answer) => {
      await myPeerConnection.setRemoteDescription(
        new RTCSessionDescription(answer)
      );
    });

    socket.on("ice", async (ice) => {
      if (ice) {
        try {
          const candidate = new RTCIceCandidate({
            candidate: ice.candidate,
            sdpMid: ice.sdpMid,
            sdpMLineIndex: ice.sdpMLineIndex,
          });
          await myPeerConnection.addIceCandidate(candidate);
        } catch (error) {
          console.error("Error adding received ice candidate", error);
        }
      }
    });

    return () => {
      socket.off("welcome");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice");
    };
  }, [socket, myPeerConnection, roomId]);

  useEffect(() => {
    if (roomId && socket) {
      socket.emit("join_room", roomId);
      setLoading(false);
    }
  }, [socket, roomId]);

  if (loading) {
    return <p>loading...</p>;
  }

  return (
    <div>
      {userRole === "teacher" ? (
        <div>
          <h1>선생님</h1>
          <video
            ref={myFace}
            style={{ width: "200px" }}
            autoPlay
            muted
            playsInline
          />
          <video
            ref={peerFace}
            style={{ width: "200px" }}
            autoPlay
            playsInline
          />
          <button onClick={handleMuteClick}>{muted ? "Unmute" : "Mute"}</button>
          <button onClick={handleCameraClick}>
            {cameraOff ? "Turn Camera On" : "Turn Camera Off"}
          </button>
        </div>
      ) : (
        <div>
          <h1>학생</h1>
          <video
            ref={myFace}
            style={{ width: "200px" }}
            autoPlay
            muted
            playsInline
          />
          <video
            ref={peerFace}
            style={{ width: "200px" }}
            autoPlay
            playsInline
          />
          <button onClick={handleMuteClick}>{muted ? "Unmute" : "Mute"}</button>
          <button onClick={handleCameraClick}>
            {cameraOff ? "Turn Camera On" : "Turn Camera Off"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Room;
