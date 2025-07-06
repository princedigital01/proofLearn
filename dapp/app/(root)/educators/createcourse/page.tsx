"use client"
import { useSession } from 'next-auth/react';
import Loading from "@/app/loading";
import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"

export default function CreateCoursePage() {

  
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
  
  


  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [price, setPrice] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [text, setText] = useState("Create Course")


  const handleCreateCourse = async () => {
    setError("")
    setText("Creating...")
    setLoading(true)

    if (!title || !description || !category || !price) {
      setError("Please fill in all fields.")
      setText("Create Course")
      setLoading(false)
      return
    }

    try {
      const res = await fetch("/api/courses/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          category,
          price: parseFloat(price),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Course creation failed");
        setText("Create Course")
        return
      }

      const courseId = data.courseId
      setText("Course Created, redirecting...")


      // Redirect to edit course page
      router.push(`/educators/editCourse/${courseId}`)
    } catch (err: any) {
      console.error(err)
      setError(err.message)
      setText("Create Course")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="">

      <Header title={"create"}>
{""}
      </Header>
      {/* <h1 className="text-2xl font-bold mb-4">Create New Course</h1> */}

      <div className="space-y-4 max-w-3xl mx-auto p-6">
        {error && <p className="text-red-500">{error}</p>}

        <input
          type="text"
          placeholder="Course Title"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="w-full border p-2 rounded"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full border p-2 rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price (USD)"
          className="w-full border p-2 rounded"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
        />

        <button
          onClick={handleCreateCourse}
          className={`bg-blue-600 text-white px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          disabled={loading}
        >
          {text}
        </button>
      </div>
    </div>
  )
}
