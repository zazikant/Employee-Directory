'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useParams, useRouter } from 'next/navigation'
import { Employee } from '@/types'
import Image from 'next/image'
import EmployeeCard from '@/components/EmployeeCard'

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

export default function EmployeePage() {
  const { id } = useParams()
  const router = useRouter()
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [allEmployees, setAllEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchEmployees = async () => {
      const { data, error } = await supabase.from('employees').select('*')
      if (error) {
        console.error('Error fetching employees:', error)
      } else {
        setAllEmployees(data)
        const currentEmployee = data.find((emp) => emp.id === id)
        setEmployee(currentEmployee || null)
      }
    }
    fetchEmployees()
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

  const otherEmployees = allEmployees.filter(
    (emp) => emp.id !== id && fuzzyMatch(searchTerm, `${emp.name} ${emp.department}`)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.push('/directory')}
        className="mb-8 bg-primary text-black px-4 py-2 rounded"
      >
        &larr; Go back to Directory
      </button>
      <div className="border rounded-lg p-8 mb-8">
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

      <h2 className="text-3xl font-bold mb-4">Other Employees</h2>
      <input
        type="text"
        placeholder="Search other employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="p-2 mb-8 border rounded w-full"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2">
        {otherEmployees.map((emp) => (
          <EmployeeCard key={emp.id} employee={emp} />
        ))}
      </div>
    </div>
  )
}
