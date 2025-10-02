import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      agentId,
      subscriptionId
    } = body

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex')

    if (generatedSignature !== razorpay_signature) {
      // Update transaction as failed
      await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          failure_reason: 'Signature verification failed'
        })
        .eq('razorpay_order_id', razorpay_order_id)

      return NextResponse.json({ 
        success: false, 
        error: 'Payment verification failed' 
      }, { status: 400 })
    }

    // Update transaction as success
    const { error: transactionError } = await supabase
      .from('payment_transactions')
      .update({
        status: 'success',
        razorpay_payment_id,
        razorpay_signature
      })
      .eq('razorpay_order_id', razorpay_order_id)

    if (transactionError) {
      console.error('Transaction update error:', transactionError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to update transaction' 
      }, { status: 500 })
    }

    // Update subscription
    const now = new Date()
    const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        subscription_started_at: now.toISOString(),
        subscription_expires_at: expiresAt.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('id', subscriptionId)

    if (subscriptionError) {
      console.error('Subscription update error:', subscriptionError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to activate subscription' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Payment verified and subscription activated'
    })

  } catch (error) {
    console.error('Verify payment error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Payment verification failed' 
    }, { status: 500 })
  }
}