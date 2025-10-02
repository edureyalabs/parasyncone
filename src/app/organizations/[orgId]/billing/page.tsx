import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import SubscriptionCard from '@/components/SubscriptionCard'
import PaymentHistory from '@/components/PaymentHistory'

export default async function BillingPage({ 
  params,
  searchParams 
}: { 
  params: Promise<{ orgId: string }>
  searchParams: Promise<{ agent?: string }>
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { orgId } = await params
  const { agent: highlightAgent } = await searchParams

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

  // Fetch agents first
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: true })

  // Fetch subscriptions for each agent
  let agentsWithSubscriptions = []
  if (agents && agents.length > 0) {
    agentsWithSubscriptions = await Promise.all(
      agents.map(async (agent) => {
        const { data: subscriptions } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('agent_id', agent.id)
          .order('created_at', { ascending: false })
        
        return {
          ...agent,
          subscriptions: subscriptions || []
        }
      })
    )
  }

  // Fetch payment transactions
  const agentIds = agents?.map(a => a.id) || []
  let transactions = []
  
  if (agentIds.length > 0) {
    const { data: txnData } = await supabase
      .from('payment_transactions')
      .select(`
        *,
        agents (name, type)
      `)
      .in('agent_id', agentIds)
      .order('created_at', { ascending: false })
      .limit(10)
    
    transactions = txnData || []
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Link 
              href={`/organizations/${orgId}/workforce`}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Billing & Subscriptions</h1>
              <p className="text-sm text-gray-500">{organization.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Subscriptions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agent Subscriptions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {agentsWithSubscriptions?.map((agent) => (
              <SubscriptionCard 
                key={agent.id}
                agent={agent}
                orgId={orgId}
                highlightAgent={highlightAgent}
              />
            ))}
          </div>
        </div>

        {/* Payment History */}
        {transactions && transactions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment History</h2>
            <PaymentHistory transactions={transactions} />
          </div>
        )}
      </main>
    </div>
  )
}