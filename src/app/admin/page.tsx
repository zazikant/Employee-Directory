'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Employee } from '@/types'

export default function AdminPage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const router = useRouter()

  const fetchEmployees = useCallback(async () => {
    const { data, error } = await supabase.from('employees').select('*')
    if (error) {
      console.error('Error fetching employees:', error)
    } else {
      setEmployees(data)
    }
  }, [])

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

  return (
    <div className="container mx-auto px-4 py-8">
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
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Department</th>
              <th className="py-2 px-4 border-b">Tenure in GEM</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="py-2 px-4 border-b">{employee.name}</td>
                <td className="py-2 px-4 border-b">{employee.department}</td>
                <td className="py-2 px-4 border-b">{employee.tenure_in_gem}</td>
                <td className="py-2 px-4 border-b">
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
    </div>
  )
}
