import React, { useEffect, useState } from "react";
import axios from "axios";

const address = process.env.REACT_APP_BACKEND_ADDRESS;

const Access = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teacher, setTeacher] = useState("");

  const checkAccessToken = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/main";
      return;
    } else {
      try {
        const response = await fetch(`${address}/home`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();

        if (result.success) {
          setTeacher(result.user.id);
        } else {
          window.location.href = "/main";
        }
      } catch (error) {
        console.error(error);
        window.location.href = "/main";
      }
    }
    try {
      const response = await axios.get(`${address}/get_students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setStudents(response.data.students);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAccessToken();
  }, []);

  if (loading) return <p>loading....</p>;

  return (
    <div>
      <p>선생님과 연결된 학생 목록</p>
      <p>{teacher}</p>
      {error}
      <div>
        {students.map((student) => (
          <div key={student.id}>
            <p>{student.student_id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Access;
