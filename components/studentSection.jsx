// components/studentSection.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { addStudent, getStudents } from '@/app/dashboard/actions';
import StudentsTable from './studentsTable';

export default function StudentSection() {
  const [students, setStudents] = useState([]);
  const [newName, setNewName] = useState('');
  const [enrollDate, setEnrollDate] = useState('');
  const [loading, setLoading] = useState(false);
  // Defolt olaraq bu gün
  const [date, setDate] = useState(
    () => new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    const { data, error } = await getStudents();
    if (error) {
      alert('Xəta siyahılarkən: ' + error.message);
    } else {
      setStudents(data);
    }
  }

  async function handleAddStudent() {
    if (!newName.trim() || !enrollDate) {
      return alert('Ad və qeyd tarixi boş ola bilməz');
    }
    setLoading(true);
    const { error } = await addStudent({
      full_name: newName.trim(),
      enrollment_date: enrollDate,
    });
    setLoading(false);

    if (error) {
      alert('Xəta: ' + error.message);
    } else {
      setNewName('');
      setEnrollDate('');
      fetchStudents();
    }
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Tələbələri İdarə Et</h1>

      {/* Yeni tələbə əlavə et */}
      <div className="mb-6">
        <div className="text-lg font-semibold mb-2">
          Yeni Tələbə Əlavə Et
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Tələbə adı"
            className="border p-2 rounded flex-1"
          />
          <input
            type="date"
            value={enrollDate}
            onChange={e => setEnrollDate(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={handleAddStudent}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {loading ? 'Yüklənir…' : 'Əlavə et'}
          </button>
        </div>
      </div>

      {/* Tarix seç (Bal & Q/B üçün) */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-lg font-semibold">Tarix seç:</label>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* Tələbələr cədvəli */}
      <StudentsTable students={students} date={date} />
    </div>
  );
}
