// components/StudentsTable.jsx
"use client";

import React, { useState, useEffect } from "react";
import { getScoresByDate } from "@/app/dashboard/actions";
import StudentRow from "./studentRow";

export default function StudentsTable({ students = [], date, refreshStudents }) {
  const [scoresMap, setScoresMap] = useState({});

  useEffect(() => {
    if (!date) {
      setScoresMap({});
      return;
    }
    (async () => {
      const { data, error } = await getScoresByDate(date);
      if (error) {
        alert("Qiymətləri yükləyərkən xəta: " + error.message);
        return;
      }
      const map = {};
      data.forEach((row) => {
        map[row.student_id] = {
          id: row.id,
          attendance: row.attendance,
          score: row.score,
        };
      });
      setScoresMap(map);
    })();
  }, [date]);

  const refreshScores = () => {
    if (!date) return;
    getScoresByDate(date).then(({ data }) => {
      const map = {};
      data.forEach((r) => {
        map[r.student_id] = {
          id: r.id,
          attendance: r.attendance,
          score: r.score,
        };
      });
      setScoresMap(map);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2
        className="text-2xl font-extrabold mb-6 
                   bg-clip-text text-transparent
                   bg-gradient-to-r from-indigo-600 to-purple-600"
      >
        Tələbələr
      </h2>

      {/* Alt-alta siyahı */}
      <div className="flex flex-col gap-6">
        {students.map((student) => (
          <StudentRow
            key={student.id}
            student={student}
            date={date}
            initialScore={scoresMap[student.id] ?? null}
            refreshScores={refreshScores}
            refreshStudents={refreshStudents}
          />
        ))}
      </div>
    </div>
  );
}
