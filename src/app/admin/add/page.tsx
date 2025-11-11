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
  const [isUploading, setIsUploading] = useState(false)

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
      setIsUploading(true)
      const Papa = await import('papaparse')
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          const csvEmployees = results.data as Partial<Employee>[]
          let updated = 0
          let inserted = 0
          let failed = 0
          const errors: string[] = []

          for (const csvEmployee of csvEmployees) {
            try {
              if (!csvEmployee.name) {
                failed++
                errors.push('Skipped record with missing name')
                continue
              }

              // Check if employee with this name exists
              const { data: existingEmployees, error: fetchError } = await supabase
                .from('employees')
                .select('*')
                .eq('name', csvEmployee.name)
                .limit(1)

              if (fetchError) {
                failed++
                errors.push(`Error fetching ${csvEmployee.name}: ${fetchError.message}`)
                continue
              }

              if (existingEmployees && existingEmployees.length > 0) {
                // Employee exists - update with CSV data (CSV values override existing)
                const existingEmployee = existingEmployees[0]
                const mergedData = {
                  ...existingEmployee,
                  ...csvEmployee,
                }
                
                const { error: updateError } = await supabase
                  .from('employees')
                  .update(mergedData)
                  .eq('id', existingEmployee.id)

                if (updateError) {
                  failed++
                  errors.push(`Error updating ${csvEmployee.name}: ${updateError.message}`)
                } else {
                  updated++
                }
              } else {
                // Employee doesn't exist - insert new record
                const { error: insertError } = await supabase
                  .from('employees')
                  .insert([csvEmployee])

                if (insertError) {
                  failed++
                  errors.push(`Error inserting ${csvEmployee.name}: ${insertError.message}`)
                } else {
                  inserted++
                }
              }
            } catch (err) {
              failed++
              errors.push(`Unexpected error: ${err}`)
            }
          }

          setIsUploading(false)
          
          // Show detailed results
          let message = `CSV Upload Complete!\n\n`
          message += `✅ Updated: ${updated}\n`
          message += `➕ Inserted: ${inserted}\n`
          if (failed > 0) {
            message += `❌ Failed: ${failed}\n\n`
            message += `Errors:\n${errors.slice(0, 5).join('\n')}`
            if (errors.length > 5) {
              message += `\n... and ${errors.length - 5} more errors`
            }
          }
          
          alert(message)
          
          if (updated > 0 || inserted > 0) {
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
            <p className="mb-4 text-sm text-gray-600">
              <strong>Note:</strong> If an employee name already exists, their record will be updated with new CSV values. Otherwise, a new employee will be added.
            </p>
            <input 
              type="file" 
              accept=".csv" 
              onChange={handleCsvUpload} 
              disabled={isUploading}
              className="p-2 border rounded w-full" 
            />
            {isUploading && (
              <p className="mt-4 text-blue-600 font-semibold">Uploading... Please wait.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
