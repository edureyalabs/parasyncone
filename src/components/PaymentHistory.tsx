interface Transaction {
  id: string
  created_at: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  razorpay_payment_id: string | null
  agents: {
    name: string
    type: string
  }
}

interface PaymentHistoryProps {
  transactions: Transaction[]
}

export default function PaymentHistory({ transactions }: PaymentHistoryProps) {
  const getStatusBadge = (status: string) => {
    const config = {
      success: { bg: 'bg-green-100', text: 'text-green-700', label: 'Success' },
      failed: { bg: 'bg-red-100', text: 'text-red-700', label: 'Failed' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending' }
    }
    
    const style = config[status as keyof typeof config] || config.pending
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(transaction.created_at).toLocaleDateString('en-IN')}
                </td>
               <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {transaction.agents.name}
                  <span className="ml-2 text-xs text-gray-400">
                    ({transaction.agents.type})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  ₹{transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                  {transaction.razorpay_payment_id || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(transaction.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 