'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabase'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function EmployeePage() {
  const { id } = useParams()
  const [employee, setEmployee] = useState<any>(null)

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

  if (!employee) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="border rounded-lg p-8">
        <div className="flex items-center mb-8">
          <div className="w-48 h-48 bg-gray-200 rounded-full overflow-hidden">
            {employee.profile_photo_url ? (
              <Image
                src={employee.profile_photo_url}
                alt={employee.full_name}
                width={192}
                height={192}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300" />
            )}
          </div>
          <div className="ml-8">
            <h1 className="text-4xl font-bold mb-4">{employee.full_name}</h1>
            <p className="text-xl text-gray-600">{employee.job_title}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Details</h2>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>Status:</strong> {employee.employment_status}</p>
            <p><strong>Employee ID:</strong> {employee.employee_id}</p>
            <p><strong>Start Date:</strong> {employee.start_date}</p>
            {employee.end_date && <p><strong>End Date:</strong> {employee.end_date}</p>}
            <p><strong>Office Location:</strong> {employee.office_location}</p>
            <p><strong>Reporting Manager:</strong> {employee.reporting_manager}</p>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Contact</h2>
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Phone:</strong> {employee.phone}</p>
            <p><strong>LinkedIn:</strong> <a href={employee.linkedin_url} target="_blank" rel="noreferrer">{employee.linkedin_url}</a></p>
            <p><strong>Website:</strong> <a href={employee.website_url} target="_blank" rel="noreferrer">{employee.website_url}</a></p>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Bio</h2>
          <p>{employee.bio}</p>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {employee.skills?.map((skill: string) => (
              <span key={skill} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Projects</h2>
          <div className="flex flex-wrap gap-2">
            {employee.projects?.map((project: string) => (
              <span key={project} className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                {project}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
