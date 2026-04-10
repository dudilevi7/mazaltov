'use client'
import CustomButton from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'

interface TodoHeaderProps {
  onAddClick: () => void
  searchValue: string
  onSearchChange: (value: string) => void
}

export default function TodoHeader({ onAddClick, searchValue, onSearchChange }: TodoHeaderProps) {
  return (
    <div className="flex flex-row items-center gap-3 flex-wrap">
      <CustomButton onClick={onAddClick}>לחץ להוספת משימה</CustomButton>
      <SearchBar value={searchValue} onChange={onSearchChange} />
    </div>
  )
}
