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

  // 선생 : 비밀번호(pwd, pwd2) 일치 확인
  const [teacherpwd, setTeacherPwd] = useState("");
  const [teacherpwd2, setTeacherPwd2] = useState("");
  const [messagePwdMatch, setmessagePwdMatch] = useState("");
  const [pwdMatch, setpwdMatch] = useState(true);

  const checkPassword = () => {
    if (teacherpwd && teacherpwd2 && teacherpwd === teacherpwd2) {
      setmessagePwdMatch("비밀번호가 일치합니다.");
      setpwdMatch(true);
    } else {
      setmessagePwdMatch("비밀번호가 일치하지 않습니다.");
      setpwdMatch(false);
    }
  };

  // 선생 : 제출 버튼 상태
  const [submitbtn, setsubmitbtn] = useState(true);

  // 선생 : 회원가입 처리 함수
  const handleTeacherRegister = async (e) => {
    e.preventDefault();

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

      const result = await response.text();
      alert(result);
      window.location.href = "/teacher_login";
    } catch (error) {
      console.error("Error:", error);
      alert("선생님 등록 중 오류 발생");
    }
  };

  // 선생 : 중복 체크 버튼 클릭 시 동작
  const handleCheckId = async () => {
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

      const messageId = document.getElementById("idMessage");
      messageId.style.display = "block";

      if (!data.available) {
        messageId.textContent = "이미 사용 중인 ID입니다.";
        messageId.style.color = "red";
        document.querySelector('button[name="submit"]').disabled = true;
      } else {
        messageId.textContent = "사용 가능한 ID입니다.";
        messageId.style.color = "green";
        document.querySelector('button[name="submit"]').disabled = false;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("아이디 중복 체크 중 오류 발생");
    }
  };

  return (
    <div className="App">
      <h1>회원가입</h1>
      <form
        className="register-form"
        action="/teacher_register_process"
        method="post"
        onSubmit={handleTeacherRegister}
      >
        <p>
          <input
            type="text"
            name="id"
            className="inputId"
            placeholder="아이디"
            onChange={(e) => setTeacherId(e.target.value)}
          />
          <button
            type="button"
            className="checkIdButton"
            onClick={handleCheckId}
          >
            중복 ID 체크
          </button>
        </p>
        <p id="idMessage" style={{ color: "red", display: "none" }}></p>
        <p>
          <input
            type="password"
            name="pwd"
            placeholder="비밀번호"
            onChange={(e) => {
              setTeacherPassword(e.target.value);
              setTeacherPwd(e.target.value);
              checkPassword();
            }}
            onBlur={checkPassword}
          />
        </p>
        <p>
          <input
            type="password"
            name="pwd2"
            placeholder="비밀번호 확인"
            onChange={(e) => {
              setTeacherPassword(e.target.value);
              setTeacherPwd2(e.target.value);
              checkPassword();
            }}
            onBlur={checkPassword}
          />
        </p>
        <p id="pwdMessage" style={{ color: pwdMatch ? "green" : "red" }}>
          {messagePwdMatch}
        </p>
        <p>
          <input
            type="text"
            name="displayName"
            placeholder="이름"
            onChange={(e) => setTeacherName(e.target.value)}
          />
        </p>
        <p>
          <button type="submit" name="submit" value="가입" disabled={submitbtn}>
            가입
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
