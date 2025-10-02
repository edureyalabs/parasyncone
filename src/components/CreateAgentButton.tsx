'use client'

import { useState } from 'react'
import CreateAgentModal from './CreateAgentModal'

interface CreateAgentButtonProps {
  orgId: string
  hasSales: boolean
  hasProcurement: boolean
}

export default function CreateAgentButton({ orgId, hasSales, hasProcurement }: CreateAgentButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Create Agent
      </button>

      {isModalOpen && (
        <CreateAgentModal
          orgId={orgId}
          hasSales={hasSales}
          hasProcurement={hasProcurement}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}