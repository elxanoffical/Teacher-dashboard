// server/app/dashboard/actions.js
"use server";

import supabase from "@/lib/supabase";

/* 🧑‍🎓 Tələbələri idarəetmə */

// Tələbə siyahısını al (id, ad, qeyd tarixi)
export async function getStudents() {
  return await supabase
    .from("students")
    .select("id, full_name, enrollment_date")
    .order("full_name", { ascending: true });
}

// Yeni tələbə əlavə et (ad + qeyd tarixi)
export async function addStudent({ full_name, enrollment_date }) {
  return await supabase.from("students").insert({ full_name, enrollment_date });
}

// Tələbəni redaktə et (yalnız adı)
export async function updateStudent(id, full_name) {
  return await supabase.from("students").update({ full_name }).eq("id", id);
}

// Tələbəni sil
export async function deleteStudent(id) {
  return await supabase.from("students").delete().eq("id", id);
}

/* 🎯 Qiymət və Q/B idarəetməsi */

// Yeni qiymət əlavə et
export async function addScore({ student_id, attendance, score, date }) {
  const { data, error } = await supabase
    .from('scores')
    .insert([{ student_id, attendance, score, date }])
    .select('id, student_id, attendance, score, date')

  return { data, error }
}
// Tarixə görə qiymətləri al
export async function getScoresByDate(date) {
  return await supabase
    .from("scores")
    .select("*, students(full_name)")
    .eq("date", date)
    .order("created_at", { ascending: true });
}

// Bütün qeydiyyatları al (ana səhifə üçün)
export async function getAllScores() {
  return await supabase
    .from("scores")
    .select("id, date, attendance, score, students(full_name)")
    .order("date", { ascending: false });
}

// Qiyməti yenilə
export async function updateScore({ id, score, attendance }) {
  return await supabase
    .from("scores")
    .update({ score, attendance })
    .eq("id", id);
}

// Qiyməti sil
export async function deleteScore(id) {
  return await supabase.from("scores").delete().eq("id", id);
}
