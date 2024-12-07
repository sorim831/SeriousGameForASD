import React, { useState, useEffect } from "react";
import styles from "./StudentRegister.module.css";

function Register() {
  const address = process.env.REACT_APP_BACKEND_ADDRESS;

  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    else {
      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          window.location.href = "/home";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, []);

  const [studentYear, setStudentYear] = useState([]);
  const [studentMonth, setStudentMonth] = useState([]);
  const [studentDay, setStudentDay] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentGender, setStudentGender] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [studentBirthday, setStudentBirthday] = useState({
    year: "",
    month: "",
    day: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    setLoading(false);
  }, []);

  const handleStudentRegister = async (e) => {
    e.preventDefault();

    if (!studentName.trim()) {
      setError("이름을 입력해주세요.");
      return;
    }
    if (studentName.length > 8) {
      setError("이름을 확인해주세요!");
      return;
    }
    if (!studentPhone.trim()) {
      setError("전화번호를 입력해주세요.");
      return;
    }
    if (studentPhone.length !== 11) {
      setError("전화번호는 11자리여야 합니다.");
      return;
    }
    if (
      !studentBirthday.year ||
      !studentBirthday.month ||
      !studentBirthday.day
    ) {
      setError("생년월일을 모두 선택해주세요.");
      return;
    }
    if (!studentGender) {
      setError("성별을 체크해주세요.");
      return;
    }

    const fullBirthday = `${studentBirthday.year}-${String(
      studentBirthday.month
    ).padStart(2, "0")}-${String(studentBirthday.day).padStart(2, "0")}`;

    try {
      const response = await fetch(`${address}/student_register_process`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: studentName,
          student_birthday: fullBirthday,
          student_gender: studentGender,
          student_phone: studentPhone,
        }),
      });

      const result = await response.text();
      setError(result);
      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Error:", error);
      setError("등록 중 오류가 발생했어요.");
    }
  };

  const handleStudentBirthdayChange = (e) => {
    setStudentBirthday({ ...studentBirthday, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setStudentGender(e.target.value);
  };

  if (loading) {
    return (
      <div className="loader">
        <div className="spinner"></div>
        <p>불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className={styles.App}>
      <form
        className={styles.registerForm}
        action="/student_register_process"
        method="post"
        onSubmit={handleStudentRegister}
      >
        <h1 className={styles.title}>신규 등록</h1>
        <div className={styles.nameBox}>
          <label className={styles.nameLabel}>이름:</label>
          <input
            className={styles.nameInput}
            type="text"
            name="name"
            placeholder="이름"
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>
        <div className={styles.phoneBox}>
          <label className={styles.phoneLabel}>전화번호:</label>
          <input
            className={styles.phoneInput}
            type="text"
            name="phone"
            placeholder="전화번호"
            onChange={(e) => {
              const onlyNums = e.target.value.replace(/[^0-9]/g, "");
              if (onlyNums.length <= 11) {
                setStudentPhone(onlyNums);
              }
            }}
            value={studentPhone}
            style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
          />
        </div>
        <div className={styles.birthdayInfo}>
          <label>생일:</label>
          <select
            className={styles.selectBox}
            name="year"
            onChange={handleStudentBirthdayChange}
          >
            <option disabled selected></option>
            {studentYear.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <label>년</label>
          <select
            className={styles.selectBox}
            name="month"
            onChange={handleStudentBirthdayChange}
          >
            <option disabled selected></option>
            {studentMonth.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <label>월</label>
          <select
            className={styles.selectBox}
            name="day"
            onChange={handleStudentBirthdayChange}
          >
            <option disabled selected></option>
            {studentDay.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <label>일</label>
        </div>
        <div className={styles.genderBox}>
          <label className={styles.genderInput}>
            <input
              type="radio"
              value="male"
              checked={studentGender === "male"}
              onChange={handleGenderChange}
            />
            남성
          </label>
          <label className={styles.genderInput}>
            <input
              type="radio"
              value="female"
              checked={studentGender === "female"}
              onChange={handleGenderChange}
            />
            여성
          </label>
        </div>
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.btnBox}>
          <a href="/login" className={styles.goBackBtn}>
            뒤로가기
          </a>
          <button type="submit" className={styles.registerBtn}>
            등록
          </button>
        </div>
      </form>
    </div>
  );
}

export default Register;
