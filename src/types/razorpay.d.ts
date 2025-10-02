declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string
    key_secret: string
  }

  interface RazorpayOrderOptions {
    amount: number
    currency: string
    receipt: string
    notes?: Record<string, any>
  }

  interface RazorpayOrder {
    id: string
    entity: string
    amount: number
    amount_paid: number
    amount_due: number
    currency: string
    receipt: string
    status: string
    attempts: number
    notes: Record<string, any>
    created_at: number
  }

  interface RazorpayPayment {
    id: string
    entity: string
    amount: number
    currency: string
    status: string
    order_id: string
    method: string
    captured: boolean
    created_at: number
  }

  interface RazorpayPaymentList {
    entity: string
    count: number
    items: RazorpayPayment[]
  }

  class Razorpay {
    constructor(options: RazorpayOptions)
    orders: {
      create(options: RazorpayOrderOptions): Promise<RazorpayOrder>
      fetch(orderId: string): Promise<RazorpayOrder>
      fetchPayments(orderId: string): Promise<RazorpayPaymentList>
    }
  }

  export = Razorpay
}

interface Window {
  Razorpay: any
}