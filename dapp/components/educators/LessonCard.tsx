// components/educators/LessonCard.tsx

export default function LessonCard({
  lesson,
  index,
  onClose,
  onClick
}: {
  onClose: (i: number) => void
  onClick: (i: number) => void
  lesson: any
  index: number
}) {
  const handleClose = () => {
    onClose(index-1)
  }
  const handleClick = () => {
    onClick(index-1)
  }

  return (
    <div onClick={handleClick} className="border rounded p-4 bg-white shadow-sm relative">
      <button
        onClick={handleClose}
        className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
      >
        ✖
      </button>

      <h3 className="font-semibold text-gray-800">
        {index}. {lesson.title}{' '}
        <span className="text-xs ml-2 px-2 py-1 bg-gray-200 rounded-full">
          {lesson.type}
        </span>
      </h3>

      {lesson.type === 'video' && lesson.videoUrl && (
        <p className="text-sm text-gray-600 mt-1">
          🎥 Video: {lesson.videoUrl}
        </p>
      )}

      {lesson.type === 'quiz' && lesson.quiz?.length > 0 && (
        <p className="text-sm text-gray-600 mt-1">
          🧠 {lesson.quiz.length} questions
        </p>
      )}
    </div>
  )
}
