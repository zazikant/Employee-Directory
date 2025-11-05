'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AddEmployeePage() {
  const router = useRouter()
  const [employee, setEmployee] = useState({
    full_name: '',
    profile_photo_url: '',
    job_title: '',
    department: '',
    employment_status: 'current',
    employee_id: '',
    start_date: '',
    end_date: '',
    office_location: '',
    reporting_manager: '',
    email: '',
    phone: '',
    linkedin_url: '',
    website_url: '',
    bio: '',
    skills: [],
    projects: [],
    achievements: '',
  })
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEmployee({ ...employee, [name]: value })
  }

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEmployee({ ...employee, [name]: value.split(',') })
  }

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${fileName}`

      let { error: uploadError } = await supabase.storage.from('profile-photos').upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage.from('profile-photos').getPublicUrl(filePath)
      setEmployee({ ...employee, profile_photo_url: publicUrl })
    } catch (error: any) {
      alert(error.message)
    } finally {
      setUploading(false)
    }
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
        <div>
          <label htmlFor="photo">Profile Photo</label>
          <input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="p-2 border rounded" />
        </div>
        <input name="full_name" placeholder="Full Name" onChange={handleChange} required className="p-2 border rounded" />
        <input name="job_title" placeholder="Job Title" onChange={handleChange} required className="p-2 border rounded" />
        <input name="department" placeholder="Department" onChange={handleChange} required className="p-2 border rounded" />
        <select name="employment_status" onChange={handleChange} value={employee.employment_status} className="p-2 border rounded">
          <option value="current">Current</option>
          <option value="former">Former</option>
        </select>
        <input name="employee_id" placeholder="Employee ID" onChange={handleChange} required className="p-2 border rounded" />
        <input name="start_date" type="date" placeholder="Start Date" onChange={handleChange} required className="p-2 border rounded" />
        <input name="end_date" type="date" placeholder="End Date" onChange={handleChange} className="p-2 border rounded" />
        <input name="office_location" placeholder="Office Location" onChange={handleChange} className="p-2 border rounded" />
        <input name="reporting_manager" placeholder="Reporting Manager" onChange={handleChange} className="p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} className="p-2 border rounded" />
        <input name="phone" placeholder="Phone" onChange={handleChange} className="p-2 border rounded" />
        <input name="linkedin_url" placeholder="LinkedIn URL" onChange={handleChange} className="p-2 border rounded" />
        <input name="website_url" placeholder="Website URL" onChange={handleChange} className="p-2 border rounded" />
        <textarea name="bio" placeholder="Bio" onChange={handleChange} className="p-2 border rounded col-span-2" />
        <input name="skills" placeholder="Skills (comma-separated)" onChange={handleArrayChange} className="p-2 border rounded" />
        <input name="projects" placeholder="Projects (comma-separated)" onChange={handleArrayChange} className="p-2 border rounded" />
        <input name="achievements" placeholder="Achievements" onChange={handleChange} className="p-2 border rounded" />
        <button type="submit" className="p-2 text-white bg-blue-600 rounded col-span-2" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Employee'}
        </button>
      </form>
    </div>
  )
}
