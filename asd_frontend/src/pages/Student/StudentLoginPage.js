import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Student/StudentLoginPage.css";
import "../../styles/Student/global.css";

const StudentLoginPage = () => {
  const [name, setName] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [months, setMonths] = useState([]);
  const [days, setDays] = useState([]);
  const navigate = useNavigate();
  const address = process.env.REACT_APP_BACKEND_ADDRESS;

  useEffect(() => {
    const generatedMonths = Array.from({ length: 12 }, (_, i) => i + 1); // 1~12
    const generatedDays = Array.from({ length: 31 }, (_, i) => i + 1); // 1~31
    setMonths(generatedMonths);
    setDays(generatedDays);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const formattedDate = `${String(month).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    try {
      const response = await fetch(`${address}/student_login_process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: name,
          student_birthday: formattedDate, // 월-일 형식
        }),
      });

      const result = await response.json();

      if (result.success) {
        localStorage.setItem("token", result.token); // JWT 토큰 저장
        navigate("/student_home");
      } else {
        alert(result.message || "로그인 실패! 정보를 확인해주세요.");
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error);
      alert("서버와 연결할 수 없습니다.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-form">
          <h1>학생 로그인</h1>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <div className="birth-selection">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            >
              <option value="" disabled>
                월
              </option>
              {months.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
            >
              <option value="" disabled>
                일
              </option>
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <button className="login-button" onClick={handleLogin}>
            로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;
