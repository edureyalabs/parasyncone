'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Subscription {
  id: string
  status: 'trial' | 'active' | 'expired'
  trial_started_at: string | null
  trial_expires_at: string | null
  subscription_started_at: string | null
  subscription_expires_at: string | null
  amount: number
}

interface Agent {
  id: string
  name: string
  type: 'SALES' | 'PROCUREMENT'
  avatar_url: string
  subscriptions: Subscription[]
}

interface SubscriptionCardProps {
  agent: Agent
  orgId: string
  highlightAgent?: string
}

export default function SubscriptionCard({ agent, orgId, highlightAgent }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const subscription = agent.subscriptions?.[0]

  const typeConfig = {
    SALES: { icon: '💼', color: 'text-green-700', bg: 'bg-green-50' },
    PROCUREMENT: { icon: '🛒', color: 'text-blue-700', bg: 'bg-blue-50' }
  }

  const config = typeConfig[agent.type]
  const isHighlighted = highlightAgent === agent.id

  const getStatus = () => {
    if (!subscription) return { text: 'Not Activated', color: 'text-gray-500', canActivate: true, isExpired: false }
    
    const now = new Date()
    
    if (subscription.status === 'trial' && subscription.trial_expires_at) {
      const expiresAt = new Date(subscription.trial_expires_at)
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysLeft > 0) {
        return { text: `Free Trial - ${daysLeft} days left`, color: 'text-blue-600', canActivate: false, isExpired: false }
      }
    }
    
    if (subscription.status === 'active' && subscription.subscription_expires_at) {
      const expiresAt = new Date(subscription.subscription_expires_at)
      const daysLeft = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysLeft > 0) {
        return { text: `Active - ${daysLeft} days left`, color: 'text-green-600', canActivate: false, isExpired: false }
      }
    }
    
    return { text: 'Expired', color: 'text-red-600', canActivate: false, isExpired: true }
  }

  const handleActivateTrial = async () => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/subscription/activate-trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id })
      })

      const result = await response.json()

      if (result.success) {
        alert('Free trial activated successfully! Valid for 30 days.')
        
        // Force a full page reload to refresh data
        window.location.href = `/organizations/${orgId}/billing`
      } else {
        alert(result.error || 'Failed to activate trial')
        setLoading(false)
      }
    } catch (error) {
      console.error('Trial activation error:', error)
      alert('Failed to activate trial. Please try again.')
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!subscription) {
      alert('Please activate free trial first')
      return
    }

    setLoading(true)
    
    try {
      // Create Razorpay order
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: agent.id,
          subscriptionId: subscription.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order')
      }

      const { orderId, amount, currency } = data

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        name: 'Parasync One',
        description: `${agent.type} Agent - 30 Days Subscription`,
        order_id: orderId,
        handler: async function (response: any) {
          setLoading(true)
          
          // Verify payment
          const verifyResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              agentId: agent.id,
              subscriptionId: subscription.id
            })
          })

          const result = await verifyResponse.json()

          if (result.success) {
            alert('Payment successful! Your subscription is now active for 30 days.')
            window.location.href = `/organizations/${orgId}/billing`
          } else {
            alert('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id)
            setLoading(false)
          }
        },
        prefill: {
          name: agent.name,
        },
        theme: {
          color: '#3B82F6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false)
          }
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.on('payment.failed', function (response: any) {
        setLoading(false)
        alert('Payment failed: ' + response.error.description)
      })
      
      razorpay.open()
    } catch (error) {
      console.error('Payment error:', error)
      alert('Failed to initiate payment. Please try again.')
      setLoading(false)
    }
  }

  const status = getStatus()

  return (
    <div className={`bg-white rounded-lg border-2 p-6 ${isHighlighted ? 'border-blue-500 shadow-lg' : 'border-gray-200'}`}>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
          <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-gray-900">{agent.name}</h3>
            <span className={`text-xl ${config.color}`}>{config.icon}</span>
          </div>
          <p className={`text-sm font-medium ${status.color}`}>{status.text}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-baseline justify-between">
          <span className="text-gray-600">Subscription Price</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-gray-900">₹800</span>
            <span className="text-gray-500 text-sm">/30 days</span>
          </div>
        </div>

        {status.canActivate && (
          <button
            onClick={handleActivateTrial}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Activating...' : 'Activate Free Trial (30 Days)'}
          </button>
        )}

        {subscription && status.isExpired && (
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Processing...' : 'Subscribe Now - ₹800'}
          </button>
        )}
      </div>
    </div>
  )
}