'use client'

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function SearchBar({ value, onChange, placeholder = 'חיפוש', className = '' }: SearchBarProps) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      dir="rtl"
      className={`flex-1 min-w-0 h-7 max-w-72 rounded border border-gray-300 px-3 py-1.5 text-sm
        bg-linear-to-b from-gray-50 to-gray-100 text-gray-700 focus:border-gray-500 focus:outline-none ${className}`}
    />
  )
}
