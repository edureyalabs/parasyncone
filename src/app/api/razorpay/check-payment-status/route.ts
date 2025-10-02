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
    const { orderId } = body

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 })
    }

    // Fetch transaction from database
    const { data: transaction, error: txnError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('razorpay_order_id', orderId)
      .single()

    if (txnError || !transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    // Return current status
    return NextResponse.json({
      status: transaction.status,
      paymentId: transaction.razorpay_payment_id,
      agentId: transaction.agent_id
    })

  } catch (error) {
    console.error('Check status error:', error)
    return NextResponse.json({ error: 'Failed to check status' }, { status: 500 })
  }
}