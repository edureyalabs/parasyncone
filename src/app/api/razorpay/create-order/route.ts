import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: Request) {
  console.log('=== CREATE ORDER STARTED ===')
  
  try {
    // Step 1: Verify environment variables
    if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID) {
      console.error('Missing NEXT_PUBLIC_RAZORPAY_KEY_ID')
      return NextResponse.json({ error: 'Payment configuration error: Missing key ID' }, { status: 500 })
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      console.error('Missing RAZORPAY_KEY_SECRET')
      return NextResponse.json({ error: 'Payment configuration error: Missing secret' }, { status: 500 })
    }

    console.log('Environment variables present')

    // Step 2: Initialize Razorpay
    let razorpay
    try {
      razorpay = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      })
      console.log('Razorpay initialized')
    } catch (rzpError) {
      console.error('Razorpay init error:', rzpError)
      return NextResponse.json({ 
        error: 'Failed to initialize payment system',
        details: rzpError instanceof Error ? rzpError.message : 'Unknown'
      }, { status: 500 })
    }

    // Step 3: Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      console.error('Auth error:', userError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User authenticated:', user.id)

    // Step 4: Parse request body
    const body = await request.json()
    const { agentId, subscriptionId } = body

    if (!agentId || !subscriptionId) {
      return NextResponse.json({ error: 'Missing agentId or subscriptionId' }, { status: 400 })
    }

    console.log('Request params:', { agentId, subscriptionId })

    // Step 5: Verify agent ownership
    const { data: agent, error: agentError } = await supabase
      .from('agents')
      .select('id, org_id')
      .eq('id', agentId)
      .single()

    if (agentError || !agent) {
      console.error('Agent not found:', agentError)
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 })
    }

    console.log('Agent found:', agent.id)

    // Step 6: Verify organization ownership
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, user_id')
      .eq('id', agent.org_id)
      .single()

    if (orgError || !org || org.user_id !== user.id) {
      console.error('Organization verification failed:', orgError)
      return NextResponse.json({ error: 'Unauthorized access to agent' }, { status: 403 })
    }

    console.log('Organization verified')

    // Step 7: Verify subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('id, agent_id')
      .eq('id', subscriptionId)
      .eq('agent_id', agentId)
      .single()

    if (subError || !subscription) {
      console.error('Subscription not found:', subError)
      return NextResponse.json({ error: 'Subscription not found' }, { status: 404 })
    }

    console.log('Subscription verified')

    // Step 8: Create Razorpay order
    const amount = 80000 // ₹800 in paisa
    const currency = 'INR'

    console.log('Creating Razorpay order...')

    let razorpayOrder
    try {
      razorpayOrder = await razorpay.orders.create({
        amount,
        currency,
        receipt: `rcpt_${Date.now()}`,
        notes: {
          agent_id: agentId,
          subscription_id: subscriptionId,
          user_id: user.id
        }
      })
      console.log('Razorpay order created:', razorpayOrder.id)
    } catch (rzpOrderError) {
      console.error('Razorpay order creation failed:', rzpOrderError)
      return NextResponse.json({ 
        error: 'Failed to create payment order',
        details: rzpOrderError instanceof Error ? rzpOrderError.message : 'Unknown'
      }, { status: 500 })
    }

    // Step 9: Store transaction in database
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
      return NextResponse.json({ error: 'Failed to record transaction' }, { status: 500 })
    }

    console.log('Transaction recorded')
    console.log('=== CREATE ORDER SUCCESS ===')

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    })

  } catch (error) {
    console.error('=== CREATE ORDER FAILED ===')
    console.error('Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}