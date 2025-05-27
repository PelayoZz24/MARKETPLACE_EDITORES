// components/PortfolioItem.tsx
'use client'

interface PortfolioItemProps {
  url: string
  title?: string
}

export default function PortfolioItem({ url, title }: PortfolioItemProps) {
  return (
    <div className="border rounded overflow-hidden">
      <video src={url} controls className="w-full h-40 object-cover" />
      {title && <p className="p-2 text-sm font-medium">{title}</p>}
    </div>
  )
}
