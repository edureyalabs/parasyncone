import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { agentId, subscriptionId } = body

    // Verify agent belongs to user
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('*, organizations!inner(user_id)')
      .eq('id', agentId)
      .single()

    if (agentError || agent.organizations.user_id !== user.id) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    // Create Razorpay order
    const amount = 80000 // ₹800 in paisa
    const currency = 'INR'

    const razorpayOrder = await razorpay.orders.create({
      amount,
      currency,
      receipt: `order_${agentId}_${Date.now()}`,
      notes: {
        agent_id: agentId,
        subscription_id: subscriptionId,
        user_id: user.id
      }
    })

    // Store transaction in database
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .insert({
        agent_id: agentId,
        subscription_id: subscriptionId,
        razorpay_order_id: razorpayOrder.id,
        amount: 800,
        currency: 'INR',
        status: 'pending'
      })

    if (transactionError) {
      console.error('Transaction insert error:', transactionError)
      return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 })
    }

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
