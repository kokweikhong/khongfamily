"use client";

import { useEffect } from 'react'

export default function Home() {

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/finance/record/`)
      .then((res) => res.json())
      .then((data) => console.log(data))
  }, [])

  return (
    <main>
      <div>Khong Family</div>
    </main>
  )
}
