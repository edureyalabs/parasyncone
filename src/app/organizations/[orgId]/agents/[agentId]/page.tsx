import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type AgentType = 'SALES' | 'PROCUREMENT'

export default async function AgentConsolePage({ 
  params 
}: { 
  params: Promise<{ orgId: string; agentId: string }>
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Await params
  const { orgId, agentId } = await params

  // Verify agent access
  const { data: agent } = await supabase
    .from('agents')
    .select(`
      *,
      organizations!inner(user_id),
      subscriptions(*)
    `)
    .eq('id', agentId)
    .eq('org_id', orgId)
    .single()

  if (!agent || agent.organizations.user_id !== user.id) {
    redirect(`/organizations/${orgId}/workforce`)
  }

  // Check subscription status
  const subscription = agent.subscriptions?.[0]
  
  if (!subscription) {
    redirect(`/organizations/${orgId}/billing?agent=${agentId}`)
  }

  const now = new Date()
  let isAccessible = false

  if (subscription.status === 'trial' && subscription.trial_expires_at) {
    isAccessible = new Date(subscription.trial_expires_at) > now
  } else if (subscription.status === 'active' && subscription.subscription_expires_at) {
    isAccessible = new Date(subscription.subscription_expires_at) > now
  }

  if (!isAccessible) {
    redirect(`/organizations/${orgId}/billing?agent=${agentId}`)
  }

  const typeConfig: Record<AgentType, { icon: string; color: string }> = {
    SALES: { icon: '💼', color: 'text-green-700' },
    PROCUREMENT: { icon: '🛒', color: 'text-blue-700' }
  }

  const agentType = agent.type as AgentType
  const config = typeConfig[agentType]

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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
                <img src={agent.avatar_url} alt={agent.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  {agent.name}
                  <span className={config.color}>{config.icon}</span>
                </h1>
                <p className="text-sm text-gray-500">{agent.type} Agent Console</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Console Access Granted
          </h2>
          <p className="text-gray-600 mb-2">Your {agent.type.toLowerCase()} agent is ready to use</p>
          <p className="text-green-600 font-medium">✓ Subscription Active</p>
          
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <p className="text-blue-900 font-medium">
              Agent console interface will be built next...
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}