// app/educators/create-course/page.tsx
"use client"

import { useState } from "react"
import AddLessonModal from "@/components/educators/AddLessonModal"
import LessonCard from "@/components/educators/LessonCard"

export default function CreateCoursePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)

  const handleCreateCourse = async () => {
    // Implement backend API call to create course
    console.log({ title, description, category, thumbnail })
  }

  const handleAddLesson = (lesson: any) => {
    setLessons(prev => [...prev, lesson])
    setShowModal(false)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Course</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Course Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          className="w-full border p-2 rounded"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />
        <input
          type="file"
          onChange={e => setThumbnail(e.target.files?.[0] || null)}
        />
        <button
          onClick={handleCreateCourse}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Course
        </button>
      </div>

      <h2 className="mt-8 text-xl font-semibold">Lessons</h2>
      <div className="space-y-2 mt-4">
        {lessons.map((lesson, i) => (
          <LessonCard key={i} lesson={lesson} index={i + 1} />
        ))}
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="mt-6 px-4 py-2 bg-green-600 text-white rounded"
      >
        + Add Lesson or Quiz
      </button>

      {showModal && (
        <AddLessonModal
          onClose={() => setShowModal(false)}
          onSave={handleAddLesson}
        />
      )}
    </div>
  )
}
