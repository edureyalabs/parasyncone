import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agentId } = body

    // Verify agent belongs to user
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*, organizations!inner(user_id)')
      .eq('id', agentId)
      .single()

    if (agentError || agent.organizations.user_id !== user.id) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Check if subscription already exists
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('agent_id', agentId)
      .single()

    if (existingSub) {
      return NextResponse.json({ error: 'Trial already activated for this agent' }, { status: 400 })
    }

    // Create trial subscription
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const { data: newSubscription, error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        agent_id: agentId,
        status: 'trial',
        trial_started_at: now.toISOString(),
        trial_expires_at: expiresAt.toISOString(),
        amount: 800
      })
      .select()
      .single()

    if (insertError) {
      console.error('Subscription insert error:', insertError)
      return NextResponse.json({ error: 'Failed to create subscription' }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      subscriptionId: newSubscription.id
    })

  } catch (error) {
    console.error('Activate trial error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}