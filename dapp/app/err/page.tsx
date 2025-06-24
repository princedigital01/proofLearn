"use client"
import { useState } from "react";

const page = () => {
    const [shouldCrash, setShouldCrash] = useState(false);
  if (shouldCrash) throw new Error("Manual crash for testing");

  return (
    <button onClick={() => setShouldCrash(true)}>Crash the app 🔥</button>
  );
}

export default page