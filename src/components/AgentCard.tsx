'use client'

import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  status: 'trial' | 'active' | 'expired'
  trial_started_at: string | null
  trial_expires_at: string | null
  subscription_started_at: string | null
  subscription_expires_at: string | null
}

interface Agent {
  id: string
  name: string
  bio: string
  type: 'SALES' | 'PROCUREMENT'
  avatar_url: string
  created_at: string
  subscriptions?: Subscription[]
}

interface AgentCardProps {
  agent: Agent
  orgId: string
}

export default function AgentCard({ agent, orgId }: AgentCardProps) {
  const router = useRouter()
  const subscription = agent.subscriptions?.[0]

  const typeConfig = {
    SALES: {
      icon: '💼',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200'
    },
    PROCUREMENT: {
      icon: '🛒',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    }
  }

  const config = typeConfig[agent.type]

  // Format date consistently for SSR/CSR
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric' 
    })
  }

  // Check if subscription is active
  const isAccessible = () => {
    if (!subscription) return false
    
    const now = new Date()
    
    if (subscription.status === 'trial' && subscription.trial_expires_at) {
      return new Date(subscription.trial_expires_at) > now
    }
    
    if (subscription.status === 'active' && subscription.subscription_expires_at) {
      return new Date(subscription.subscription_expires_at) > now
    }
    
    return false
  }

  const getStatusInfo = () => {
    if (!subscription) {
      return {
        text: 'No Subscription',
        color: 'text-gray-500',
        bgColor: 'bg-gray-100'
      }
    }
    
    const now = new Date()
    
    if (subscription.status === 'trial' && subscription.trial_expires_at) {
      const expiresAt = new Date(subscription.trial_expires_at)
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysLeft > 0) {
        return {
          text: `Trial: ${daysLeft} days left`,
          color: 'text-blue-700',
          bgColor: 'bg-blue-100'
        }
      }
    }
    
    if (subscription.status === 'active' && subscription.subscription_expires_at) {
      const expiresAt = new Date(subscription.subscription_expires_at)
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysLeft > 0) {
        return {
          text: `Active: ${daysLeft} days left`,
          color: 'text-green-700',
          bgColor: 'bg-green-100'
        }
      }
    }
    
    return {
      text: 'Expired',
      color: 'text-red-700',
      bgColor: 'bg-red-100'
    }
  }

  const handleClick = () => {
    if (isAccessible()) {
      router.push(`/organizations/${orgId}/agents/${agent.id}`)
    } else {
      router.push(`/organizations/${orgId}/billing?agent=${agent.id}`)
    }
  }

  const statusInfo = getStatusInfo()
  const accessible = isAccessible()

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={agent.avatar_url}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-bold text-gray-900 truncate">{agent.name}</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor} flex items-center gap-1 flex-shrink-0 ml-2`}>
              <span>{config.icon}</span>
              {agent.type}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed mb-4">{agent.bio}</p>
          
          {/* Status Badge */}
          <div className="mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Created {formatDate(agent.created_at)}
            </p>
            <button
              onClick={handleClick}
              className={`font-medium text-sm flex items-center gap-1 transition-colors ${
                accessible 
                  ? 'text-blue-600 hover:text-blue-700' 
                  : 'bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700'
              }`}
            >
              {accessible ? (
                <>
                  Open Console
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              ) : (
                'Activate Subscription'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}