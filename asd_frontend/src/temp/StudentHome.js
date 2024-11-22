import React, { useEffect } from "react";
const address = process.env.REACT_APP_BACKEND_ADDRESS;

function Home() {
  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      window.location.href = "/student_login";
    } else {
      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Bearer 형식으로 토큰 전송
          },
        });

        const result = await response.json();

        if (result.success) {
          if (result.user.role !== "student") {
            window.location.href = "/main";
          } else {
            console.log("good!");
          }
        } else {
          // 토큰이 유효하지 않으면 로그인 페이지로 리다이렉트
          alert("로그인 화면으로 넘어갑니다.");
          window.location.href = "/student_login";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        window.location.href = "/student_login";
      }
    }
  };

  // 페이지 로드 시 토큰을 확인
  useEffect(() => {
    checkAccessToken();
  }, []);

  // 로그아웃 기능 임시로 만듦
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("로그인 화면으로 넘어갑니다.");
    window.location.href = "/student_login";
  };

  return (
    <div className="App">
      <h1>hi</h1>
      {/* 로그아웃 기능 임시로 */}
      <button id="logout" onClick={handleLogout}>
        로그아웃
      </button>
    </div>
  );
}

export default Home;
