'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useParams } from 'next/navigation'
import { Employee } from '@/types'
import Image from 'next/image'

export default function EmployeePage() {
  const { id } = useParams()
  const [employee, setEmployee] = useState<Employee | null>(null)

  useEffect(() => {
    const fetchEmployee = async () => {
      if (id) {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('id', id)
          .single()
        if (error) {
          console.error('Error fetching employee:', error)
        } else {
          setEmployee(data)
        }
      }
    }
    fetchEmployee()
  }, [id])

  if (!employee) {
    return <div>Loading...</div>
  }

  const tenureText = () => {
    const years = employee.tenure_years || 0
    const months = employee.tenure_months || 0
    if (years > 0 && months > 0) {
      return `${years} years, ${months} months`
    }
    if (years > 0) {
      return `${years} years`
    }
    if (months > 0) {
      return `${months} months`
    }
    return 'N/A'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="border rounded-lg p-8">
        <div className="flex items-center mb-8">
          <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden relative">
            {employee.photo_url ? (
              <Image
                src={employee.photo_url}
                alt={employee.name}
                layout="fill"
                objectFit="cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <div className="ml-8">
            <h1 className="text-4xl font-bold mb-4">{employee.name}</h1>
            <p className="text-xl text-white">Department: {employee.department}</p>
            <p className="text-xl text-white">Tenure: {tenureText()}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 bg-primary p-2 rounded text-secondary inline-block">Hobbies</h2>
            <p>{employee.hobbies}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4 bg-primary p-2 rounded text-secondary inline-block">Personal Traits</h2>
            <p>{employee.personal_traits}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
