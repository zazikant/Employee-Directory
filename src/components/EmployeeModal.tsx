'use client'

import { Employee } from '@/types'
import Image from 'next/image'

interface EmployeeModalProps {
  employee: Employee
  onClose: () => void
}

export default function EmployeeModal({ employee, onClose }: EmployeeModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
        <div className="relative w-full h-96 mb-4">
          <Image
            src={employee.photo_url!}
            alt={employee.name}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <h2 className="text-2xl font-bold">{employee.name}</h2>
        <p className="text-gray-600">{employee.department}</p>
        <div className="mt-4">
          <h3 className="font-bold">Hobbies</h3>
          <p>{employee.hobbies}</p>
        </div>
        <div className="mt-4">
          <h3 className="font-bold">Tenure</h3>
          <p>{employee.tenure_years} years and {employee.tenure_months} months</p>
        </div>
        {employee.personal_traits && (
          <div className="mt-4">
            <h3 className="font-bold">Personal Traits</h3>
            <p>{employee.personal_traits}</p>
          </div>
        )}
        <button onClick={onClose} className="mt-4 bg-primary text-black px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  )
}
