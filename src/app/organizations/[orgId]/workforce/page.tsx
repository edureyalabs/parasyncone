import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CreateAgentButton from '@/components/CreateAgentButton'
import AgentCard from '@/components/AgentCard'

export default async function WorkforcePage({ params }: { params: Promise<{ orgId: string }> }) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Await params
  const { orgId } = await params

  // Verify organization belongs to user
  const { data: organization } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', orgId)
    .eq('user_id', user.id)
    .single()

  if (!organization) {
    redirect('/organizations')
  }

  // Fetch agents only (no subscription join)
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('org_id', orgId)
    .order('created_at', { ascending: true })

  const salesAgent = agents?.find(agent => agent.type === 'SALES')
  const procurementAgent = agents?.find(agent => agent.type === 'PROCUREMENT')
  const allAgentsCreated = salesAgent && procurementAgent

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/organizations" 
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{organization.name}</h1>
                <p className="text-sm text-gray-500">Workforce Management</p>
              </div>
            </div>
            {agents && agents.length > 0 && (
              <Link 
                href={`/organizations/${orgId}/billing`}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Manage Billing →
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your AI Agents</h2>
            <p className="text-gray-600">
              {allAgentsCreated 
                ? 'Manage your AI workforce and subscriptions' 
                : 'Create your Sales and Procurement agents to get started'}
            </p>
          </div>
          
          {!allAgentsCreated && (
            <CreateAgentButton 
              orgId={orgId} 
              hasSales={!!salesAgent}
              hasProcurement={!!procurementAgent}
            />
          )}
        </div>

        {/* Agents Grid */}
        {agents && agents.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} orgId={orgId} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No agents yet</h3>
            <p className="text-gray-500 mb-6">Create your first AI agent to start automating your B2B operations</p>
          </div>
        )}
      </main>
    </div>
  )
}