'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter, useParams } from 'next/navigation'
import { Employee } from '@/types'

export default function EditEmployeePage() {
  const router = useRouter()
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEmployee({ ...employee, [name]: value } as Employee)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.from('employees').update(employee).eq('id', id)
    if (error) {
      alert(error.message)
    } else {
      alert('Employee updated successfully!')
      router.push('/admin')
    }
  }

  if (!employee) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Edit Employee</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <input name="photo_url" placeholder="Photo URL" value={employee.photo_url} onChange={handleChange} className="p-2 border rounded col-span-2" />
        <input name="name" placeholder="Name" value={employee.name} onChange={handleChange} required className="p-2 border rounded" />
        <input name="hobbies" placeholder="Hobbies" value={employee.hobbies} onChange={handleChange} required className="p-2 border rounded" />
        <input name="tenure_years" type="number" placeholder="Tenure (Years)" value={employee.tenure_years} onChange={handleChange} required min="0" className="p-2 border rounded" />
        <input name="tenure_months" type="number" placeholder="Tenure (Months)" value={employee.tenure_months} onChange={handleChange} min="0" max="12" className="p-2 border rounded" />
        <input name="department" placeholder="Department" value={employee.department} onChange={handleChange} required className="p-2 border rounded" />
        <textarea name="personal_traits" placeholder="Personal Traits" value={employee.personal_traits} onChange={handleChange} className="p-2 border rounded col-span-2" />
        <button type="submit" className="p-2 text-black bg-primary rounded col-span-2">
          Update Employee
        </button>
      </form>
    </div>
  )
}
