import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PaymentSuccessPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ paymentId?: string; agentId?: string }>
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { orgId } = await params
  const { paymentId, agentId } = await searchParams

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

  // Fetch transaction details if payment ID provided
  let transaction = null
  if (paymentId) {
    const { data: txnData } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('razorpay_payment_id', paymentId)
      .single()
    
    transaction = txnData
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
              <h1 className="text-2xl font-bold text-gray-900">Payment Successful</h1>
              <p className="text-sm text-gray-500">{organization.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h2>
          
          <p className="text-gray-600 mb-8 text-lg">
            Your subscription has been activated successfully
          </p>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
            <div className="space-y-3 text-sm">
              {paymentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-mono text-gray-900">{paymentId}</span>
                </div>
              )}
              {transaction && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-semibold text-gray-900">₹{transaction.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="text-gray-900">
                      {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Success
                </span>
              </div>
            </div>
          </div>

          {/* Agent Info */}
          {agent && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <p className="text-blue-900 font-medium mb-2">
                ✓ Subscription activated for {agent.name}
              </p>
              <p className="text-blue-700 text-sm">
                Valid for 30 days from today
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {agent && (
              <Link
                href={`/organizations/${orgId}/agents/${agent.id}`}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Access Agent Console
              </Link>
            )}
            <Link
              href={`/organizations/${orgId}/billing`}
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View All Subscriptions
            </Link>
          </div>

          {/* Receipt Note */}
          <p className="text-sm text-gray-500 mt-8">
            A receipt has been sent to your email address
          </p>
        </div>
      </main>
    </div>
  )
}