'use client'

import Image from 'next/image'
import { Employee } from '@/types'

interface EmployeeCardProps {
  employee: Employee
  onCardClick: () => void
}

export default function EmployeeCard({ employee, onCardClick }: EmployeeCardProps) {
  return (
    <div className="w-16 h-16 relative cursor-pointer" onClick={onCardClick}>
      <Image
        src={employee.photo_url!}
        alt={employee.name}
        layout="fill"
        objectFit="cover"
        className="rounded-lg"
      />
    </div>
  )
}
