'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'
// import Image from 'next/image' // Commenting out for debugging

export default function DirectoryPage() {
  const [employees, setEmployees] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employees').select('*')
      if (error) {
        console.error('Error fetching employees:', error)
      } else {
        setEmployees(data)
      }
    }
    fetchEmployees()
  }, [])

  const filteredEmployees = employees.filter((employee) => {
    const searchContent = `${employee.name} ${employee.department} ${employee.hobbies}`.toLowerCase()
    return searchContent.includes(searchTerm.toLowerCase())
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Employee Directory</h1>
      <input
        type="text"
        placeholder="Search employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-8 border rounded w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="border rounded-lg p-4 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
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
            <h2 className="text-xl font-bold mt-4">{employee.name}</h2>
            <p className="text-gray-600">{employee.department}</p>
            <p className="text-gray-600">Tenure: {employee.tenure_in_gem} years</p>
            <Link href={`/directory/${employee.id}`} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
              Preview Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
