import StudentsSection from '@/components/studentSection'

export default function DashboardPage() {
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <StudentsSection />
    </main>
  )
}
