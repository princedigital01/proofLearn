'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function QuizPage() {
  const { courseId, lessonId } = useParams()
  const router = useRouter()
  const [quiz, setQuiz] = useState<any>(null)
  const [answers, setAnswers] = useState<{ [key: string]: any }>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuiz = async () => {
      const res = await fetch(`/api/quiz/${lessonId}`)
      const data = await res.json()
      setQuiz(data)
      setLoading(false)
    }
    fetchQuiz()
  }, [lessonId])

  const handleAnswer = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = async () => {
    const res = await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ courseId, lessonId, answers }),
    })

    const data = await res.json()
    if (res.ok) {
      alert(`You scored ${data.score}%`)
      router.push(`/courses/${courseId}/lessons/${lessonId}`)
    } else {
      alert(data.error || 'Something went wrong')
    }
  }

  if (loading) return <p>Loading quiz...</p>
  if (!quiz) return <p>Quiz not found</p>
console.log(quiz);
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{quiz.title}</h1>
      {
      
      quiz.questions.map((q: any, i: number) => (
        <div key={q._id} className="mb-6">
          <p className="font-semibold">{i + 1}. {q.text}</p>
          {q.type === 'multiple-choice' && q.options.map((opt: string) => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={q._id}
                value={opt}
                onChange={() => handleAnswer(q._id, opt)}
                checked={answers[q._id] === opt}
              /> {opt}
            </label>
          ))}
          {q.type === 'true-false' && ['True', 'False'].map(opt => (
            <label key={opt} className="block">
              <input
                type="radio"
                name={q._id}
                value={opt}
                onChange={() => handleAnswer(q._id, opt)}
                checked={answers[q._id] === opt}
              /> {opt}
            </label>
          ))}
          {q.type === 'fill-in-the-blank' && (
            <input
              type="text"
              name={q._id}
              value={answers[q._id] || ''}
              onChange={(e) => handleAnswer(q._id, e.target.value)}
              className="border mt-2 p-1 w-full"
            />
          )}
        </div>
      ))}
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded">
        Submit Quiz
      </button>
    </div>
  )
}
