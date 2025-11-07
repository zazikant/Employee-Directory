'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Employee } from '@/types'

export default function EmployeeCard({ employee }: { employee: Employee }) {
  const [isFlipped, setIsFlipped] = useState(false)

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div className="group perspective-1000" onClick={handleFlip}>
      <div
        className={`relative w-32 h-32 transform-style-3d transition-transform duration-700 ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front of the card */}
        <div className="absolute w-full h-full backface-hidden">
          <Image
            src={employee.photo_url!}
            alt={employee.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        {/* Back of the card */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-secondary text-white p-4 rounded-lg flex flex-col justify-center items-center">
          <h2 className="text-lg font-bold">{employee.name}</h2>
          <p className="text-sm text-gray-200">{employee.department}</p>
          <Link href={`/directory/${employee.id}`} className="mt-2 bg-primary text-black px-3 py-1 rounded text-sm">
            Preview Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
