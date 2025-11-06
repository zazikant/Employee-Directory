'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'

export default function AddEmployeePage() {
  const router = useRouter()
  const [employee, setEmployee] = useState({
    name: '',
    hobbies: '',
    tenure_in_gem: 0,
    department: '',
    personal_traits: '',
    photo_url: '',
  })
  const [uploading, setUploading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setEmployee({ ...employee, [name]: value })
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
      setEmployee({ ...employee, photo_url: publicUrl })
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
        <input name="name" placeholder="Name" onChange={handleChange} required className="p-2 border rounded" />
        <input name="hobbies" placeholder="Hobbies" onChange={handleChange} required className="p-2 border rounded" />
        <input name="tenure_in_gem" type="number" placeholder="Tenure in GEM" onChange={handleChange} required className="p-2 border rounded" />
        <input name="department" placeholder="Department" onChange={handleChange} required className="p-2 border rounded" />
        <textarea name="personal_traits" placeholder="Personal Traits" onChange={handleChange} className="p-2 border rounded col-span-2" />
        <button type="submit" className="p-2 text-white bg-blue-600 rounded col-span-2" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add Employee'}
        </button>
      </form>
    </div>
  )
}
