import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PaymentFailurePage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ reason?: string; paymentId?: string; agentId?: string }>
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { orgId } = await params
  const { reason, paymentId, agentId } = await searchParams

  // Verify organization
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .eq('user_id', user.id)
    .single()

  if (!organization) {
    redirect('/organizations')
  }

  // Decode the reason
  const decodedReason = reason ? decodeURIComponent(reason) : 'Payment was not completed'

  // Fetch agent details if provided
  let agent = null
  if (agentId) {
    const { data: agentData } = await supabase
      .from('agents')
      .select('*')
      .eq('id', agentId)
      .eq('org_id', orgId)
      .single()
    
    agent = agentData
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href={`/organizations/${orgId}/billing`}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Payment Failed</h1>
              <p className="text-sm text-gray-500">{organization.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {/* Error Icon */}
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            We couldn't process your payment
          </p>

          {/* Error Details */}
          <div className="bg-red-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-red-900 mb-3">Error Details</h3>
            <p className="text-red-700 text-sm mb-4">
              {decodedReason}
            </p>
            {paymentId && (
              <div className="text-xs text-red-600">
                <span className="font-medium">Payment Reference:</span>
                <span className="font-mono ml-2">{paymentId}</span>
              </div>
            )}
          </div>

          {/* Common Reasons */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-3">Common Reasons for Payment Failure</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Card limit exceeded or daily transaction limit reached</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Incorrect card details or CVV</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Bank declined the transaction</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>Network connectivity issues</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/organizations/${orgId}/billing${agent ? `?agent=${agent.id}` : ''}`}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Try Again
            </Link>
            <Link
              href={`/organizations/${orgId}/workforce`}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Back to Workforce
            </Link>
          </div>

          {/* Support Note */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">
              Need help? Contact our support team
            </p>
            <a 
              href="mailto:support@parasync.com" 
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              support@parasync.com
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}