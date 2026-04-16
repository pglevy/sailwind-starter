import { useState, useEffect } from 'react'
import {
  HeadingField,
  CardLayout,
  ButtonWidget,
  ButtonArrayLayout,
  TagField,
  TextItem,
  RichTextDisplayField,
  TextField,
  MessageBanner,
  DropdownField,
} from '@pglevy/sailwind'
import { ShoppingCart, Check, Circle, Star, X } from 'lucide-react'
import { getGroceryItems, createGroceryItem, updateGroceryItem, deleteGroceryItem, type GroceryItem } from '../db/groceryItems'
import { getSections, type Section } from '../db/sections'

type ViewMode = 'all' | 'favorites'

export default function GroceryList() {
  const [items, setItems] = useState<GroceryItem[]>([])
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<ViewMode>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItemName, setNewItemName] = useState('')
  const [newItemQty, setNewItemQty] = useState('')
  const [newItemSectionId, setNewItemSectionId] = useState<number>(1)
  const [addError, setAddError] = useState('')

  useEffect(() => {
    Promise.all([getGroceryItems(), getSections()]).then(([itemData, sectionData]) => {
      setItems(itemData)
      setSections(sectionData)
      if (sectionData.length > 0) setNewItemSectionId(sectionData[0].id)
      setLoading(false)
    })
  }, [])

  const refresh = async () => {
    const updated = await getGroceryItems()
    setItems(updated)
  }

  const handleTogglePurchased = async (item: GroceryItem) => {
    await updateGroceryItem(item.id, { purchased: !item.purchased })
    await refresh()
  }

  const handleToggleFavorite = async (item: GroceryItem) => {
    await updateGroceryItem(item.id, { favorite: !item.favorite })
    await refresh()
  }

  const handleDelete = async (id: number) => {
    await deleteGroceryItem(id)
    await refresh()
  }

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      setAddError('Item name is required.')
      return
    }
    await createGroceryItem({
      name: newItemName.trim(),
      quantity: newItemQty.trim() || '1',
      sectionId: newItemSectionId,
      purchased: false,
      favorite: false,
    })
    setNewItemName('')
    setNewItemQty('')
    setAddError('')
    setShowAddForm(false)
    await refresh()
  }

  const handleLoadFavorites = async () => {
    const allItems = await getGroceryItems()
    const favs = allItems.filter(i => i.favorite)
    // Add any favorites not already on the list (by name)
    const existingNames = new Set(allItems.map(i => i.name.toLowerCase()))
    const toAdd = favs.filter(i => !existingNames.has(i.name.toLowerCase()))
    for (const fav of toAdd) {
      await createGroceryItem({ name: fav.name, quantity: fav.quantity, sectionId: fav.sectionId, purchased: false, favorite: fav.favorite })
    }
    // Uncheck purchased favorites
    for (const item of allItems.filter(i => i.favorite && i.purchased)) {
      await updateGroceryItem(item.id, { purchased: false })
    }
    await refresh()
  }

  const displayItems = viewMode === 'favorites'
    ? items.filter(i => i.favorite)
    : items

  // Group by section, preserving section sort order
  const grouped = sections
    .map(section => ({
      section,
      items: displayItems.filter(i => i.sectionId === section.id),
    }))
    .filter(g => g.items.length > 0)

  const totalCount = items.length
  const purchasedCount = items.filter(i => i.purchased).length
  const allDone = totalCount > 0 && purchasedCount === totalCount

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {loading ? (
        <div className="text-center py-8">Loading...</div>
      ) : (
        <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="w-7 h-7 text-blue-700" />
          <HeadingField text="Grocery List" size="LARGE" headingTag="H1" marginBelow="NONE" />
        </div>
        <TagField
          tags={[{ text: `${purchasedCount} / ${totalCount} done`, backgroundColor: allDone ? 'POSITIVE' : 'STANDARD' }]}
          size="SMALL"
          marginBelow="NONE"
        />
      </div>

      {/* Actions bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <ButtonWidget
          label={viewMode === 'all' ? 'Show Favorites' : 'Show All'}
          style={viewMode === 'favorites' ? 'SOLID' : 'OUTLINE'}
          color="ACCENT"
          onClick={() => setViewMode(v => v === 'all' ? 'favorites' : 'all')}
        />
        <ButtonWidget
          label="Load Favorites"
          style="OUTLINE"
          color="SECONDARY"
          onClick={handleLoadFavorites}
        />
        <ButtonWidget
          label="+ Add Item"
          style="SOLID"
          color="ACCENT"
          onClick={() => { setShowAddForm(s => !s); setAddError('') }}
        />
      </div>

      {/* Add item form */}
      {showAddForm && sections.length > 0 && (
        <CardLayout padding="STANDARD" showShadow={true}>
          <HeadingField text="Add Item" size="MEDIUM" marginBelow="STANDARD" />
          {addError && (
            <MessageBanner type="ERROR" message={addError} marginBelow="STANDARD" />
          )}
          <div className="space-y-3">
            <TextField
              label="Item Name"
              value={newItemName}
              onChange={(v: string) => setNewItemName(v)}
              placeholder="e.g. Almond Milk"
            />
            <TextField
              label="Quantity"
              value={newItemQty}
              onChange={(v: string) => setNewItemQty(v)}
              placeholder="e.g. 1 carton"
            />
            <DropdownField
              label="Store Section"
              choiceLabels={sections.map(s => s.name)}
              choiceValues={sections.map(s => String(s.id))}
              value={String(newItemSectionId)}
              onChange={(v: string | null) => {
                if (v) setNewItemSectionId(Number(v))
              }}
              placeholder="Select a section"
            />
          </div>
          <div className="mt-4">
            <ButtonArrayLayout
              buttons={[
                { label: 'Add to List', style: 'SOLID', color: 'ACCENT', onClick: handleAddItem },
                { label: 'Cancel', style: 'OUTLINE', color: 'SECONDARY', onClick: () => { setShowAddForm(false); setAddError('') } },
              ]}
              align="START"
            />
          </div>
        </CardLayout>
      )}

      {/* All done banner */}
      {allDone && (
        <MessageBanner
          type="SUCCESS"
          message="You've checked off everything on your list!"
        />
      )}

      {/* Empty state */}
      {grouped.length === 0 && (
        <CardLayout padding="MORE" showShadow={false}>
          <div className="text-center py-8 space-y-3">
            <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto" />
            <RichTextDisplayField
              value={[<TextItem key="empty" text={viewMode === 'favorites' ? 'No favorites yet. Star items to save them.' : 'Your list is empty. Add some items!'} color="SECONDARY" />]}
            />
          </div>
        </CardLayout>
      )}

      {/* Grouped sections */}
      {grouped.map(({ section, items: sectionItems }) => (
        <CardLayout key={section.id} padding="STANDARD" showShadow={true}>
          <HeadingField text={section.name} size="MEDIUM" marginBelow="STANDARD" />
          <div className="space-y-3">
            {sectionItems.map(item => (
              <div
                key={item.id}
                className={`flex items-center gap-3 p-2 rounded-md transition-colors ${item.purchased ? 'opacity-50' : ''}`}
              >
                {/* Purchased toggle */}
                <button
                  onClick={() => handleTogglePurchased(item)}
                  className="shrink-0 hover:scale-110 transition-transform"
                  aria-label={item.purchased ? 'Mark as not purchased' : 'Mark as purchased'}
                >
                  {item.purchased
                    ? <Check className="w-6 h-6 text-green-600" />
                    : <Circle className="w-6 h-6 text-gray-400" />}
                </button>

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <div className={item.purchased ? 'line-through opacity-60' : ''}>
                    <RichTextDisplayField
                      value={[
                        <TextItem
                          key="name"
                          text={item.name}
                          fontWeight="SEMI_BOLD"
                        />,
                      ]}
                      marginBelow="NONE"
                    />
                  </div>
                  <RichTextDisplayField
                    value={[
                      <TextItem key="qty" text={item.quantity} color="SECONDARY" size="SMALL" />,
                    ]}
                    marginBelow="NONE"
                  />
                </div>

                {/* Favorite toggle */}
                <button
                  onClick={() => handleToggleFavorite(item)}
                  className="shrink-0 hover:scale-110 transition-transform"
                  aria-label={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Star className={`w-5 h-5 ${item.favorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
                </button>

                {/* Delete */}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="shrink-0 text-gray-300 hover:text-red-500 transition-colors"
                  aria-label="Remove item"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardLayout>
      ))}
        </>
      )}
    </div>
  )
}
