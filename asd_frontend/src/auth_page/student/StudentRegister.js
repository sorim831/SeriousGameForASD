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
  const [currentStep, setCurrentStep] = useState(1);

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

    if (!studentName.trim() || studentName.length > 8) {
      setError("이름을 확인해주세요!");
      return;
    }
    if (!studentPhone.trim() || studentPhone.length !== 11) {
      setError("전화번호를 확인해주세요.");
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

  const checkValidation = () => {
    if (!studentName.trim() || studentName.length > 8) {
      setError("이름을 확인해주세요!");
      return;
    }
    if (!studentPhone.trim() || studentPhone.length !== 11) {
      setError("전화번호를 확인해주세요.");
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
    } else {
      setError("");
    }
  };

  const handleStudentBirthdayChange = (e) => {
    setStudentBirthday({ ...studentBirthday, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setStudentGender(e.target.value);
    checkValidation();
  };

  const handleNameChange = (e) => {
    setStudentName(e.target.value);
    setError("");
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) {
      setError("숫자만 입력해주세요");
    } else {
      if (value.length <= 11) {
        setStudentPhone(value);
      }
      setError("");
    }
  };

  const validateAndNext = () => {
    if (currentStep === 1) {
      if (!studentName.trim()) {
        setError("이름을 입력해주세요.");
        return;
      }
      if (studentName.length > 8) {
        setError("이름이 너무 깁니다.");
        return;
      }
      setCurrentStep(2);
      setError("");
    } else if (currentStep === 2) {
      if (!studentPhone.trim()) {
        setError("전화번호를 입력해주세요.");
        return;
      }
      if (studentPhone.length !== 11) {
        setError("전화번호는 11자리여야 합니다.");
        return;
      }
      setCurrentStep(3);
      setError("");
    } else if (currentStep === 3) {
      if (
        !studentBirthday.year ||
        !studentBirthday.month ||
        !studentBirthday.day
      ) {
        setError("생년월일을 모두 선택해주세요.");
        return;
      }
      setCurrentStep(4);
      setError("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && currentStep < 4) {
      e.preventDefault();
      validateAndNext();
    }
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
        onKeyPress={handleKeyPress}
      >
        <h1 className={styles.title}>신규 등록</h1>
        <div className={styles.nameBox}>
          <label className={styles.nameLabel}>이름:</label>
          <input
            className={styles.nameInput}
            type="text"
            name="name"
            placeholder="이름"
            value={studentName}
            onChange={handleNameChange}
            tabIndex={1}
          />
        </div>
        {currentStep >= 2 && (
          <div className={styles.phoneBox}>
            <label className={styles.phoneLabel}>전화번호:</label>
            <input
              className={styles.phoneInput}
              type="text"
              name="phone"
              placeholder="전화번호"
              onChange={handlePhoneChange}
              value={studentPhone}
              style={{ WebkitAppearance: "none", MozAppearance: "textfield" }}
              tabIndex={2}
            />
          </div>
        )}
        {currentStep >= 3 && (
          <div className={styles.birthdayInfo}>
            <label>생일:</label>
            <select
              className={styles.selectBox}
              name="year"
              onChange={handleStudentBirthdayChange}
              value={studentBirthday.year}
              tabIndex={3}
            >
              <option value="">년</option>
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
              value={studentBirthday.month}
              tabIndex={4}
            >
              <option value="">월</option>
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
              value={studentBirthday.day}
              tabIndex={5}
            >
              <option value="">일</option>
              {studentDay.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <label>일</label>
          </div>
        )}
        {currentStep >= 4 && (
          <div className={styles.genderBox}>
            <label className={styles.genderInput}>
              <input
                type="radio"
                value="male"
                checked={studentGender === "male"}
                onChange={handleGenderChange}
                tabIndex={6}
              />
              남성
            </label>
            <label className={styles.genderInput}>
              <input
                type="radio"
                value="female"
                checked={studentGender === "female"}
                onChange={handleGenderChange}
                tabIndex={7}
              />
              여성
            </label>
          </div>
        )}
        {error && <p className={styles.errorMessage}>{error}</p>}
        <div className={styles.btnBox}>
          <a href="/login" className={styles.goBackBtn} tabIndex={9}>
            뒤로가기
          </a>
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={validateAndNext}
              className={styles.registerBtn}
              tabIndex={8}
            >
              다음
            </button>
          ) : (
            <button type="submit" className={styles.registerBtn} tabIndex={8}>
              등록
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default Register;
