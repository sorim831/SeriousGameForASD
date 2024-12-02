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

import problemData from "./problemData.json";

import "../loader.css";
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
  const [showResizeMessage, setShowResizeMessage] = useState(false);
  const [studentID, setStudentId] = useState(null);

  const [scoreAndFeedBackData, setScoreAndFeedBackData] = useState({
    score: null,
    feedback: "",
  });
  const [camLoading, setCamLoading] = useState(false);
  useEffect(() => {
    const checkScreenSize = () => {
      setShowResizeMessage(window.innerWidth < 1600);
    };

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  const [studentDataVisible, setStudentDataVisible] = useState(false);
  const [roomStudents, setRoomStudents] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const students = location.state?.students;
  const studentId = location.state?.studentId;

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

    const imageName = selectedButtonId;
    //console.log(imageName);
    socket.emit("imagePath", imageName, roomId);

    /*

    socket.on("overlay_image", (overlay_image) => {
      console.log(overlay_image, "gdgdddffddddd");
      const imagelocation = document.querySelector(".questionImage");
      //console.log(imagelocation);
      imagelocation.src = overlay_image;
    });

    */
  };

  // 피드백 제출 핸들러
  const handleFeedbackSubmit = (data) => {
    setScoreAndFeedBackData(data);

    // 점수가 4점 이상일 경우 애니메이션 표시
    if (data.score >= 4) {
      setAnimationVisible(true);

      // 일정 시간 후 애니메이션 숨기기 (예: 3초 후)
      setTimeout(() => setAnimationVisible(false), 3000);
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

  // 학생 및 사용자 정보 가져오기
  useEffect(() => {
    const fetchStudentAndUserId = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const studentResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_ADDRESS}/home`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const result = await studentResponse.json();

        if (!result.success) {
          window.location.href = "/main";
        }

        setStudentId(result.user.id);
        const userId = result.user.id;

        // 소켓 연결 생성
        const socketConnection = io(`${address}`, { query: { userId } });
        setSocket(socketConnection);

        // 소켓 이벤트 리스너 등록
        socketConnection.on("overlay_image", (overlay_image) => {
          const imagelocation = document.querySelector(".questionImage");
          imagelocation.src = overlay_image;
        });

        socketConnection.on("alert_end", () => {
          alert("수업이 종료되었습니다.");
          navigate("/student_home");
        });

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

    return () => {
      // 컴포넌트 언마운트 시 연결 정리
      if (myPeerConnection) {
        myPeerConnection.close();
      }
      if (myStream) {
        myStream.getTracks().forEach((track) => track.stop());
      }
    };
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
    setCamLoading(false);
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
      setCamLoading(true);
    } catch (e) {
      console.log(e);
    } finally {
      setCamLoading(true);
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
      if (peerFace.current) {
        peerFace.current.srcObject = data.streams[0];
        setPeerConnected(true);
      }
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
    return (
      <div className="loader">
        <div className="spinner"></div>
        <p>수업 페이지 불러오는 중...</p>
      </div>
    );
  }

  // 수업 종료 핸들러
  const handleEndClass = async () => {
    const confirmEnd = window.confirm("수업을 종료하시겠습니까?");
    if (!confirmEnd) return;
    navigate("/TeacherHome");

    /*

      socket.on("alert_end", () => {
        alert("수업이 종료되었습니다아.");
        navigate("/student_home");
      });

      */
  };

  // 학생 화면 추가
  if (userRole === "student") {
    const problem = problemData[selectedButtonId];

    return (
      <div className="student-container">
        <div className="video-container">
          {/* 상단: 학생 비디오 (이미지 오버레이 포함) */}
          <div className="video-overlay-container">
            <video
              ref={myFace}
              autoPlay
              muted
              playsInline
              className="student-video"
            />
            {problem && (
              <img
                src={problem.image_url}
                alt={`Problem ${selectedButtonId}`}
                className="problem-image-overlay"
              />
            )}
          </div>

          {/* 중간: 문제 텍스트 */}
          {problem ? (
            <p className="problem-text">{problem.text}</p>
          ) : (
            <p className="problem-placeholder">문제가 선택되지 않았습니다.</p>
          )}

          {/* 하단: 교사 비디오 */}
          <video
            ref={peerFace}
            autoPlay
            playsInline
            className="student-video"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="classroom-container">
      {showResizeMessage && (
        <div className="plz-resize-message">
          <p>화면을 축소해주세요!</p>
        </div>
      )}
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

          <video
            className="teacher-video"
            ref={peerFace}
            autoPlay
            playsInline
          />

          <img className="questionImage" src="" alt="" />

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
        {camLoading ? (
          <video
            ref={myFace}
            className="teacher-video"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div className="cam-loading">
            <div className="loader">
              <div className="spinner"></div>
              <p>캠 켜는 중...</p>
            </div>
          </div>
        )}

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
          <ClassData
            scoreAndFeedBackData={scoreAndFeedBackData}
            students={students}
          />
        </div>
      </div>

      {/* 미디어 컨트롤 버튼 */}
      <button onClick={handleMuteClick} className="media-set">
        {muted ? "마이크 켜기" : "마이크 끄기"}
      </button>
      <button onClick={handleCameraClick} className="media-set">
        {cameraOff ? "카메라 켜기" : "카메라 끄기"}
      </button>
    </div>
  );
};

export default Room;
