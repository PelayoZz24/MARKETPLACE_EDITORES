
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
    <div className="bg-white rounded-xl border border-neutral-200 shadow-md p-4 mb-4 flex justify-between items-center transition-shadow hover:shadow-xl hover:scale-105 group">
      <div className="flex items-center gap-3">
        {/* Icono de estado */}
        <span className={`w-3 h-3 rounded-full mr-2 animate-pulse ${status === 'pending' ? 'bg-warning' : status === 'in_progress' ? 'bg-primary-cliente' : 'bg-success'}`}></span>
        <div>
          <h3 className="text-xl font-semibold mb-1 text-neutral-900">{title}</h3>
          <p className={`text-sm font-medium ${statusColors[status]}`}>Estado: {status.replace('_', ' ')}</p>
        </div>
      </div>
      <button
        onClick={onView}
        className="px-4 py-2 bg-primary-cliente text-white rounded-lg font-semibold shadow transition-colors duration-200 hover:bg-primary-cliente/80 focus:outline-none focus:ring-2 focus:ring-primary-cliente disabled:opacity-50"
      >
        Ver detalles
      </button>
    </div>
  )
}
