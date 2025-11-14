'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabase'
import { useRouter } from 'next/navigation'
import { Employee } from '@/types'

export default function AddEmployeePage() {
  const router = useRouter()
  const [employee, setEmployee] = useState({
    name: '',
    hobbies: '',
    tenure_years: '',
    tenure_months: '',
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
    
    // Prepare employee data with defaults for empty fields
    const tenureYears = employee.tenure_years ? Number(employee.tenure_years) : 0
    const tenureMonths = employee.tenure_months ? Number(employee.tenure_months) : 0
    const employeeData = {
      name: employee.name.trim(),
      photo_url: employee.photo_url.trim(),
      hobbies: employee.hobbies.trim() || '',
      tenure_years: tenureYears,
      tenure_months: tenureMonths > 12 ? 12 : tenureMonths,
      department: employee.department.trim() || '',
      personal_traits: employee.personal_traits.trim() || '',
    }
    
    const { error } = await supabase.from('employees').insert([employeeData])
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
              if (!csvEmployee.name || !csvEmployee.name.trim()) {
                failed++
                errors.push('Skipped record with missing name')
                continue
              }

              // Normalize name for case-insensitive matching
              const normalizedCsvName = csvEmployee.name.trim().toLowerCase()

              // Fetch all employees and do case-insensitive match client-side
              const { data: allEmployees, error: fetchError } = await supabase
                .from('employees')
                .select('*')

              if (fetchError) {
                failed++
                errors.push(`Error fetching employees: ${fetchError.message}`)
                continue
              }

              // Find matching employee (case-insensitive)
              const existingEmployee = allEmployees?.find(
                emp => emp.name.trim().toLowerCase() === normalizedCsvName
              )

              if (existingEmployee) {
                // Employee exists - merge only non-empty CSV fields
                const mergedData = { ...existingEmployee }
                
                // Only update fields that have non-empty values in CSV
                for (const key in csvEmployee) {
                  const value = csvEmployee[key as keyof typeof csvEmployee]
                  if (value !== undefined && value !== null && value !== '') {
                    // Cap tenure_months at 12
                    if (key === 'tenure_months' && Number(value) > 12) {
                      (mergedData as Record<string, unknown>)[key] = 12
                    } else {
                      (mergedData as Record<string, unknown>)[key] = value
                    }
                  }
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
                // Require photo_url for new records
                if (!csvEmployee.photo_url || !csvEmployee.photo_url.trim()) {
                  failed++
                  errors.push(`Skipped ${csvEmployee.name}: photo_url is required for new employees`)
                  continue
                }

                // Prepare record with defaults for missing fields
                const tenureMonths = csvEmployee.tenure_months || 0
                const newEmployee = {
                  name: csvEmployee.name,
                  photo_url: csvEmployee.photo_url,
                  hobbies: csvEmployee.hobbies || '',
                  tenure_years: csvEmployee.tenure_years || 0,
                  tenure_months: Number(tenureMonths) > 12 ? 12 : Number(tenureMonths),
                  department: csvEmployee.department || '',
                  personal_traits: csvEmployee.personal_traits || '',
                }

                const { error: insertError } = await supabase
                  .from('employees')
                  .insert([newEmployee])

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
            <input name="name" placeholder="Name *" onChange={handleChange} required className="p-2 border rounded" />
            <input name="photo_url" placeholder="Photo URL *" onChange={handleChange} required className="p-2 border rounded" />
            <input name="hobbies" placeholder="Hobbies (optional)" onChange={handleChange} className="p-2 border rounded" />
            <input name="tenure_years" type="number" placeholder="Tenure (Years) - optional" onChange={handleChange} min="0" className="p-2 border rounded" />
            <input name="tenure_months" type="number" placeholder="Tenure (Months) - optional" onChange={handleChange} min="0" max="12" className="p-2 border rounded" />
            <input name="department" placeholder="Department (optional)" onChange={handleChange} className="p-2 border rounded" />
            <textarea name="personal_traits" placeholder="Personal Traits (optional)" onChange={handleChange} className="p-2 border rounded" />
            <p className="text-sm text-gray-600">* Required fields</p>
            <button type="submit" className="p-2 text-black bg-primary rounded">
              Add Employee
            </button>
          </form>
        </div>
        <div>
          <h1 className="text-4xl font-bold mb-8">Bulk Upload</h1>
          <div className="border rounded p-4">
            <p className="mb-4"><strong>CSV Headers:</strong> name, hobbies, tenure_years, tenure_months, department, personal_traits, photo_url</p>
            <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
              <strong>How it works:</strong>
              <ul className="list-disc ml-5 mt-2 space-y-1">
                <li><strong>Name matching is case-insensitive</strong> (e.g., &quot;vIn diEsel&quot; = &quot;Vin Diesel&quot;)</li>
                <li><strong>Updating:</strong> If name exists, only non-empty CSV fields will update. Existing data is preserved for empty CSV fields.</li>
                <li><strong>Inserting:</strong> New employees require a photo_url. Other fields can be blank.</li>
                <li><strong>Partial updates allowed:</strong> You can update just 1 or 2 fields for existing employees.</li>
              </ul>
            </div>
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
