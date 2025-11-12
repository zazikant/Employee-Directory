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
  const [otherEmployees, setOtherEmployees] = useState<Employee[]>([])
  const [totalOthers, setTotalOthers] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isSearching, setIsSearching] = useState(false)
  const employeesPerPage = 80

  useEffect(() => {
    const fetchCurrentEmployee = async () => {
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
    fetchCurrentEmployee()
  }, [id])

  useEffect(() => {
    const fetchOtherEmployees = async () => {
      if (searchTerm) {
        setIsSearching(true)
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .neq('id', id)
        
        if (error) {
          console.error('Error fetching employees:', error)
        } else {
          setOtherEmployees(data || [])
          setTotalOthers(data?.length || 0)
        }
      } else {
        setIsSearching(false)
        const startIndex = (currentPage - 1) * employeesPerPage
        const endIndex = startIndex + employeesPerPage - 1

        const { count } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })
          .neq('id', id)

        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .neq('id', id)
          .range(startIndex, endIndex)
          .order('name')

        if (error) {
          console.error('Error fetching employees:', error)
        } else {
          setOtherEmployees(data || [])
          setTotalOthers(count || 0)
        }
      }
    }
    
    if (employee) {
      fetchOtherEmployees()
    }
  }, [id, employee, currentPage, searchTerm])

  if (!employee) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading...</div>
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

  const filteredOtherEmployees = isSearching
    ? otherEmployees.filter((emp) => 
        fuzzyMatch(searchTerm, `${emp.name} ${emp.department}`)
      )
    : otherEmployees

  const totalPages = isSearching 
    ? 1 
    : Math.ceil(totalOthers / employeesPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      window.scrollTo({ top: document.getElementById('other-employees')?.offsetTop || 0, behavior: 'smooth' })
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const startIndex = isSearching ? 0 : (currentPage - 1) * employeesPerPage
  const endIndex = isSearching 
    ? filteredOtherEmployees.length 
    : Math.min(startIndex + employeesPerPage, totalOthers)

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

      <div id="other-employees">
        <h2 className="text-3xl font-bold mb-4">Other Employees</h2>
        <input
          type="text"
          placeholder="Search other employees..."
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="p-2 mb-4 border rounded w-full text-black"
        />
        
        {/* Results count */}
        <div className="mb-6 text-sm text-gray-300">
          {isSearching ? (
            <span>Found {filteredOtherEmployees.length} matching employees</span>
          ) : (
            <span>Showing {startIndex + 1}-{endIndex} of {totalOthers} employees</span>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-0.5">
          {filteredOtherEmployees.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} />
          ))}
        </div>

        {/* Pagination - only show when not searching */}
        {!isSearching && totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-black hover:bg-opacity-90'
              }`}
            >
              Previous
            </button>
            
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded ${
                      currentPage === pageNum
                        ? 'bg-primary text-black font-bold'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-primary text-black hover:bg-opacity-90'
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
