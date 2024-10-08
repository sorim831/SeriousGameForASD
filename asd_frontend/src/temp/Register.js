import React, { useState, useEffect } from "react";
import "./Register.css";

function Register() {
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

  const [teacherId, setTeacherId] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherName, setTeacherName] = useState("");

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

  // 학생 : 회원가입 처리 함수
  const handleStudentRegister = async (e) => {
    e.preventDefault();
    const fullBirthday = `${studentBirthday.year}-${String(
      studentBirthday.month
    ).padStart(2, "0")}-${String(studentBirthday.day).padStart(2, "0")}`;

    try {
      const response = await fetch("http://localhost:8000/student_register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          student_name: studentName,
          student_birthday: fullBirthday,
        }),
      });

      const result = await response.text();
      alert(result);
    } catch (error) {
      console.error("Error:", error);
      alert("학생 등록 중 오류 발생");
    }
  };

  // 선생 : 제출 버튼 상태
  const [submitbtn, setsubmitbtn] = useState(true);

  // 선생 : 회원가입 처리 함수
  const handleTeacherRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/teacher_register", {
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
    } catch (error) {
      console.error("Error:", error);
      alert("선생님 등록 중 오류 발생");
    }
  };

  // 학생 : 생년월일 선택 핸들러
  const handleStudentBirthdayChange = (e) => {
    setStudentBirthday({ ...studentBirthday, [e.target.name]: e.target.value });
  };

  // 선생 : 중복 체크 버튼 클릭 시 동작
  const handleCheckId = async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/teacher_register/checkid",
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
      {Student ? (
        <>
          <form
            className="register-form"
            action="/student_register"
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
        </>
      ) : (
        <>
          <form
            className="register-form"
            action="/teacher_register"
            method="post"
            onSubmit={handleTeacherRegister}
          >
            <p>
              <input
                type="text"
                name="id"
                class="inputId"
                placeholder="아이디"
                onChange={(e) => setTeacherId(e.target.value)}
              />
              <button
                type="button"
                class="checkIdButton"
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
              <button
                type="submit"
                name="submit"
                value="가입"
                disabled={submitbtn}
              >
                가입
              </button>
            </p>
          </form>
        </>
      )}
    </div>
  );
}

export default Register;
