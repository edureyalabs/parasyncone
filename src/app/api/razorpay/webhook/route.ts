import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get raw body for signature verification
    const body = await request.text()
    const signature = request.headers.get('x-razorpay-signature')

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
    }

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expectedSignature !== signature) {
      console.error('Webhook signature verification failed')
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Parse the event
    const event = JSON.parse(body)
    const eventType = event.event

    console.log('Webhook received:', eventType)

    // Handle payment.captured event
    if (eventType === 'payment.captured') {
      const payment = event.payload.payment.entity
      const orderId = payment.order_id
      const paymentId = payment.id
      const amount = payment.amount / 100 // Convert from paisa to rupees

      console.log('Payment captured:', { orderId, paymentId, amount })

      // Find the transaction
      const { data: transaction, error: txnError } = await supabase
        .from('payment_transactions')
        .select('*, subscriptions(*)')
        .eq('razorpay_order_id', orderId)
        .single()

      if (txnError || !transaction) {
        console.error('Transaction not found:', orderId)
        return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
      }

      // Update transaction status
      const { error: updateTxnError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'success',
          razorpay_payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', orderId)

      if (updateTxnError) {
        console.error('Failed to update transaction:', updateTxnError)
        return NextResponse.json({ error: 'Failed to update transaction' }, { status: 500 })
      }

      // Activate subscription
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

      const { error: subError } = await supabase
        .from('subscriptions')
        .update({
          status: 'active',
          subscription_started_at: now.toISOString(),
          subscription_expires_at: expiresAt.toISOString(),
          updated_at: now.toISOString()
        })
        .eq('id', transaction.subscription_id)

      if (subError) {
        console.error('Failed to activate subscription:', subError)
        return NextResponse.json({ error: 'Failed to activate subscription' }, { status: 500 })
      }

      console.log('Subscription activated successfully:', transaction.subscription_id)
      return NextResponse.json({ received: true })
    }

    // Handle payment.failed event
    if (eventType === 'payment.failed') {
      const payment = event.payload.payment.entity
      const orderId = payment.order_id
      const paymentId = payment.id
      const errorDescription = payment.error_description || 'Unknown error'

      console.log('Payment failed:', { orderId, paymentId, errorDescription })

      // Update transaction status
      const { error: updateTxnError } = await supabase
        .from('payment_transactions')
        .update({
          status: 'failed',
          failure_reason: errorDescription,
          razorpay_payment_id: paymentId,
          updated_at: new Date().toISOString()
        })
        .eq('razorpay_order_id', orderId)

      if (updateTxnError) {
        console.error('Failed to update transaction:', updateTxnError)
      }

      return NextResponse.json({ received: true })
    }

    // Log other events
    console.log('Unhandled webhook event:', eventType)
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}