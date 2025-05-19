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
      className="border px-2 py-1 rounded"
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
