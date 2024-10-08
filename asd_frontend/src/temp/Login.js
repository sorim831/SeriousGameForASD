import React, { useState, useEffect } from "react";
import "./Login.css";

function Login() {
  const [Student, setStudent] = useState(false);
  const [studentYear, setStudentYear] = useState([]);
  const [studentMonth, setStudentMonth] = useState([]);
  const [studentDay, setStudentDay] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentBirthday, setStudentBirthday] = useState({
    year: "",
    month: "",
    day: "",
  });

  // 반응형 웹 생성
  useEffect(() => {
    const handleResize = () => {
      setStudent(window.innerWidth <= 700);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 생년월일 옵션 동적 생성
  useEffect(() => {
    const years = [];
    const months = [];
    const days = [];
    for (let i = 2010; i <= 2022; i++) {
      years.push(i);
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i);
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i);
    }
    setStudentYear(years);
    setStudentMonth(months);
    setStudentDay(days);
  }, []);

  // 로그인 처리 함수

  // 회원가입 버튼 누르면 회원가입 페이지로 이동
  const RegisterBtn = () => {
    window.location.href = "/register";
  };

  return (
    <div className="App">
      {Student ? (
        // 학생 화면: 이름과 생년월일 입력
        <>
          <form className="login-form">
            <p>
              <input type="text" name="name" placeholder="이름" />
            </p>
            <div className="info" id="info__birth">
              <select className="box" id="birth-year">
                <option disabled selected>
                  출생 연도
                </option>
                {studentYear.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <select className="box" id="birth-month">
                <option disabled selected>
                  월
                </option>
                {studentMonth.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
              <select className="box" id="birth-day">
                <option disabled selected>
                  일
                </option>
                {studentDay.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="btn">
              <button type="button" onClick={RegisterBtn}>
                회원가입
              </button>
              <button type="submit">로그인</button>
            </div>
          </form>
        </>
      ) : (
        // 선생님 화면: 아이디와 비밀번호 입력
        <>
          <form className="login-form">
            <input type="text" name="id" placeholder="아이디" />
            <input type="password" name="pwd" placeholder="비밀번호" />
            <div className="btn">
              <button type="button" onClick={RegisterBtn}>
                회원가입
              </button>
              <button type="submit">로그인</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default Login;
