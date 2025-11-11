'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { Employee } from '@/types'

export default function AddEmployeePage() {
  const router = useRouter()
  const [employee, setEmployee] = useState<Omit<Employee, 'id'>>({
    name: '',
    hobbies: '',
    tenure_years: 0,
    tenure_months: 0,
    department: '',
    personal_traits: '',
    photo_url: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEmployee({ ...employee, [name]: value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const { error } = await supabase.from('employees').insert([employee])
    if (error) {
      alert(error.message)
    } else {
      alert('Employee added successfully!')
      router.push('/admin')
    }
  }

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const Papa = await import('papaparse')
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const employees = results.data as Employee[]
          const { error } = await supabase.from('employees').upsert(employees, { onConflict: 'name' })
          if (error) {
            alert(error.message)
          } else {
            alert(`Successfully processed ${employees.length} records.`)
            router.push('/admin')
          }
        },
      })
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-4xl font-bold mb-8">Add Employee</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input name="photo_url" placeholder="Photo URL" onChange={handleChange} className="p-2 border rounded" />
            <input name="name" placeholder="Name" onChange={handleChange} required className="p-2 border rounded" />
            <input name="hobbies" placeholder="Hobbies" onChange={handleChange} required className="p-2 border rounded" />
            <input name="tenure_years" type="number" placeholder="Tenure (Years)" onChange={handleChange} required className="p-2 border rounded" />
            <input name="tenure_months" type="number" placeholder="Tenure (Months)" onChange={handleChange} className="p-2 border rounded" />
            <input name="department" placeholder="Department" onChange={handleChange} required className="p-2 border rounded" />
            <textarea name="personal_traits" placeholder="Personal Traits" onChange={handleChange} className="p-2 border rounded" />
            <button type="submit" className="p-2 text-black bg-primary rounded">
              Add Employee
            </button>
          </form>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-8">Bulk Upload</h1>
          <div className="border rounded p-4">
            <p className="mb-4">Upload a CSV file with the following headers: name, hobbies, tenure_years, tenure_months, department, personal_traits, photo_url</p>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="p-2 border rounded w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
