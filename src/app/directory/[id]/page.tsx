'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useParams } from 'next/navigation'
import { Employee } from '@/types'
// import Image from 'next/image' // Commenting out for debugging

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="border rounded-lg p-8">
        <div className="flex items-center mb-8">
          <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden">
            {employee.photo_url ? (
              // Using a standard img tag for debugging
              <img
                src={employee.photo_url}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <div className="ml-8">
            <h1 className="text-4xl font-bold mb-4">{employee.name}</h1>
            <p className="text-xl text-gray-600">{employee.department}</p>
            <p className="text-xl text-gray-600">Tenure: {employee.tenure_in_gem} years</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Hobbies</h2>
            <p>{employee.hobbies}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Personal Traits</h2>
            <p>{employee.personal_traits}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
