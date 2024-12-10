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

import "./room.css";

const address = process.env.REACT_APP_BACKEND_ADDRESS;

const Room = () => {
  const myFace = useRef(null);
  const peerFace = useRef(null);
  const [myStream, setMyStream] = useState(null);
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isSocketConnection, setisSocketConnection] = useState(false);
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
  const [studentDataVisible, setStudentDataVisible] = useState(false);
  const [roomStudents, setRoomStudents] = useState([]);
  const [error, setError] = useState(null);
  const location = useLocation();
  const students = location.state?.students;
  const studentId = location.state?.studentId;
  const [isSaving, setIsSaving] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [scoreAndFeedBackData, setScoreAndFeedBackData] = useState({
    score: null,
    feedback: "",
  });
  const [camLoading, setCamLoading] = useState(false);
  const [currentImagePath, setCurrentImagePath] = useState("");

  useEffect(() => {
    const checkScreenSize = () => {
      setShowResizeMessage(window.innerWidth < 1600);
    };

    window.addEventListener("resize", checkScreenSize);
    checkScreenSize();

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!socket) return;

    // 학생 화면 애니메이션 트리거
    socket.on("playAnimation", () => {
      //console.log("애니메이션 이벤트 수신: 학생 화면");
      setAnimationVisible(true);

      // 일정 시간 후 애니메이션 숨기기
      setTimeout(() => setAnimationVisible(false), 5000);
    });

    return () => {
      socket.off("playAnimation");
    };
  }, [socket]);

  useEffect(() => {
    if (students && Array.isArray(students) && roomId) {
      const filteredStudents = students.filter(
        (student) => student.student_id === roomId
      );
      //console.log("Filtered students:", filteredStudents);
      setRoomStudents(filteredStudents);
    } else {
      // console.error("Invalid students or roomId:", { students, roomId });
    }
  }, [students, roomId]);

  const handleStudentDataClick = () => {
    //console.log("Before toggle:", studentDataVisible);

    setStudentDataVisible(true);
  };

  const handleStudentDataClose = () => {
    setStudentDataVisible(false);
  };

  // 질문 선택 핸들러
  const handleButtonClick = (id) => {
    setSelectedButtonId(id);
    const imageName = id;
    //console.log(imageName);
    socket.emit("imagePath", imageName, roomId);
  };

  // 선택 ID 전송 핸들러
  const sendButtonClick = () => {
    setSelectedId(selectedButtonId);
    const imageName = selectedButtonId;

    socket.emit("selectedimagePath", imageName, roomId);

    const imagePath = `/images/student/${imageName}.png`;
    //const imagePath_teacher = `/images/teacher/${imageName}.png`;

    setCurrentImagePath(imagePath);

    const studentImageForTeacher = document.querySelector(
      ".problem-image-overlay-for-teacher"
    );
    if (studentImageForTeacher) {
      studentImageForTeacher.src = imagePath;
      studentImageForTeacher.style.display = "block"; // 이미지가 보이도록 설정
      //console.log("Teacher overlay image updated:", imagePath);
    }
  };

  // 자세히 보기 버튼 이벤트 (서버로 데이터 전송 + 소켓으로 학생에게 애니메이션)
  const handleFeedbackSubmit = (data) => {
    setScoreAndFeedBackData(data);
    setSelectedId(null);
    setSelectedButtonId(null);

    const teacherOverlayImage = document.querySelector(
      ".problem-image-overlay-for-teacher"
    );
    if (teacherOverlayImage) {
      teacherOverlayImage.src = "";
      teacherOverlayImage.style.display = "none";
    }

    if (socket) {
      socket.emit("clearOverlay", roomId);
    }

    if (data.score >= 4) {
      setAnimationVisible(true);
      setTimeout(() => setAnimationVisible(false), 3000);
      if (socket) {
        socket.emit("playAnimation", roomId);
      }
    }
  };

  // 사용자 인증 및 권한 확인
  useEffect(() => {
    const checkAccessToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const result = await response.json();
        if (result.user.role !== "teacher" && result.user.role !== "student") {
          navigate("/login");
          return;
        }

        setUserRole(result.user.role); // 사용자 역할 설정
        setLoading(false); // 로딩 종료
      } catch (error) {
        console.error("checkAccessToken error:", error);
        navigate("/login");
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
          window.location.href = "/login";
        }

        setStudentId(result.user.id);
        const userId = result.user.id;

        // 소켓 연결 생성
        const socketConnection = io(`${address}`, { query: { userId } });
        setSocket(socketConnection);
        window.socket = socketConnection;

        setisSocketConnection(true);

        // 소켓 이벤트 리스너 등록
        /*
        socketConnection.on("overlay_image", (overlay_image) => {
          const imagelocation = document.querySelector(".questionImage");
          imagelocation.src = overlay_image;
        });
        */

        socketConnection.on("alert_end", () => {
          alert("수업이 종료되었습니다.");
          if (userRole === "teacher") {
            navigate("/TeacherHome");
          } else {
            navigate("/home");
          }
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
    //console.log("socket:", socket);
    //console.log("myPeerConnection:", myPeerConnection);
    //console.log("roomId:", roomId);
    if (!socket || !myPeerConnection) return;
    //console.log("asdf");

    socket.on("welcome", async () => {
      setIsConnected(true);
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

    /*
    socket.on("alert_end", () => {
      alert("수업이 종료되었습니다.");
      navigate("/home");
    });
    */

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
    }
  }, [socket, roomId]);

  useEffect(() => {
    if (!socket) return;

    socket.on("overlay_selected_image", (overlay_image, res) => {
      const imagelocation = document.querySelector(".questionImage");
      const textlocation = document.querySelector(".questionText");
      const studentimage = document.querySelector(".problem-image-overlay");

      const studenttext = document.querySelector(".problem-text");

      if (imagelocation) {
        imagelocation.src = overlay_image;
      }

      if (textlocation) {
        textlocation.textContent = res.text;
      }

      if (studentimage) {
        studentimage.src = overlay_image;
      }

      if (studenttext) {
        studenttext.textContent = res.text;
      }
    });

    return () => {
      if (socket) {
        socket.off("overlay_selected_image");
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("clearOverlay", () => {
      const studentOverlay = document.querySelector(".problem-image-overlay");
      const questionText = document.querySelector(".problem-text");

      if (studentOverlay) {
        studentOverlay.src = "";
      }
      if (questionText) {
        questionText.textContent = "";
      }
    });

    return () => {
      socket.off("clearOverlay");
    };
  }, [socket]);

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

    const token = localStorage.getItem("token");

    try {
      setIsSaving(true);
      const response = await axios.post(
        `${address}/update_student_info/update_opinion`,
        {
          student_id: studentId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setIsSaving(false);
      setIsEnding(true);
    } catch (error) {
      alert(`server error // ${error}`);
      setIsSaving(false);
      return;
    }
    socket.emit("end_class", roomId);

    if (userRole === "teacher") {
      navigate("/TeacherHome");
    } else {
      navigate("/home");
    }
    socket.emit("end_class", roomId);

    socket.on("alert_end", () => {
      setIsEnding(false);
      alert("수업이 종료되었습니다.");
      if (userRole === "teacher") {
        navigate("/TeacherHome");
      } else {
        navigate("/home");
      }
    });
  };

  // 학생 화면 추가
  if (userRole === "student") {
    return isSocketConnection ? (
      <div className="student-container">
        <div className="video-container-for-student-box">
          {/* 상단: 학생 비디오 (이미지 오버레이 포함) */}
          <div className="video-overlay-container-for-student">
            <video
              ref={myFace}
              autoPlay
              muted
              playsInline
              className="student-video-for-student"
            />
            {animationVisible && (
              <div className="student-animation-overlay">
                <TotalAnimation />
              </div>
            )}
            <img src="" alt="" className="problem-image-overlay" />
          </div>
          {/* 중간: 문제 텍스트 */}
          <div className="problem-text-box">
            <p className="problem-text">
              {!isConnected ? "선생님을 기다리는 중이에요." : ""}
            </p>
          </div>
          {/* 하단: 교사 비디오 */}
          <div className="video-overlay-container-for-student">
            <video
              ref={peerFace}
              autoPlay
              playsInline
              className="teacher-video-at-student"
            />
            {!isConnected && (
              <div className="loaderAtRoom">
                <div className="spinnerAtRoom"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    ) : (
      <div className="loader3">
        <div className="spinner3"></div>
        <p>연결 중...</p>
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
        <div>
          <button className="student-info" onClick={handleStudentDataClick}>
            학생 정보
          </button>
          {studentDataVisible && roomStudents.length > 0 ? (
            <StudentData
              studentData={roomStudents}
              onClose={handleStudentDataClose}
            />
          ) : null}
          <button
            className="end-class-button"
            onClick={handleEndClass}
            disabled={isSaving || isEnding}
          >
            {isSaving
              ? "수업 저장 중..."
              : isEnding
              ? "수업 종료 중..."
              : "수업 종료"}
          </button>
        </div>
      </div>

      {/* 상단 역 */}
      <div className="top">
        <div className="video-container">
          {/* 비디오 화면 */}
          <video
            className="student-video-at-teacher"
            ref={peerFace}
            autoPlay
            playsInline
          />
          {/* TotalAnimation 컴포넌트 */}
          {animationVisible && (
            <div className="teacher-animation-overlay">
              <TotalAnimation />
            </div>
          )}
          <img src="" alt="" className="problem-image-overlay-for-teacher" />
          <p className="questionText"></p>
        </div>
        <div className="QuestionSelect">
          <QuestionSelect
            onButtonClick={(id) => {
              handleButtonClick(id);
            }}
          />
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
        {isSocketConnection ? (
          <div className="SelectedQuestion">
            <SelectedQuestion
              selectedId={selectedButtonId}
              sendButtonClick={sendButtonClick}
              problemData={problemData}
            />
          </div>
        ) : (
          <div className="loader2">
            <div className="spinner2"></div>
            <p>캠 켜는 중...</p>
          </div>
        )}

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
