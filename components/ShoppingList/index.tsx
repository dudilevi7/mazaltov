'use client'

import { useMemo, useState } from 'react'
import { useShoppingContext } from '@/context/ShoppingContext'
import { useAppContext } from '@/context/AppContext'
import type { ShoppingItem } from '@/types/ShoppingItem'
import ShoppingModal, { type ShoppingFormData } from './ShoppingModal'
import ShoppingListItem from './ShoppingListItem'
import DeleteModal from '@/components/DeleteModal'
import CustomButton from '@/components/Button/custom-button'
import SearchBar from '@/components/SearchBar'
import SpinnerLoader from '@/components/Shared/SpinnerLoader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faCartShopping } from '@fortawesome/free-solid-svg-icons'
import { formatCurrency } from '@/lib/utils'

const ShoppingList = () => {
  const { items, addItem, updateItem, removeItem, togglePurchased, isLoadingItems } = useShoppingContext()
  const { languageDirection } = useAppContext()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ShoppingItem | null>(null)
  const [itemToDelete, setItemToDelete] = useState<ShoppingItem | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    if (!q) return items
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.notes.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    )
  }, [items, searchQuery])

  const unpurchased = useMemo(() => filtered.filter((i) => !i.isPurchased), [filtered])
  const purchased = useMemo(() => filtered.filter((i) => i.isPurchased), [filtered])

  const totalEstimated = useMemo(
    () => items.reduce((sum, i) => sum + i.estimatedPrice * i.quantity, 0),
    [items]
  )
  const purchasedTotal = useMemo(
    () => items.filter((i) => i.isPurchased).reduce((sum, i) => sum + i.estimatedPrice * i.quantity, 0),
    [items]
  )

  const handleOpenCreate = () => {
    setEditingItem(null)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: ShoppingItem) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
  }

  const handleSave = async (data: ShoppingFormData) => {
    if (editingItem) {
      await updateItem(editingItem.id, data)
    } else {
      await addItem(data)
    }
    handleCloseModal()
  }

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      removeItem(itemToDelete.id)
      setItemToDelete(null)
    }
  }

  if (isLoadingItems) {
    return <SpinnerLoader size="lg" isLoadingPage />
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden animate-fade-in">
      <div className="mb-4 flex shrink-0 items-center justify-between gap-3" dir="rtl">
        <div className="flex items-center gap-3">
          <CustomButton onClick={handleOpenCreate}>
            <FontAwesomeIcon icon={faPlus} className="ml-1 h-3 w-3" />
            הוסף פריט
          </CustomButton>
          <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="חיפוש פריט..." />
        </div>
        {totalEstimated > 0 && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>סה״כ משוער: <strong className="text-gray-900">{formatCurrency(totalEstimated)}</strong></span>
            <span className="text-gray-300">|</span>
            <span>נקנה: <strong className="text-green-600">{formatCurrency(purchasedTotal)}</strong></span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2" dir={languageDirection}>
        <span className="text-sm text-gray-500">
          {items.length} פריטים · {items.filter((i) => i.isPurchased).length} נקנו
        </span>
      </div>

      <ul className="min-h-0 flex-1 overflow-auto py-2 px-1 flex flex-col gap-2">
        {unpurchased.length === 0 && purchased.length === 0 && (
          <div className="rounded-lg bg-gray-100 p-6 text-center text-gray-500 h-full flex flex-col items-center justify-center gap-2">
            <FontAwesomeIcon icon={faCartShopping} className="text-gray-400 h-10 w-10" />
            <span className="text-sm font-medium">אין פריטים ברשימת הקניות</span>
          </div>
        )}

        {unpurchased.map((item) => (
          <ShoppingListItem
            key={item.id}
            item={item}
            onToggle={togglePurchased}
            onEdit={handleOpenEdit}
            onDelete={setItemToDelete}
          />
        ))}

        {purchased.length > 0 && (
          <>
            <li className="flex flex-col gap-2 pt-4 mt-2 border-t border-gray-200 list-none">
              <span className="text-sm text-gray-500" dir={languageDirection}>
                {purchased.length} פריטים שנקנו
              </span>
            </li>
            {purchased.map((item) => (
              <ShoppingListItem
                key={item.id}
                item={item}
                onToggle={togglePurchased}
                onEdit={handleOpenEdit}
                onDelete={setItemToDelete}
              />
            ))}
          </>
        )}
      </ul>

      {isModalOpen && (
        <ShoppingModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          item={editingItem}
        />
      )}

      <DeleteModal
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title={itemToDelete?.name || ''}
      />
    </div>
  )
}

export default ShoppingList
