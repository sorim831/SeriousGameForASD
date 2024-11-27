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
  // 참고용 DOM 요소 및 상태 정의
  const myFace = useRef(null); // 내 비디오 요소 참조
  const peerFace = useRef(null); // 상대방 비디오 요소 참조
  const [myStream, setMyStream] = useState(null); // 내 미디어 스트림
  const [muted, setMuted] = useState(false); // 음소거 상태
  const [cameraOff, setCameraOff] = useState(false); // 카메라 상태
  const [socket, setSocket] = useState(null); // 소켓 연결
  const [myPeerConnection, setMyPeerConnection] = useState(null); // WebRTC 피어 연결
  const [peerConnected, setPeerConnected] = useState(false); // 피어 연결 상태
  const [userRole, setUserRole] = useState(""); // 사용자 역할 (학생/교사)
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트
  const roomId = decodeURIComponent(window.location.pathname.split("/")[2]); // URL에서 roomId 추출
  const [selectedButtonId, setSelectedButtonId] = useState(null); // 선택된 질문 ID
  const [selectedId, setSelectedId] = useState(null); // 최종 선택된 ID
  const [studentId, setStudentId] = useState(null); // 학생 ID
  const [scoreAndFeedBackData, setScoreAndFeedBackData] = useState({
    score: null,
    feedback: "",
  }); // 점수 및 피드백 데이터

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
    setScoreAndFeedBackData(data);
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

  // 학생 및 사용자 정보 가져오기
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

        // 소켓 연결 생성
        const socketConnection = io(`${address}`, { query: { userId } });
        setSocket(socketConnection);

        return () => socketConnection.disconnect(); // 컴포넌트 종료 시 소켓 해제
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchStudentAndUserId();
  }, [roomId]);

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

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("인증 정보가 없습니다. 다시 로그인해주세요.");
        navigate("/login");
        return;
      }

      // 서버로 수업 종료 요청
      await axios.post(
        `${address}/end_class`,
        { roomId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("수업이 종료되었습니다.");
      navigate("/TeacherHome"); // 교사용 홈으로 이동
    } catch (error) {
      console.error("수업 종료 중 오류 발생:", error);
      alert("수업 종료 중 문제가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="classroom-container">
      {/* 헤더 */}
      <div className="header">
        <sapn className="student-id">학생 아이디</sapn>
        <button className="end-class-button" onClick={handleEndClass}>
          수업 종료
        </button>
      </div>

      {/* 상단 영역 */}
      <div className="top">
        <video className="video" ref={peerFace} autoPlay playsInline />
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
          />
        </div>
        <div className="ClassData">
          <ClassData scoreAndFeedBackData={scoreAndFeedBackData} />
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
