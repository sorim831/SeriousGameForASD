import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import "./room.css";
import QuestionSelect from "./QuestionSelect";
import SelectedQuestion from "./SelectedQuestion";
import ClassData from "./ClassData";
import ScoreAndFeedBack from "./ScoreAndFeedBack";
import TotalAnimation from "./TotalAnimation";
import StudentData from "./StudentData";
import axios from "axios";
import { useLocation } from "react-router-dom";

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
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const roomId = decodeURIComponent(window.location.pathname.split("/")[2]);
  const [selectedButtonId, setSelectedButtonId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [animationVisible, setAnimationVisible] = useState(false);
  const [scorekData, setScoreData] = useState({
    score: null,
    feedback: "",
  });
  const [studentDataVisible, setStudentDataVisible] = useState(false);
  const [roomStudents, setRoomStudents] = useState([]); // Room에 있는 학생 목록
  const [error, setError] = useState(null);
  const location = useLocation();
  const students = location.state?.students; // 학생 기본정보 받아옴
  const studentId = location.state?.studentId; // '학생' 아이디 받아옴

  console.log("students:", students);
  console.log("roomId:", roomId);

  useEffect(() => {
    if (students && Array.isArray(students) && roomId) {
      const filteredStudents = students.filter(
        (student) => student.student_id === roomId
      );
      console.log("Filtered students:", filteredStudents);
      setRoomStudents(filteredStudents);
    } else {
      console.error("Invalid students or roomId:", { students, roomId });
    }
  }, [students, roomId]);

  const handleStudentDataClick = () => {
    console.log("Before toggle:", studentDataVisible);

    setStudentDataVisible(true);
  };

  const handleStudentDataClose = () => {
    setStudentDataVisible(false);
  };

  // 질문 선택 핸들러
  const handleButtonClick = (id) => {
    setSelectedButtonId(id);
  };

  // 선택 ID 전송 핸들러
  const sendButtonClick = () => {
    setSelectedId(selectedButtonId);
  };

  // 피드백 제출 핸들러
  const handleFeedbackSubmit = (data) => {
    setScoreData(data);

    // 점수가 4점 이상일 경우 애니메이션 표시
    if (data.score >= 4) {
      setAnimationVisible(true);

      // 일정 시간 후 애니메이션 숨기기
      setTimeout(() => setAnimationVisible(false), 4000);
    }
  };

  // 사용자 인증 및 권한 확인
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
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.user.role !== "teacher" && result.user.role !== "student") {
          navigate("/main");
          return;
        }

        setUserRole(result.user.role); // 사용자 역할 설정
        setLoading(false); // 로딩 종료
      } catch (error) {
        console.error("checkAccessToken error:", error);
        navigate("/main");
      }
    };

    checkAccessToken();
  }, [navigate]);

  // 미디어 가져오기 및 WebRTC 연결 초기화
  useEffect(() => {
    if (myStream) {
      makeConnection();
    }
  }, [myStream]);

  // 사용 가능한 카메라 가져오기
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

  // 카메라와 마이크 활성화
  const getMedia = async (deviceId) => {
    const constraints = {
      audio: true,
      video: deviceId
        ? { deviceId: { exact: deviceId } }
        : { facingMode: "user" },
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMyStream(stream); // 스트림 설정
      myFace.current.srcObject = stream; // 비디오 연결
      if (!deviceId) {
        await getCameras(stream); // 카메라 옵션 설정
      }
    } catch (e) {
      console.log(e);
    }
  };

  // 음소거 버튼 핸들러
  const handleMuteClick = () => {
    myStream
      .getAudioTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setMuted((prev) => !prev);
  };

  // 카메라 전환 버튼 핸들러
  const handleCameraClick = () => {
    myStream
      .getVideoTracks()
      .forEach((track) => (track.enabled = !track.enabled));
    setCameraOff((prev) => !prev);
  };

  // WebRTC 연결 생성
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

    // ICE 후보 처리
    peerConnection.addEventListener("icecandidate", (data) => {
      if (data.candidate) {
        socket.emit("ice", data.candidate, roomId);
      }
    });

    // 상대방 스트림 수신
    peerConnection.addEventListener("track", (data) => {
      peerFace.current.srcObject = data.streams[0];
      setPeerConnected(true);
    });

    // 연결 상태 변경 감지
    peerConnection.addEventListener("connectionstatechange", () => {
      if (peerConnection.connectionState === "disconnected") {
        setPeerConnected(false);
      }
    });

    // 로컬 트랙 추가
    myStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, myStream));
  };

  // 초기 미디어 설정
  useEffect(() => {
    getMedia();
  }, [roomId]);

  useEffect(() => {
    console.log("socket:", socket);
    console.log("myPeerConnection:", myPeerConnection);
    console.log("roomId:", roomId);
    if (!socket || !myPeerConnection) return;
    console.log("asdf");

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

    socket.on("alert_end", () => {
      alert("수업이 종료되었습니다.");
      navigate("/student_home");
    });

    return () => {
      socket.off("welcome");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice");
    };
  }, [socket, myPeerConnection, roomId]);

  // 룸 참여 메시지 전송
  useEffect(() => {
    if (roomId && socket) {
      socket.emit("join_room", roomId);
    }
  }, [socket, roomId]);

  // 로딩 상태일 경우 로딩 메시지 표시
  if (loading) {
    return <p>loading...</p>;
  }

  // 수업 종료 핸들러
  const handleEndClass = async () => {
    const confirmEnd = window.confirm("수업을 종료하시겠습니까?");
    if (!confirmEnd) return;
    navigate("/TeacherHome");
  };

  return (
    <div className="classroom-container">
      {/* 헤더 */}
      <div className="header">
        <span className="student-id">{studentId}</span>
        <button className="student-info" onClick={handleStudentDataClick}>
          학생 정보
        </button>

        {studentDataVisible && roomStudents.length > 0 ? (
          <StudentData
            studentData={roomStudents}
            onClose={handleStudentDataClose}
          />
        ) : null}
        <button className="end-class-button" onClick={handleEndClass}>
          수업 종료
        </button>
      </div>

      {/* 상단 영역 */}
      <div className="top">
        <div className="video-container">
          {/* 비디오 화면 */}
          <video className="video" ref={peerFace} autoPlay playsInline />

          {/* TotalAnimation 컴포넌트 */}
          {animationVisible && (
            <div className="animation-overlay">
              <TotalAnimation />
            </div>
          )}
        </div>
        <div className="QuestionSelect">
          <QuestionSelect onButtonClick={handleButtonClick} />
        </div>
      </div>

      {/* 하단 영역 */}
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
            studentId={studentId}
          />
        </div>
        <div className="ClassData">
          <ClassData scoreData={scorekData} />
        </div>
      </div>

      {/* 미디어 컨트롤 버튼 */}
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
