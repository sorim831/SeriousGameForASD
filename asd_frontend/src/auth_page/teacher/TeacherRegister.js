import React, { useState, useEffect } from "react";
import "./TeacherRegister.css";

function Register() {
  /*
  require("dotenv").config({
    path: ".env",
  });
  */
  const address = process.env.REACT_APP_BACKEND_ADDRESS;
  //console.log(address);

  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return; // 토큰이 없으면 검증하지 않음
    else {
      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 전송
          },
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = "/teacher_home";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        //window.location.href = "/main";
      }
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, []);

  const [teacherId, setTeacherId] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [duplicateIdMessage, setDuplicateIdMessage] = useState("");
  const [duplicatePasswordMessage, setDuplicatePasswordMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isIdVerified, setIsIdVerified] = useState(false);
  const [nameMessage, setNameMessage] = useState("");
  const [idChecked, setIdChecked] = useState(false);

  // 선생 : 비밀번호(pwd, pwd2) 일치 확인
  const [teacherpwd, setTeacherPwd] = useState("");
  const [teacherpwd2, setTeacherPwd2] = useState("");
  const [pwdMatch, setpwdMatch] = useState(false);

  const checkPassword = (pw) => {
    if (!teacherpwd || !teacherpwd2) {
      setDuplicatePasswordMessage("비밀번호를 입력해주세요");
      setpwdMatch(false);
      return;
    }

    if (
      teacherpwd &&
      teacherpwd2 &&
      (pw === teacherpwd2 || pw === teacherpwd || teacherpwd2 === teacherpwd)
    ) {
      setDuplicatePasswordMessage("비밀번호가 일치해요.");
      setpwdMatch(true);
    } else {
      setDuplicatePasswordMessage("비밀번호가 일치하지 않아요.");
      setpwdMatch(false);
    }
  };

  // 선생 : 제출 버튼 상태
  const [submitbtn, setsubmitbtn] = useState(true);

  const isFormValid = () => {
    return (
      isIdVerified &&
      pwdMatch &&
      teacherPassword.length > 0 &&
      teacherName.length > 0
    );
  };

  useEffect(() => {
    setsubmitbtn(!isFormValid());
    if (teacherId && teacherPassword && !teacherName) {
      setNameMessage("이름을 입력해주세요");
    }
  }, [isIdVerified, pwdMatch, teacherPassword, teacherName, teacherId]);

  // 선생 : 회원가입 처리 함수
  const handleTeacherRegister = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      setErrorMessage("비어있는 칸이 존재해요.");
      return;
    }

    try {
      const response = await fetch(`${address}/teacher_register_process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          teacher_password: teacherPassword,
          teacher_name: teacherName,
        }),
      });

      await response.text();
      window.location.href = "/teacher_login";
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("선생님 등록 중 오류가 발생했습니다.");
    }
  };

  // 선생 : 중복 체크 버튼 클릭 시 동작
  const handleCheckId = async () => {
    if (!teacherId) {
      setDuplicateIdMessage("아이디를 입력해주세요");
      return;
    }

    try {
      const response = await fetch(
        `${address}/teacher_register_process/checkid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ teacher_id: teacherId }),
        }
      );

      const data = await response.json();
      setIdChecked(true);

      if (!data.available) {
        setDuplicateIdMessage("이미 사용 중인 ID에요.");
        setIsIdVerified(false);
      } else {
        setDuplicateIdMessage("사용 가능한 ID에요.");
        setIsIdVerified(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("아이디 중복 체크 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="App">
      <form
        className="teacher-register-form"
        action="/teacher_register_process"
        method="post"
        onSubmit={handleTeacherRegister}
      >
        <h1 className="teacher-register-title">회원가입</h1>
        <div style={{ position: "relative" }}>
          <div className="teacher-register-id-box">
            <input
              type="text"
              name="id"
              className="teacher-register-input-id"
              placeholder="아이디"
              onChange={(e) => {
                setTeacherId(e.target.value);
                setIsIdVerified(false);
                setIdChecked(false);
                setDuplicateIdMessage(
                  e.target.value ? "중복확인을 해주세요." : ""
                );
              }}
            />
            <button
              type="button"
              className={`teacher-register-check-id-button ${
                isIdVerified ? "teacher-register-check-id-button-disabled" : ""
              }`}
              onClick={handleCheckId}
            >
              중복 확인
            </button>
          </div>
          {(duplicateIdMessage || (teacherId && !idChecked)) && (
            <p
              className="teacher-register-duplicate-id-message"
              style={{
                color: duplicateIdMessage.includes("사용 가능")
                  ? "green"
                  : "red",
              }}
            >
              {idChecked ? duplicateIdMessage : "중복확인을 해주세요."}
            </p>
          )}
        </div>
        <div style={{ position: "relative" }}>
          <div className="teacher-register-pwd-box">
            <input
              type="password"
              name="pwd"
              placeholder="비밀번호"
              onChange={(e) => {
                setTeacherPassword(e.target.value);
                setTeacherPwd(e.target.value);
                checkPassword(e.target.value);
              }}
              onBlur={checkPassword}
              className="teacher-register-input-pwd"
            />

            <input
              type="password"
              name="pwd2"
              placeholder="비밀번호 확인"
              onChange={(e) => {
                setTeacherPwd2(e.target.value);
                checkPassword(e.target.value);
              }}
              onBlur={checkPassword}
              className="teacher-register-input-pwd"
            />
          </div>
          {duplicatePasswordMessage && (
            <p
              className="teacher-register-duplicate-pwd-message"
              style={{ color: pwdMatch ? "green" : "red" }}
            >
              {duplicatePasswordMessage}
            </p>
          )}
        </div>
        <div
          className="teacher-register-name-box"
          style={{ position: "relative" }}
        >
          <input
            type="text"
            name="displayName"
            placeholder="이름"
            onChange={(e) => {
              setTeacherName(e.target.value);
              if (!e.target.value && teacherId && teacherpwd && teacherpwd2) {
                setNameMessage("이름을 입력해주세요");
              } else {
                setNameMessage("");
              }
            }}
            onBlur={(e) => {
              if (!e.target.value && teacherId && teacherpwd && teacherpwd2) {
                setNameMessage("이름을 입력해주세요");
              }
            }}
            className="teacher-register-input-name"
          />
          {nameMessage && (
            <p
              className="teacher-register-name-message"
              style={{ color: "red" }}
            >
              {nameMessage}
            </p>
          )}
        </div>
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        <button
          type="submit"
          name="submit"
          value="가입"
          disabled={submitbtn}
          className={`teacher-register-btn ${
            submitbtn ? "teacher-register-btn-disabled" : ""
          }`}
        >
          선생님으로 가입
        </button>
      </form>
    </div>
  );
}

export default Register;
