"use client"
import Link from "next/link"
import Image from "next/image"

const notfound = () => {
  return (
    <div className="text-xl flex flex-col gap-4 justify-center items-center pt-20">
      <Image src="/images/logo.svg" width={200} height={200} alt="404" />
      <h2 className="text-3xl bold text-c-primary">Not Found</h2>
      <p>Could not find requested resource</p>
      <Link className="text-c-red" href="/">Return Home</Link>
    </div>
  )
}

export default notfound