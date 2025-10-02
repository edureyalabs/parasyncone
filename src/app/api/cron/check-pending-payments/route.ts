import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function GET(request: Request) {
  console.log('=== CRON JOB STARTED ===')
  
  // Security: Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    console.error('Unauthorized cron access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const supabase = await createClient()
    
    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })

    // Get pending transactions older than 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
    
    const { data: pendingTxns, error: fetchError } = await supabase
      .from('payment_transactions')
      .select('*')
      .eq('status', 'pending')
      .lt('created_at', fiveMinutesAgo)
      .limit(50)

    if (fetchError) {
      console.error('Failed to fetch pending transactions:', fetchError)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log(`Found ${pendingTxns?.length || 0} pending transactions`)

    if (!pendingTxns || pendingTxns.length === 0) {
      return NextResponse.json({ 
        message: 'No pending transactions to check',
        checked: 0, 
        updated: 0 
      })
    }

    let successCount = 0
    let failedCount = 0
    const results = []

    // Check each transaction with Razorpay
    for (const txn of pendingTxns) {
      try {
        console.log(`Checking order: ${txn.razorpay_order_id}`)
        
        // Fetch order details from Razorpay
        const order = await razorpay.orders.fetch(txn.razorpay_order_id)
        
        console.log(`Order ${order.id} status: ${order.status}, attempts: ${order.attempts}`)

        if (order.status === 'paid') {
          // Payment was successful - fetch payment details
          const payments = await razorpay.orders.fetchPayments(order.id)
          
          if (payments.items && payments.items.length > 0) {
            const payment = payments.items[0]
            
            if (payment.status === 'captured') {
              console.log(`Payment captured: ${payment.id}`)
              
              // Update transaction to success
              const { error: txnUpdateError } = await supabase
                .from('payment_transactions')
                .update({
                  status: 'success',
                  razorpay_payment_id: payment.id
                })
                .eq('id', txn.id)

              if (txnUpdateError) {
                console.error('Failed to update transaction:', txnUpdateError)
                continue
              }

              // Activate subscription
              const now = new Date()
              const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

              const { error: subUpdateError } = await supabase
                .from('subscriptions')
                .update({
                  status: 'active',
                  subscription_started_at: now.toISOString(),
                  subscription_expires_at: expiresAt.toISOString()
                })
                .eq('id', txn.subscription_id)

              if (subUpdateError) {
                console.error('Failed to activate subscription:', subUpdateError)
              } else {
                console.log(`Subscription activated: ${txn.subscription_id}`)
              }

              successCount++
              results.push({ orderId: order.id, status: 'updated_to_success' })
            }
          }
        } else if (order.status === 'attempted') {
          // Check if order is old enough to mark as failed (older than 10 minutes)
          const tenMinutesAgo = Date.now() - 10 * 60 * 1000
          const orderCreatedAt = order.created_at * 1000 // Razorpay returns timestamp in seconds
          
          if (orderCreatedAt < tenMinutesAgo) {
            console.log(`Marking old attempted order as failed: ${order.id}`)
            
            await supabase
              .from('payment_transactions')
              .update({
                status: 'failed',
                failure_reason: 'Payment not completed within time limit'
              })
              .eq('id', txn.id)

            failedCount++
            results.push({ orderId: order.id, status: 'updated_to_failed' })
          }
        } else if (order.status === 'created') {
          // Order created but no payment attempt - check age (older than 10 minutes)
          const tenMinutesAgo = Date.now() - 10 * 60 * 1000
          const orderCreatedAt = order.created_at * 1000
          
          if (orderCreatedAt < tenMinutesAgo) {
            console.log(`Marking abandoned order as failed: ${order.id}`)
            
            await supabase
              .from('payment_transactions')
              .update({
                status: 'failed',
                failure_reason: 'Payment not attempted'
              })
              .eq('id', txn.id)

            failedCount++
            results.push({ orderId: order.id, status: 'updated_to_failed' })
          }
        }
      } catch (orderError) {
        console.error(`Failed to check order ${txn.razorpay_order_id}:`, orderError)
        results.push({ 
          orderId: txn.razorpay_order_id, 
          status: 'error',
          error: orderError instanceof Error ? orderError.message : 'Unknown error'
        })
      }
    }

    console.log('=== CRON JOB COMPLETED ===')
    console.log(`Success: ${successCount}, Failed: ${failedCount}`)

    return NextResponse.json({ 
      message: 'Cron job completed',
      checked: pendingTxns.length, 
      updated_to_success: successCount,
      updated_to_failed: failedCount,
      results
    })

  } catch (error) {
    console.error('=== CRON JOB ERROR ===')
    console.error(error)
    return NextResponse.json({ 
      error: 'Cron job failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}