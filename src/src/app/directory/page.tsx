'use client'

import { useState, useEffect, Suspense } from 'react'
import { supabase } from '@/utils/supabase'
import EmployeeCard from '@/components/EmployeeCard'
import { Employee } from '@/types'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'

function DirectoryContent() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentPage = parseInt(searchParams.get('page') || '1', 10)
  const employeesPerPage = 80
  
  // Debounce search term to reduce API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true)
      
      if (debouncedSearchTerm && debouncedSearchTerm.length >= 2) {
        // Server-side search using RPC function
        setIsSearching(true)
        const { data, error } = await supabase
          .rpc('search_employees_advanced', { 
            search_term: debouncedSearchTerm 
          })
        
        if (error) {
          console.error('Error searching employees:', error)
        } else {
          setEmployees(data || [])
          setTotalCount(data?.length || 0)
        }
      } else {
        // Regular pagination without search
        setIsSearching(false)
        const startIndex = (currentPage - 1) * employeesPerPage
        const endIndex = startIndex + employeesPerPage - 1

        const { count } = await supabase
          .from('employees')
          .select('*', { count: 'exact', head: true })

        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .range(startIndex, endIndex)
          .order('name')

        if (error) {
          console.error('Error fetching employees:', error)
        } else {
          setEmployees(data || [])
          setTotalCount(count || 0)
        }
      }
      setIsLoading(false)
    }
    
    fetchEmployees()
  }, [currentPage, debouncedSearchTerm])

  const filteredEmployees = employees

  const totalPages = isSearching 
    ? 1 
    : Math.ceil(totalCount / employeesPerPage)

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      router.push(`/directory?page=${newPage}`)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSearchChange = (value: string) => {
    setSearchTerm(value)
    if (currentPage !== 1 && !value) {
      router.push('/directory')
    }
  }

  const startIndex = isSearching ? 0 : (currentPage - 1) * employeesPerPage
  const endIndex = isSearching 
    ? filteredEmployees.length 
    : Math.min(startIndex + employeesPerPage, totalCount)

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="mb-8 bg-primary text-black px-4 py-2 rounded inline-block">
        &larr; Go back to Home
      </Link>
      <div className="text-center">
        <div className="relative">
          <input
            type="text"
            placeholder="Search employees by name or department..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="p-2 mb-4 border-2 border-primary rounded w-full text-white placeholder-gray-300 bg-transparent"
          />
          {isLoading && (
            <div className="absolute right-3 top-2">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          )}
        </div>
        
        {/* Results count */}
        <div className="mb-6 text-sm text-gray-300">
          {isSearching ? (
            <span>Found {filteredEmployees.length} matching employees</span>
          ) : (
            <span>Showing {startIndex + 1}-{endIndex} of {totalCount} employees</span>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-0.5">
          {filteredEmployees.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
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

export default function DirectoryPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading directory...</div>
      </div>
    }>
      <DirectoryContent />
    </Suspense>
  )
}
