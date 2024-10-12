import React, { useState, useEffect } from "react";
import "./TeacherLogin.css";

function Login() {
  const address = process.env.REACT_APP_BACKEND_ADDRESS;

  const [teacherId, setTeacherId] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  //const [teacherName, setTeacherName] = useState("");

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

  // 선생 : 로그인 처리 함수
  const handleTeacherLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${address}/teacher_login_process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacher_id: teacherId,
          teacher_password: teacherPassword,
          //teacher_name: teacherName,
        }),
      });

      const result = await response.json();
      //alert(result.message);
      if (result.success) {
        localStorage.setItem("token", result.token); // 토큰 저장
        window.location.href = "/teacher_home";
      }
    } catch (error) {
      console.error("Error details:", error);
      if (
        error.name === "TypeError" &&
        error.message.includes("Failed to fetch")
      ) {
        alert(
          `네트워크 연결 오류: 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.
          ${error.message}`
        );
      }
    }
  };

  // 회원가입 버튼 누르면 회원가입 페이지로 이동
  const RegisterBtn = () => {
    window.location.href = "/teacher_register";
  };

  return (
    <div className="App">
      <form
        className="login-form"
        action="/teacher_login_process"
        method="post"
        onSubmit={handleTeacherLogin}
      >
        <input
          type="text"
          name="id"
          placeholder="아이디"
          onChange={(e) => setTeacherId(e.target.value)}
        />
        <input
          type="password"
          name="teacherPassword"
          placeholder="비밀번호"
          onChange={(e) => setTeacherPassword(e.target.value)}
        />
        <div className="btn">
          <button type="button" onClick={RegisterBtn}>
            회원가입
          </button>
          <button type="submit">로그인</button>
        </div>
      </form>
    </div>
  );
}

export default Login;
