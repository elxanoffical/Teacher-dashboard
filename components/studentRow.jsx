// components/StudentRow.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  addScore,
  updateScore,
  deleteScore,
  updateStudent,
  deleteStudent,
} from "@/app/dashboard/actions";
import ScoreDropdown from "./scoreDropdown";

export default function StudentRow({
  student,
  date,
  initialScore,
  refreshScores,
  refreshStudents,
}) {
  // — ad redaktə
  const [isEditingName, setIsEditingName] = useState(false);
  const [newFullName, setNewFullName] = useState(student.full_name);

  // — Q/B–Bal form + statik view üçün
  const [attendance, setAttendance] = useState(initialScore?.attendance ?? null);
  const [score, setScore] = useState(initialScore?.score ?? null);
  const [isEditingScore, setIsEditingScore] = useState(false);
  const [loading, setLoading] = useState(false);

  // hər dəfə initialScore dəyişəndə form sahələrini güncəlləyək
  useEffect(() => {
    setAttendance(initialScore?.attendance ?? null);
    setScore(initialScore?.score ?? null);
    // edit rejimində idisə/reset et
    setIsEditingScore(false);
  }, [initialScore]);

  /** — Adı yadda saxla */
  const handleSaveName = async () => {
    if (!newFullName.trim()) return alert("Ad boş ola bilməz");
    const { error } = await updateStudent(student.id, newFullName.trim());
    if (error) return alert("Xəta: " + error.message);
    setIsEditingName(false);
    refreshStudents();
  };

  /** — Tələbəni sil */
  const handleDeleteStudent = async () => {
    if (!confirm("Tələbəni silmək istədiyinizə əminsiniz?")) return;
    const { error } = await deleteStudent(student.id);
    if (error) return alert("Xəta: " + error.message);
    refreshStudents();
  };

  /** — Q/B–Bal əlavə et və ya yenilə */
  const handleScoreSubmit = async () => {
    if (!date) return alert("Zəhmət olmasa tarix seçin");
    if (attendance == null || score == null)
      return alert("Q/B və balı seçin");

    setLoading(true);

    if (initialScore && initialScore.id && isEditingScore) {
      // mövcud qeydi yenilə
      const { error } = await updateScore({
        id: initialScore.id,
        attendance,
        score,
      });
      setLoading(false);
      if (error) return alert("Xəta: " + error.message);
      alert("Düzəliş edildi ✅");
    } else {
      // yeni qeyd əlavə et
      const { data, error } = await addScore({
        student_id: student.id,
        attendance,
        score,
        date,
      });
      setLoading(false);
      if (error) return alert("Xəta: " + error.message);
      if (!data || data.length === 0) return alert("Serverdən data gəlmədi");
      alert("Əlavə olundu ✅");
    }

    // parent-dakı xəritəni yenilə, formu statik rejimə qaytar
    refreshScores();
  };

  /** — Qeydiyyatı sil */
  const handleDeleteScore = async () => {
    if (!initialScore?.id) return;
    if (!confirm("Qeydiyyatı silmək istədiyinizə əminsiniz?")) return;
    const { error } = await deleteScore(initialScore.id);
    if (error) return alert("Xəta: " + error.message);
    // parent-dakı xəritəni yeniləyək
    refreshScores();
  };

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 rounded-lg shadow-md p-5 flex flex-col gap-4 hover:shadow-lg transition">
      {/* — Ad + redaktə/sil */}
      <div className="flex justify-between items-center">
        {isEditingName ? (
          <div className="flex gap-2 items-center">
            <input
              className="border p-1 rounded"
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
            />
            <button onClick={handleSaveName} className="text-green-600">
              Yadda saxla
            </button>
            <button
              onClick={() => {
                setIsEditingName(false);
                setNewFullName(student.full_name);
              }}
              className="text-gray-600"
            >
              Ləğv et
            </button>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <h2 className="text-lg font-semibold">{student.full_name}</h2>
            <button
              onClick={() => setIsEditingName(true)}
              className="text-blue-600"
            >
              Dəyiş
            </button>
            <button
              onClick={handleDeleteStudent}
              className="text-red-600"
            >
              Sil
            </button>
          </div>
        )}
        <span className="text-sm text-gray-500">
          {new Date(student.enrollment_date).toLocaleDateString()}
        </span>
      </div>

      {/* — Q/B–Bal hissəsi */}
      {initialScore && !isEditingScore ? (
        <>
          <p className="text-sm">
            <strong>Tarix:</strong> {date}
          </p>
          <p className="text-sm">
            <strong>Q/B:</strong> {initialScore.attendance ? "Var ✅" : "Yox ❌"}
          </p>
          <p className="text-sm">
            <strong>Bal:</strong> {initialScore.score}
          </p>
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setIsEditingScore(true)}
              className="text-blue-600"
            >
              Düzəliş et
            </button>
            <button
              onClick={handleDeleteScore}
              className="text-red-600"
            >
              Sil
            </button>
          </div>
        </>
      ) : (
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <ScoreDropdown
            type="attendance"
            value={attendance}
            onChange={setAttendance}
          />
          <ScoreDropdown
            type="score"
            value={score}
            onChange={setScore}
          />
          <button
            onClick={handleScoreSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {loading
              ? "Yüklənir…"
              : initialScore
              ? "Yadda saxla"
              : "Əlavə et"}
          </button>
        </div>
      )}
    </div>
  );
}
