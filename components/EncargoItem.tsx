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
    <div className="p-4 bg-white rounded shadow flex justify-between items-center">
      <div>
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">Cliente: {client_email}</p>
        <p className={`text-sm ${statusLabels[status].color}`}>Estado: {statusLabels[status].text}</p>
      </div>
      <button
        onClick={() => onAction(id)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {status === 'pending' ? 'Aceptar' : status === 'in_progress' ? 'Marcar entregado' : 'Ver detalle'}
      </button>
    </div>
  )
}
