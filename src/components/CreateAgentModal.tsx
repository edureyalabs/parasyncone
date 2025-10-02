'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface CreateAgentModalProps {
  orgId: string
  hasSales: boolean
  hasProcurement: boolean
  onClose: () => void
}

export default function CreateAgentModal({ orgId, hasSales, hasProcurement, onClose }: CreateAgentModalProps) {
  const [type, setType] = useState<'SALES' | 'PROCUREMENT' | ''>('')
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!type) {
      setError('Please select an agent type')
      return
    }

    setError('')
    setLoading(true)

    const { error: insertError } = await supabase
      .from('agents')
      .insert({
        org_id: orgId,
        type,
        name,
        bio,
        avatar_url: 'https://fbmhjirsrkipfmrynyvf.supabase.co/storage/v1/object/public/core/WhatsApp%20Image%202025-10-02%20at%2011.58.14%20AM.jpeg'
      })

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
    } else {
      router.refresh()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Create AI Agent</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Agent Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Agent Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={hasSales}
                onClick={() => setType('SALES')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  type === 'SALES'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${hasSales ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-2xl mb-2">💼</div>
                <div className="font-semibold text-gray-900">Sales</div>
                {hasSales && <div className="text-xs text-gray-500 mt-1">Already created</div>}
              </button>

              <button
                type="button"
                disabled={hasProcurement}
                onClick={() => setType('PROCUREMENT')}
                className={`p-4 border-2 rounded-lg transition-all ${
                  type === 'PROCUREMENT'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${hasProcurement ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="text-2xl mb-2">🛒</div>
                <div className="font-semibold text-gray-900">Procurement</div>
                {hasProcurement && <div className="text-xs text-gray-500 mt-1">Already created</div>}
              </button>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Sales Agent Alpha"
            />
          </div>

          {/* Bio Input */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
              Bio *
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              required
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of this agent's role..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !type}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Creating...' : 'Create Agent'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}