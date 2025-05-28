// components/PortfolioItem.tsx
'use client'

interface PortfolioItemProps {
  url: string
  title?: string
}

export default function PortfolioItem({ url, title }: PortfolioItemProps) {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-md overflow-hidden mb-4 transition-shadow hover:shadow-xl hover:scale-105 group">
      {url ? (
        <video src={url} controls className="w-full h-40 md:h-56 object-cover bg-neutral-100 transition-all duration-200 group-hover:brightness-95" />
      ) : null}
      {title && <p className="p-3 text-base md:text-lg font-semibold text-neutral-900 border-t border-neutral-100 bg-neutral-50">{title}</p>}
    </div>
  )
}
