import React, { useState, useEffect } from "react";
import styles from "./StudentLogin.module.css";

function Login() {
  const address = process.env.REACT_APP_BACKEND_ADDRESS;

  const [studentYear, setStudentYear] = useState([]);
  const [studentMonth, setStudentMonth] = useState([]);
  const [studentDay, setStudentDay] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentBirthday, setStudentBirthday] = useState({
    year: "",
    month: "",
    day: "",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [nameError, setNameError] = useState("");
  const [birthdayError, setBirthdayError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
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
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const checkValidationName = (name) => {
    if (!name) {
      setNameError("이름을 입력해주세요.");
    } else {
      setNameError("");
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, []);

  // 학생 : 생년월일 선택 핸들러
  const handleStudentBirthdayChange = (e) => {
    setStudentBirthday({ ...studentBirthday, [e.target.name]: e.target.value });
  };

  // 학생 : 생년월일 옵션 동적 생성
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

  // 학생 : 로그인 처리 함수
  const handleStudentLogin = async (e) => {
    e.preventDefault();

    if (!studentName) {
      setNameError("이름을 입력해주세요.");
      return;
    }
    if (
      !studentBirthday.year ||
      !studentBirthday.month ||
      !studentBirthday.day
    ) {
      setBirthdayError("생년월일을 모두 선택해주세요.");
      return;
    }

    const fullBirthday = `${studentBirthday.year}-${String(
      studentBirthday.month
    ).padStart(2, "0")}-${String(studentBirthday.day).padStart(2, "0")}`;

    try {
      const response = await fetch(`${address}/student_login_process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: studentName,
          student_birthday: fullBirthday,
        }),
      });

      const result = await response.json();
      if (result.success) {
        localStorage.setItem("token", result.token); // 토큰 저장
        window.location.href = "/home";
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setErrorMessage("로그인 중 오류가 발생했어요.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  if (loading) {
    return <div>loding...</div>;
  }

  return (
    <div className={styles.App}>
      {isLoggedIn ? (
        <div className={styles.loginForm}>
          <p className={styles.loginMessage}>이미 로그인이 되어있어요.</p>
          <a className={styles.goBackBtn} href="/home">
            돌아가기
          </a>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            로그아웃
          </button>
        </div>
      ) : (
        <form
          className={styles.loginForm}
          action="/student_login_process"
          onSubmit={handleStudentLogin}
        >
          <h1 className={styles.title}>로그인</h1>
          <div className={styles.nameBox}>
            <label className={styles.nameLabel}>이름:</label>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                name="name"
                placeholder="이름"
                onChange={(e) => {
                  setStudentName(e.target.value);
                  checkValidationName(e.target.value);
                }}
                className={styles.nameInput}
                autoComplete="on"
                tabIndex="1"
              />
              {nameError && <p className={styles.errorMessage}>{nameError}</p>}
            </div>
          </div>
          <div className={styles.birthdayInfo}>
            <label>생일:</label>
            <div className={styles.birthdayBoxWrapper}>
              <div className={styles.birthdayBox}>
                <select
                  className={styles.selectBox}
                  name="year"
                  onChange={handleStudentBirthdayChange}
                  tabIndex="2"
                >
                  <option disabled selected></option>
                  {studentYear.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <label className={styles.birthdayLabel}>년</label>
              </div>
              <div className={styles.birthdayBox}>
                <select
                  className={styles.selectBox}
                  name="month"
                  onChange={handleStudentBirthdayChange}
                  tabIndex="3"
                >
                  <option disabled selected></option>
                  {studentMonth.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                <label className={styles.birthdayLabel}>월</label>
              </div>
              <div className={styles.birthdayBox}>
                <select
                  className={styles.selectBox}
                  name="day"
                  onChange={handleStudentBirthdayChange}
                  tabIndex="4"
                >
                  <option disabled selected></option>
                  {studentDay.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
                <label className={styles.birthdayLabel}>일</label>
              </div>
              {birthdayError && (
                <p className={styles.errorMessage}>{birthdayError}</p>
              )}
            </div>
          </div>
          <div className={styles.btnBox}>
            {errorMessage && (
              <p className={styles.errorMessageError}>{errorMessage}</p>
            )}
            <a
              className={styles.registerBtn}
              href="/student_register"
              tabIndex="6"
            >
              신규 등록
            </a>
            <button type="submit" className={styles.loginBtn} tabIndex="5">
              로그인
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default Login;
