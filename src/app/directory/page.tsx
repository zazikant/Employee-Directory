'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import Link from 'next/link'

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
    const searchContent = `${employee.full_name} ${employee.job_title} ${employee.department}`.toLowerCase()
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
          <Link href={`/directory/${employee.id}`} key={employee.id}>
            <div className="border rounded-lg p-4 cursor-pointer">
              <h2 className="text-xl font-bold">{employee.full_name}</h2>
              <p className="text-gray-600">{employee.job_title}</p>
              <p className="text-gray-600">{employee.department}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
