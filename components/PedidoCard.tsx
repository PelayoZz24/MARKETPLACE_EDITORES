
// components/PedidoCard.tsx
'use client'

interface PedidoCardProps {
  title: string
  status: 'pending' | 'in_progress' | 'delivered'
  onView: () => void
}

export default function PedidoCard({ title, status, onView }: PedidoCardProps) {
  const statusColors = {
    pending: 'text-yellow-600',
    in_progress: 'text-blue-600',
    delivered: 'text-green-600',
  }

  return (
    <div className="p-4 bg-white rounded shadow flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className={`text-sm ${statusColors[status]}`}>Estado: {status.replace('_', ' ')}</p>
      </div>
      <button
        onClick={onView}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Ver detalles
      </button>
    </div>
  )
}
