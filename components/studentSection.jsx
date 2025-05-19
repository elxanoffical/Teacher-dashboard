// components/studentSection.jsx
"use client";

import React, { useEffect, useState } from "react";
import { addStudent, getStudents } from "@/app/dashboard/actions";
import StudentsTable from "./studentsTable";

export default function StudentSection() {
  const [students, setStudents] = useState([]);
  const [newName, setNewName] = useState("");
  const [enrollDate, setEnrollDate] = useState("");
  const [loading, setLoading] = useState(false);
  // Defolt olaraq bu gün
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data, error } = await getStudents();
    if (error) {
      alert("Xəta siyahılarkən: " + error.message);
    } else {
      setStudents(data);
    }
  }

  async function handleAddStudent() {
    if (!newName.trim() || !enrollDate) {
      return alert("Ad və qeyd tarixi boş ola bilməz");
    }
    setLoading(true);
    const { error } = await addStudent({
      full_name: newName.trim(),
      enrollment_date: enrollDate,
    });
    setLoading(false);

    if (error) {
      alert("Xəta: " + error.message);
    } else {
      setNewName("");
      setEnrollDate("");
      fetchStudents();
    }
  }

   return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Page Title */}
        <h1
          className="text-4xl md:text-5xl font-extrabold text-center
                     bg-clip-text text-transparent
                     bg-gradient-to-r from-purple-600 to-indigo-500"
        >
          Tələbələri İdarə Et
        </h1>

        {/* Add Student Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Yeni Tələbə Əlavə Et
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Tələbə adı"
              className="border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         transition"
            />
            <input
              type="date"
              value={enrollDate}
              onChange={(e) => setEnrollDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-indigo-400
                         transition"
            />
            <button
              onClick={handleAddStudent}
              disabled={loading}
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700
                         text-white font-medium rounded-md px-6 py-2
                         flex items-center justify-center
                         transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Yüklənir…" : "Əlavə et"}
            </button>
          </div>
        </div>

        {/* Students Table Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Tələbələr
          </h2>
          <StudentsTable
            students={students}
            date={date}
            refreshStudents={fetchStudents}
          />
        </div>

      </div>
    </div>
  );
}
