// components/ScoreDropdown.jsx
"use client";

import React from 'react';

export default function ScoreDropdown({ type, value, onChange }) {
  // attendance ⇒ boolean; score ⇒ 0–100 ədədlər
  const options =
    type === 'attendance'
      ? [
          { label: 'Var ✅', value: true },
          { label: 'Yox ❌', value: false },
        ]
      : Array.from({ length: 101 }, (_, i) => i);

  return (
    <select
      className="w-full md:w-32 border border-gray-300 rounded-md px-3 py-2
                 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400
                 transition-colors"
      value={value ?? ''}
      onChange={(e) => {
        const val =
          type === 'attendance'
            ? e.target.value === 'true'
            : parseInt(e.target.value, 10);
        onChange(val);
      }}
    >
      <option disabled value="">
        {type === 'attendance' ? 'Q/B seç' : 'Bal seç'}
      </option>
      {options.map((opt) =>
        typeof opt === 'object' ? (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ) : (
          <option key={opt} value={opt}>
            {opt}
          </option>
        )
      )}
    </select>
  );
}
