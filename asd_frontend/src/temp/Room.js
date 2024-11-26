import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./room.css";
import QuestionSelect from "./QuestionSelect";
import SelectedQuestion from "./SelectedQuestion";
import ClassData from "./ClassData";
import ScoreAndFeedBack from "./ScoreAndFeedBack";
import axios from "axios";

const address = process.env.REACT_APP_BACKEND_ADDRESS;

const Room = () => {
  const myFace = useRef(null);
  const peerFace = useRef(null);
  const [myStream, setMyStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [socket, setSocket] = useState(null);
  const [myPeerConnection, setMyPeerConnection] = useState(null);
  const [peerConnected, setPeerConnected] = useState(false);
  const [userRole, setUserRole] = useState(""); // userRole 상태 추가
  const [loading, setLoading] = useState(true); // loading 상태 추가
  const navigate = useNavigate();
  const roomId = decodeURIComponent(window.location.pathname.split("/")[2]);
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [scoreAndFeedBackData, setScoreAndFeedBackData] = useState({
    score: null,
    feedback: "",
  });

  const handleButtonClick = (id) => {
    setSelectedButtonId(id);
  };

  const sendButtonClick = () => {
    setSelectedId(selectedButtonId);
  };

  const handleFeedbackSubmit = (data) => {
    setScoreAndFeedBackData(data);
  };

  useEffect(() => {
    const checkAccessToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/main");
        return;
      }

      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        if (result.user.role !== "teacher" && result.user.role !== "student") {
          navigate("/main");
          return;
        }

        setUserRole(result.user.role);
        setLoading(false); // 로딩 완료 후 상태 업데이트
      } catch (error) {
        console.error("checkAccessToken error:", error);
        navigate("/main");
      }
    };

    checkAccessToken();
  }, [navigate]);

  useEffect(() => {
    const fetchStudentAndUserId = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const studentResponse = await axios.get(`${address}/get_student_id`);
        setStudentId(studentResponse.data.studentId);

        const userResponse = await axios.get(`${address}/c/room/${roomId}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (userResponse.status === 403) {
          navigate("/");
          return;
        }

        const userId = userResponse.data.userId;

        if (!userId) {
          navigate("/login");
          return;
        }

        const socketConnection = io(`${address}`, {
          query: { userId },
        });
        setSocket(socketConnection);

        return () => socketConnection.disconnect();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentAndUserId();
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
    if (roomId && socket) {
      socket.emit("join_room", roomId);
    }
  }, [socket, roomId]);

  if (loading) {
    return <p>loading...</p>; // 로딩 상태 표시
  }

  const handleEndClass = async () => {
    const confirmEnd = window.confirm("수업을 종료하시겠습니까?");
    if (!confirmEnd) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("인증 정보가 없습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      // 서버에 수업 종료 요청 보내기
      await axios.post(
        `${address}/end_class`,
        { roomId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("수업이 종료되었습니다.");
      navigate("/home"); // 홈 화면으로 이동
    } catch (error) {
      console.error("수업 종료 중 오류 발생:", error);
      alert("수업 종료 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="classroom-container">
      <div className="header">
        <sapn className="student-id">학생 아이디</sapn>
        <button className="end-class-button" onClick={handleEndClass}>
          수업 종료
        </button>
      </div>

      <div className="top">
        <video className="video" ref={peerFace} autoPlay playsInline />
        <div className="QuestionSelect">
          <QuestionSelect onButtonClick={handleButtonClick} />
        </div>
      </div>

      <div className="bottom">
        <video ref={myFace} className="video" autoPlay muted playsInline />
        <div className="SelectedQuestion">
          <SelectedQuestion
            selectedId={selectedButtonId}
            sendButtonClick={sendButtonClick}
          />
        </div>
        <div>
          <ScoreAndFeedBack
            selectedId={selectedId}
            onSubmitFeedback={handleFeedbackSubmit}
          />
        </div>
        <div className="ClassData">
          <ClassData scoreAndFeedBackData={scoreAndFeedBackData} />
        </div>
      </div>

      <button onClick={handleMuteClick} className="media-set">
        {muted ? "Unmute" : "Mute"}
      </button>
      <button onClick={handleCameraClick} className="media-set">
        {cameraOff ? "Turn Camera On" : "Turn Camera Off"}
      </button>
    </div>
  );
};

export default Room;
