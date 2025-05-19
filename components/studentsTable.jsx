// components/studentsTable.jsx
"use client";

import React, { useState } from 'react';
import { addScore } from '@/app/dashboard/actions';
import ScoreDropdown from '@/components/scoreDropdown';

export default function StudentsTable({ students = [], date }) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState({});     // { [id]: { attendance, score } }
  const [attendanceVals, setAttendanceVals] = useState({});
  const [scoreVals, setScoreVals] = useState({});

  async function handleSubmit(studentId) {
    if (!date) {
      return alert('Zəhmət olmasa tarix seçin');
    }
    const attendance = attendanceVals[studentId];
    const score = scoreVals[studentId];
    if (attendance == null || score == null) {
      return alert('Zəhmət olmasa Q/B və balı seçin');
    }

    setLoading(true);
    const { error } = await addScore({
      student_id: studentId,
      attendance,
      score,
      date,
    });
    setLoading(false);

    if (error) {
      alert('Xəta: ' + error.message);
    } else {
      setSubmitted(prev => ({
        ...prev,
        [studentId]: { attendance, score },
      }));
      alert('Əlavə olundu ✅');
    }
  }

  return (
    <div className="grid gap-4">
      {students.map(s => {
        const hit = submitted[s.id];

        return (
          <div
            key={s.id}
            className="border p-4 rounded shadow-sm bg-white flex flex-col gap-3"
          >
            {/* Ad və qeyd tarixi */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{s.full_name}</h2>
              <span className="text-sm text-gray-500">
                {new Date(s.enrollment_date).toLocaleDateString()}
              </span>
            </div>

            {hit ? (
              /* Statik görünüş */
              <div className="space-y-1">
                <p className="text-sm">
                  <strong>Tarix:</strong> {date}
                </p>
                <p className="text-sm">
                  <strong>Q/B:</strong> {hit.attendance ? 'Var ✅' : 'Yox ❌'}
                </p>
                <p className="text-sm">
                  <strong>Bal:</strong> {hit.score}
                </p>
              </div>
            ) : (
              /* Form hissəsi */
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <ScoreDropdown
                  type="attendance"
                  value={attendanceVals[s.id]}
                  onChange={val =>
                    setAttendanceVals(prev => ({ ...prev, [s.id]: val }))
                  }
                />
                <ScoreDropdown
                  type="score"
                  value={scoreVals[s.id]}
                  onChange={val =>
                    setScoreVals(prev => ({ ...prev, [s.id]: val }))
                  }
                />
                <button
                  onClick={() => handleSubmit(s.id)}
                  disabled={loading}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {loading ? 'Yüklənir…' : 'Əlavə et'}
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
