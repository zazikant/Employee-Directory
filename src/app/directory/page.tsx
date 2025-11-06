'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import EmployeeCard from '@/components/EmployeeCard'
import { Employee } from '@/types'
import Image from 'next/image'
import Link from 'next/link'

const fuzzyMatch = (searchTerm: string, text: string) => {
  searchTerm = searchTerm.toLowerCase();
  text = text.toLowerCase();
  let searchIndex = 0;
  for (let i = 0; i < text.length && searchIndex < searchTerm.length; i++) {
    if (searchTerm[searchIndex] === text[i]) {
      searchIndex++;
    }
  }
  return searchIndex === searchTerm.length;
};

export default function DirectoryPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
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
    const searchContent = `${employee.name} ${employee.department}`
    return fuzzyMatch(searchTerm, searchContent)
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-8 bg-primary text-black px-4 py-2 rounded inline-block">
        &larr; Go back to Home
      </Link>
      <div className="text-center">
        <Image
          src="https://gemengserv.com/wp-content/uploads/2021/04/GEM-Engserv-Pvt-Ltd-logo-updated.png"
          alt="GEM Engserv Pvt Ltd Logo"
          width={150}
          height={40}
          className="mx-auto mb-4"
        />
        <h1 className="text-4xl font-bold mb-8">Employee Directory</h1>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 mb-8 border rounded w-full"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      </div>
    </div>
  )
}
