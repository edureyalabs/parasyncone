'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CreateOrganizationFormProps {
  userId: string
}

export default function CreateOrganizationForm({ userId }: CreateOrganizationFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Check if user already has an organization
    const { data: existingOrg } = await supabase
      .from('organizations')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (existingOrg) {
      setError('You already have an organization')
      setLoading(false)
      return
    }

    // Create organization
    const { error: insertError } = await supabase
      .from('organizations')
      .insert({
        user_id: userId,
        name,
        description,
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 max-w-2xl">
      <h3 className="text-xl font-semibold mb-6">Create Your Organization</h3>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Organization Name *
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Acme Corporation"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of your organization..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Organization'}
        </button>
      </form>
    </div>
  )
}