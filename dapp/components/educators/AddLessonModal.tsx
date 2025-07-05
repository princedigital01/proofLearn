// components/educators/AddLessonModal.tsx
"use client"

import { useState } from "react"

export default function AddLessonModal({ onClose, onSave }: { onClose: () => void, onSave: (lesson: any) => void }) {
  const [type, setType] = useState<'video' | 'quiz'>('video')
  const [title, setTitle] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [questions, setQuestions] = useState<{ text: string, options: string[], correctAnswer: string }[]>([])

  const addQuestion = () => {
    setQuestions(prev => [...prev, { text: "", options: ["", "", "", ""], correctAnswer: "" }])
  }

  const handleSave = () => {
    if (!title) return alert("Title is required")
    const lesson = {
      title,
      type,
      videoUrl: type === 'video' ? videoUrl : undefined,
      quiz: type === 'quiz' ? questions : undefined
    }
    onSave(lesson)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-gray-500">✖</button>

        <h2 className="text-xl font-bold mb-4">Add {type === 'video' ? "Lesson" : "Quiz"}</h2>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value as 'video' | 'quiz')} className="w-full border px-3 py-2 rounded">
            <option value="video">Lesson (Video)</option>
            <option value="quiz">Quiz</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block mb-1 text-sm">Title</label>
          <input value={title} onChange={e => setTitle(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        {type === 'video' && (
          <div className="mb-4">
            <label className="block mb-1 text-sm">Video URL</label>
            <input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="w-full border px-3 py-2 rounded" />
          </div>
        )}

        {type === 'quiz' && (
          <div className="mb-4 space-y-4">
            <button type="button" onClick={addQuestion} className="bg-blue-500 text-white px-3 py-1 rounded">+ Add Question</button>
            {questions.map((q, idx) => (
              <div key={idx} className="border p-3 rounded bg-gray-50">
                <label className="block mb-1 text-sm font-medium">Question {idx + 1}</label>
                <input
                  type="text"
                  value={q.text}
                  onChange={(e) => {
                    const copy = [...questions]
                    copy[idx].text = e.target.value
                    setQuestions(copy)
                  }}
                  className="w-full mb-2 border px-2 py-1 rounded"
                />
                <div className="grid grid-cols-2 gap-2">
                  {q.options.map((opt, i) => (
                    <input
                      key={i}
                      placeholder={`Option ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...questions]
                        copy[idx].options[i] = e.target.value
                        setQuestions(copy)
                      }}
                      className="border px-2 py-1 rounded"
                    />
                  ))}
                </div>
                <label className="block text-sm mt-2">Correct Answer</label>
                <input
                  value={q.correctAnswer}
                  onChange={(e) => {
                    const copy = [...questions]
                    copy[idx].correctAnswer = e.target.value
                    setQuestions(copy)
                  }}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded border">Cancel</button>
          <button onClick={handleSave} className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  )
}
