"use client"

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from "@/app/loading";

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import AddLessonModal from "@/components/educators/AddLessonModal"
import LessonCard from "@/components/educators/LessonCard"
import Header from "@/components/Header"

export default function EditCoursePage() {

  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/login');
    },
  });


  if (status === "loading") {
    return <Loading />;
  }

  const firstName = session.user?.name?.trim().split(/\s+/)[0] || 'User';
  const role = session.user?.role;


  const { id } = useParams()
  const [title, setTitle] = useState("")
  const [error, setError] = useState("initial")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState<number>(0)
  const [statusS, setStatusS] = useState<"draft" | "published">("draft")
  const [lessons, setLessons] = useState<any[]>([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [btnText1, setBtnText1] = useState("save changes")
  const [btnText2, setBtnText2] = useState("")
  const [lessonEdit, setLessonEdit] = useState<number>(NaN);

useEffect(() => {
  setError("use effect"+id)
  
setError("id "+id)
  const fetchCourse = async () => {
    
    try {
      setError("id2 "+id)
      const res = await fetch(`/api/courses/${id}`);
      setError("id3 "+id)
      if (!res.ok) throw new Error("Failed to fetch");
setError("1234567"+res.ok)
      const data = await res.json();
      setError("id: "+id)
      setTitle(data.title || id);
      setDescription(data.description || "");
      setCategory(data.category || "");
      setPrice(data.price || 0);
      setLessons(data.lessons || []);
      setStatusS(data.status || "draft");
      setBtnText2(data.status === "published" ? "Unpublish" : "Publish");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError("Failed to load course");
    } finally {
      setLoading(false);
    }
    setLoading(false);
  };

  fetchCourse();
  
}, [id]);

  const handleUpdateCourse = async () => {
    setBtnText1("loading...")
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          category,
          price,
          lessons,
        }),
      })
      const data = await res.json()

      console.log("Updated:", data)
      setBtnText1("done")
      setStatusS(data.status)
      setBtnText2(data.status === "published" ? "Unpublish" : "Publish")
      setTimeout(() => { setBtnText1("save changes") }, 2000)
    } catch (err) {
      setError("Update failed")
      setBtnText1("save changes")
    }
  }

  const handleTogglePublish = async () => {
    setBtnText2("loading..")
    const newStatus = statusS === "draft" ? "published" : "draft"
    try {
      const res = await fetch(`/api/courses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })
      const data = await res.json()
      if (res.ok) {

        console.log(`Course ${newStatus}`)
        setStatusS(newStatus)
        setBtnText2("done")
        setTimeout(() => { setBtnText2(newStatus === "published" ? "Unpublish" : "Publish") }, 1000)
      } else {
        setBtnText2(statusS === "published" ? "Unpublish" : "Publish")
        setError("Failed to toggle publish" + data.error)
      }
    } catch (err) {
      setBtnText2(statusS === "published" ? "Unpublish" : "Publish")
      setError("Toggle publish error")
    }
  }

  const handleSubmitLesson = (lesson: any) => {
    if (Number.isNaN(lessonEdit)) {
      setLessons(prev => [...prev, lesson])
    } else {
      setLessons(prev => {
        const updated = [...prev]
        updated[lessonEdit] = lesson
        return updated
      })
    }
    setShowModal(false)
  }


  const EditLesson = (i: number) => {
    setLessonEdit(i)
    setShowModal(true)

  }

  const removeLesson = (i: number) => {
    const confirmDelete = confirm(`Are you sure you want to delete "${lessons[i].title}"?`)
    if (!confirmDelete) return

    setLessons(prev => prev.filter((_, index) => index !== i))
  }


  useEffect(() => {
    if (showModal == false) setLessonEdit(NaN)
  }, [showModal])

  return (
    <>
      <Header title={`Edit Course`}>{error}</Header>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Edit Course</h1>
<p>{error}</p>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <div className="space-y-4">
              {error ?? (
                <p className='bg-[#ff0000] font-semibold text-sm'>{error}</p>
              )
              }
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
                type="number"
                placeholder="Price"
                className="w-full border p-2 rounded"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
              />

              <div className="flex gap-4">
                <button
                  onClick={handleUpdateCourse}
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {btnText1}
                </button>

                <button
                  onClick={handleTogglePublish}
                  className={`${statusS === "published" ? "bg-red-600" : "bg-green-600"
                    } text-white px-4 py-2 rounded`}
                >
                  {btnText2}
                </button>
              </div>
            </div>

            <h2 className="mt-8 text-xl font-semibold">Lessons</h2>
            <div className="space-y-2 mt-4">
              {lessons.map((lesson, i) => (
                <LessonCard onClick={EditLesson} key={i} lesson={lesson} index={i + 1} onClose={removeLesson} />
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
                edit={lessonEdit}
                initialLesson={!Number.isNaN(lessonEdit) ? lessons[lessonEdit] : undefined}
                onClose={() => setShowModal(false)}
                onSave={handleSubmitLesson}
              />
            )}
          </>
        )}
      </div>
    </>
  )
}
