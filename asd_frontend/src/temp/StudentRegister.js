import React, { useState, useEffect } from "react";
import "./StudentRegister.css";

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
          window.location.href = "/student_home_page";
        }
      } catch (error) {
        console.error("토큰 검증 중 오류 발생:", error);
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
      alert(result);
      window.location.href = "/student_login";
    } catch (error) {
      console.error("Error:", error);
      alert("학생 등록 중 오류 발생");
    }
  };

  const handleStudentBirthdayChange = (e) => {
    setStudentBirthday({ ...studentBirthday, [e.target.name]: e.target.value });
  };

  const handleGenderChange = (e) => {
    setStudentGender(e.target.value);
  };

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="App">
      <h1>회원가입</h1>
      <form
        className="register-form"
        action="/student_register_process"
        method="post"
        onSubmit={handleStudentRegister}
      >
        <p>
          <input
            type="text"
            name="name"
            placeholder="이름"
            onChange={(e) => setStudentName(e.target.value)}
          />
        </p>
        <input
          type="number"
          name="name"
          placeholder="휴대전화"
          onChange={(e) => setStudentPhone(e.target.value)}
        />
        <div>
          <label>
            <input
              type="radio"
              value="male"
              checked={studentGender === "male"}
              onChange={handleGenderChange}
            />
            남성
          </label>
          <label>
            <input
              type="radio"
              value="female"
              checked={studentGender === "female"}
              onChange={handleGenderChange}
            />
            여성
          </label>
        </div>
        <div className="info" id="info__birth">
          <select
            className="box"
            name="year"
            onChange={handleStudentBirthdayChange}
          >
            <option disabled selected>
              출생 연도
            </option>
            {studentYear.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            className="box"
            name="month"
            onChange={handleStudentBirthdayChange}
          >
            <option disabled selected>
              월
            </option>
            {studentMonth.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="box"
            name="day"
            onChange={handleStudentBirthdayChange}
          >
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
        <p>
          <button type="submit" value="가입">
            가입
          </button>
        </p>
      </form>
    </div>
  );
}

export default Register;
