'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter, useParams } from 'next/navigation'

export default function EditEmployeePage() {
  const router = useRouter()
  const { id } = useParams()
  const [employee, setEmployee] = useState<any>(null)
  const [uploading, setUploading] = useState(false)

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
        <div>
          <label htmlFor="photo">Profile Photo</label>
          <input id="photo" type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} className="p-2 border rounded" />
        </div>
        <input name="full_name" placeholder="Full Name" value={employee.full_name} onChange={handleChange} required className="p-2 border rounded" />
        <input name="job_title" placeholder="Job Title" value={employee.job_title} onChange={handleChange} required className="p-2 border rounded" />
        <input name="department" placeholder="Department" value={employee.department} onChange={handleChange} required className="p-2 border rounded" />
        <select name="employment_status" onChange={handleChange} value={employee.employment_status} className="p-2 border rounded">
          <option value="current">Current</option>
          <option value="former">Former</option>
        </select>
        <input name="employee_id" placeholder="Employee ID" value={employee.employee_id} onChange={handleChange} required className="p-2 border rounded" />
        <input name="start_date" type="date" placeholder="Start Date" value={employee.start_date} onChange={handleChange} required className="p-2 border rounded" />
        <input name="end_date" type="date" placeholder="End Date" value={employee.end_date} onChange={handleChange} className="p-2 border rounded" />
        <input name="office_location" placeholder="Office Location" value={employee.office_location} onChange={handleChange} className="p-2 border rounded" />
        <input name="reporting_manager" placeholder="Reporting Manager" value={employee.reporting_manager} onChange={handleChange} className="p-2 border rounded" />
        <input name="email" type="email" placeholder="Email" value={employee.email} onChange={handleChange} className="p-2 border rounded" />
        <input name="phone" placeholder="Phone" value={employee.phone} onChange={handleChange} className="p-2 border rounded" />
        <input name="linkedin_url" placeholder="LinkedIn URL" value={employee.linkedin_url} onChange={handleChange} className="p-2 border rounded" />
        <input name="website_url" placeholder="Website URL" value={employee.website_url} onChange={handleChange} className="p-2 border rounded" />
        <textarea name="bio" placeholder="Bio" value={employee.bio} onChange={handleChange} className="p-2 border rounded col-span-2" />
        <input name="skills" placeholder="Skills (comma-separated)" value={employee.skills?.join(',')} onChange={handleArrayChange} className="p-2 border rounded" />
        <input name="projects" placeholder="Projects (comma-separated)" value={employee.projects?.join(',')} onChange={handleArrayChange} className="p-2 border rounded" />
        <input name="achievements" placeholder="Achievements" value={employee.achievements} onChange={handleChange} className="p-2 border rounded" />
        <button type="submit" className="p-2 text-white bg-blue-600 rounded col-span-2" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Update Employee'}
        </button>
      </form>
    </div>
  )
}
