import React, { useEffect, useState } from "react";
import "./First.css";
const address = process.env.REACT_APP_BACKEND_ADDRESS;

function First() {
  const [Student, setStudent] = useState(""); // 기본값: 선생님 선택
  /*
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
          window.location.href = "/home";
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
  */

  // 로그인 처리
  const handleLogin = (e) => {
    e.preventDefault();
    if (Student) {
      window.location.href = "/login";
    } else {
      window.location.href = "/teacher_login";
    }
  };

  return (
    <div className="App">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="btn-usertype">
          <button onClick={() => setStudent(true)}>학생</button>
          <button onClick={() => setStudent(false)}>선생님</button>
        </div>
      </form>
    </div>
  );
}

export default First;
