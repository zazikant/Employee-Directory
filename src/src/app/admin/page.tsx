'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Employee } from '@/types'
import { useDebounce } from '@/hooks/useDebounce'

export default function AdminPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const recordsPerPage = 20
  
  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  const fetchEmployees = useCallback(async () => {
    setIsLoading(true)
    
    if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
      // Server-side search using RPC function
      const { data, error } = await supabase
        .rpc('search_employees_advanced', { 
          search_term: debouncedSearchTerm 
        })
      
      if (error) {
        console.error('Error searching employees:', error)
      } else {
        setEmployees(data || [])
      }
    } else {
      // Fetch all employees when not searching
      const { data, error } = await supabase.from('employees').select('*').order('name')
      if (error) {
        console.error('Error fetching employees:', error)
      } else {
        setEmployees(data || [])
      }
    }
    
    setIsLoading(false)
  }, [debouncedSearchTerm])

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      } else {
        fetchEmployees()
      }
    }
    checkUser()
  }, [router, fetchEmployees])

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      const { error } = await supabase.from('employees').delete().eq('id', id)
      if (error) {
        alert(error.message)
      } else {
        alert('Employee deleted successfully!')
        fetchEmployees()
      }
    }
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert(error.message)
    } else {
      router.push('/login')
    }
  }

  const tenureText = (employee: Employee) => {
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

  // Calculate pagination (server already filtered)
  const totalPages = Math.ceil(employees.length / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const paginatedEmployees = employees.slice(startIndex, endIndex)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-secondary text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Admin Panel</h1>
        <div>
          <Link href="/admin/add">
            <button className="bg-primary text-black px-4 py-2 rounded mr-4">
              Add Employee
            </button>
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees by name or department..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="p-2 border-2 border-primary rounded w-full text-white placeholder-gray-300 bg-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-2">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-300">
        Showing {startIndex + 1}-{Math.min(endIndex, employees.length)} of {employees.length} employees
        {searchTerm && searchTerm.length >= 2 && ` (search results)`}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 text-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b border-gray-700">Name</th>
              <th className="py-2 px-4 border-b border-gray-700">Department</th>
              <th className="py-2 px-4 border-b border-gray-700">Tenure</th>
              <th className="py-2 px-4 border-b border-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="py-2 px-4 border-b border-gray-700">{employee.name}</td>
                <td className="py-2 px-4 border-b border-gray-700">{employee.department}</td>
                <td className="py-2 px-4 border-b border-gray-700">{tenureText(employee)}</td>
                <td className="py-2 px-4 border-b border-gray-700">
                  <Link href={`/admin/edit/${employee.id}`}>
                    <button className="text-primary mr-4">Edit</button>
                  </Link>
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
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
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
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
  )
}
