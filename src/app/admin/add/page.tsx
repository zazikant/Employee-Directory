'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { Employee } from '@/types'

export default function AddEmployeePage() {
  const router = useRouter()
  const [employee, setEmployee] = useState<Omit<Employee, 'id'> | Employee>({
    name: '',
    hobbies: '',
    tenure_in_gem: 0,
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Add Employee</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <input name="photo_url" placeholder="Photo URL" onChange={handleChange} className="p-2 border rounded col-span-2" />
        <input name="name" placeholder="Name" onChange={handleChange} required className="p-2 border rounded" />
        <input name="hobbies" placeholder="Hobbies" onChange={handleChange} required className="p-2 border rounded" />
        <input name="tenure_in_gem" type="number" placeholder="Tenure in GEM" onChange={handleChange} required className="p-2 border rounded" />
        <input name="department" placeholder="Department" onChange={handleChange} required className="p-2 border rounded" />
        <textarea name="personal_traits" placeholder="Personal Traits" onChange={handleChange} className="p-2 border rounded col-span-2" />
        <button type="submit" className="p-2 text-black bg-primary rounded col-span-2">
          Add Employee
        </button>
      </form>
    </div>
  )
}
