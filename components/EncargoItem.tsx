// components/EncargoItem.tsx
'use client'

interface EncargoItemProps {
  id: string
  title: string
  client_email: string
  status: 'pending' | 'in_progress' | 'delivered'
  onAction: (id: string) => void
}

export default function EncargoItem({ id, title, client_email, status, onAction }: EncargoItemProps) {
  const statusLabels = {
    pending: { text: 'Pendiente', color: 'text-yellow-600' },
    in_progress: { text: 'En progreso', color: 'text-blue-600' },
    delivered: { text: 'Entregado', color: 'text-green-600' },
  }

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-md p-4 mb-4 flex justify-between items-center transition-shadow hover:shadow-xl hover:scale-105 group">
      <div className="flex items-center gap-3">
        {/* Icono de estado */}
        <span className={`w-3 h-3 rounded-full mr-2 animate-pulse ${status === 'pending' ? 'bg-warning' : status === 'in_progress' ? 'bg-primary-editor' : 'bg-success'}`}></span>
        <div>
          <h3 className="text-xl font-semibold mb-1 text-neutral-900">{title}</h3>
          <p className="text-sm text-neutral-400 font-medium">Cliente: {client_email}</p>
          <p className={`text-sm font-medium ${statusLabels[status].color}`}>Estado: {statusLabels[status].text}</p>
        </div>
      </div>
      <button
        onClick={() => onAction(id)}
        className="px-4 py-2 bg-primary-editor text-white rounded-lg font-semibold shadow transition-colors duration-200 hover:bg-primary-editor/80 focus:outline-none focus:ring-2 focus:ring-primary-editor disabled:opacity-50"
      >
        {status === 'pending' ? 'Aceptar' : status === 'in_progress' ? 'Marcar entregado' : 'Ver detalle'}
      </button>
    </div>
  )
}
