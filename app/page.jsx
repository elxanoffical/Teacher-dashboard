// app/page.jsx (və ya pages/index.jsx)
"use client";

import React, { useEffect, useState } from "react";
import { getAllScores } from "@/app/dashboard/actions";

export default function HomePage() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  async function fetchEntries() {
    const { data, error } = await getAllScores();
    if (error) {
      setError(error.message);
    } else {
      setEntries(data);
    }
    setLoading(false);
  }

  if (loading) return <p className="p-6 text-center">Yüklənir…</p>;
  if (error)
    return (
      <p className="p-6 text-center text-red-600">Xəta: {error}</p>
    );

  return (
    // — Əsas səhifə fonu da gradient olsun
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-10">
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Qeydiyyat Siyahısı
        </h1>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-auto">
            {/* — Cədvəl başlığını gradient etdik */}
            <thead className="bg-gradient-to-r from-green-400 to-blue-500">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-white">
                  Tələbə Adı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-white">
                  Tarix
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-white">
                  Q/B
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-white">
                  Bal
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {entries.map((e, idx) => (
                <tr
                  key={e.id}
                  className={`
                    ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    hover:bg-green-100 cursor-pointer
                  `}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {e.students.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(e.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {e.attendance ? "Var ✅" : "Yox ❌"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {e.score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
