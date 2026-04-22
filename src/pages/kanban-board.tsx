import { useState, useEffect } from 'react'
import {
  ApplicationHeader,
  HeadingField,
  CardLayout,
  ImageField,
  TagField,
  ProgressBar,
  ButtonWidget,
  ButtonArrayLayout,
  TextField,
  DialogField,
  DropdownField,
  RichTextDisplayField,
  TextItem
} from '@pglevy/sailwind'
import { getLists, type BoardList } from '../db/lists'
import { getCards, createCard, updateCard, deleteCard, type Card } from '../db/cards'
import { getTasks, createTask, updateTask, deleteTask, type Task } from '../db/tasks'
import { getDisplayName, getInitials } from '../db/users'

export default function KanbanBoard() {
  const [lists, setLists] = useState<BoardList[]>([])
  const [cards, setCards] = useState<Card[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [showNewCardDialog, setShowNewCardDialog] = useState(false)
  const [newCardListId, setNewCardListId] = useState<number | null>(null)
  const [newCardName, setNewCardName] = useState('')
  const [newCardDescription, setNewCardDescription] = useState('')
  const [newTaskTitle, setNewTaskTitle] = useState('')

  useEffect(() => {
    Promise.all([getLists(), getCards(), getTasks()]).then(([l, c, t]) => {
      setLists(l)
      setCards(c)
      setTasks(t)
    })
  }, [])

  const cardsForList = (listId: number) => cards.filter(c => c.listId === listId)
  const tasksForCard = (cardId: number) => tasks.filter(t => t.cardId === cardId)

  const handleAddCard = async () => {
    if (!newCardName.trim() || !newCardListId) return
    const card = await createCard({
      name: newCardName.trim(),
      description: newCardDescription.trim(),
      listId: newCardListId,
      isPriority: false,
      createdBy: 'alice.chen',
      createdOn: new Date().toISOString().split('T')[0],
      modifiedBy: 'alice.chen',
      modifiedOn: new Date().toISOString().split('T')[0],
    })
    setCards(prev => [...prev, card])
    setNewCardName('')
    setNewCardDescription('')
    setShowNewCardDialog(false)
    setNewCardListId(null)
  }

  const handleMoveCard = async (card: Card, newListId: number) => {
    const updated = await updateCard(card.id, { listId: newListId, modifiedOn: new Date().toISOString().split('T')[0] })
    if (updated) {
      setCards(prev => prev.map(c => c.id === card.id ? updated : c))
      if (selectedCard?.id === card.id) setSelectedCard(updated)
    }
  }

  const handleDeleteCard = async (cardId: number) => {
    await deleteCard(cardId)
    setCards(prev => prev.filter(c => c.id !== cardId))
    setTasks(prev => prev.filter(t => t.cardId !== cardId))
    setSelectedCard(null)
  }

  const handleTogglePriority = async (card: Card) => {
    const updated = await updateCard(card.id, { isPriority: !card.isPriority })
    if (updated) {
      setCards(prev => prev.map(c => c.id === card.id ? updated : c))
      if (selectedCard?.id === card.id) setSelectedCard(updated)
    }
  }

  const handleToggleTask = async (task: Task) => {
    const updated = await updateTask(task.id, { isDone: !task.isDone })
    if (updated) setTasks(prev => prev.map(t => t.id === task.id ? updated : t))
  }

  const handleAddTask = async (cardId: number) => {
    if (!newTaskTitle.trim()) return
    const task = await createTask({
      title: newTaskTitle.trim(),
      isDone: false,
      cardId,
      createdBy: 'alice.chen',
      createdOn: new Date().toISOString().split('T')[0],
      modifiedBy: 'alice.chen',
      modifiedOn: new Date().toISOString().split('T')[0],
    })
    setTasks(prev => [...prev, task])
    setNewTaskTitle('')
  }

  const handleDeleteTask = async (taskId: number) => {
    await deleteTask(taskId)
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  const completedCount = (cardId: number) => tasksForCard(cardId).filter(t => t.isDone).length
  const totalCount = (cardId: number) => tasksForCard(cardId).length

  return (
    <div className="min-h-screen bg-gray-50">
      <ApplicationHeader name="Build Board" userInitials="PL" />

      <div className="px-5 py-8">
        {/* <div className="flex items-center justify-between mb-5">
          <HeadingField text="Active Cycle" size="LARGE_PLUS" headingTag="H1" marginBelow="NONE" />
          <ButtonWidget
            label="New Card"
            style="SOLID"
            color="#152B99"
            size="SMALL"
            icon="Plus"
            onClick={() => { setNewCardListId(lists[0]?.id ?? 1); setShowNewCardDialog(true) }}
          />
        </div> */}

        {/* Board columns */}
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 180px)' }}>
          {lists.map(list => {
            const listCards = cardsForList(list.id)
            return (
              <div key={list.id} className="shrink-0 w-96">
                <div className="bg-purple-100 rounded-lg p-3 shadow-md">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <HeadingField text={list.name} size="MEDIUM" fontWeight="SEMI_BOLD" marginBelow="NONE" headingTag="H2" />
                      <TagField
                        tags={[{ text: String(listCards.length), backgroundColor: '#D9AEFF' }]}
                        size="SMALL"
                        marginBelow="NONE"
                      />
                    </div>
                    <ButtonWidget
                      icon="Plus"
                      style="GHOST"
                      size="STANDARD"
                      color="#962FEA"
                      onClick={() => { setNewCardListId(list.id); setShowNewCardDialog(true) }}
                      accessibilityText={`Add card to ${list.name}`}
                    />
                  </div>

                  <div className="space-y-2">
                    {listCards.map(card => {
                      const cardTasks = tasksForCard(card.id)
                      const done = cardTasks.filter(t => t.isDone).length
                      const total = cardTasks.length
                      return (
                        <div key={card.id} onClick={() => setSelectedCard(card)} className="cursor-pointer">
                          <CardLayout padding="STANDARD" shape="SEMI_ROUNDED" showShadow={false} showBorder={true} marginBelow="STANDARD" className="border-1">
                            {card.isPriority && (
                              <TagField
                                tags={[{ text: 'Priority', backgroundColor: 'NEGATIVE' }]}
                                size="SMALL"
                                marginBelow="LESS"
                              />
                            )}
                            <HeadingField text={card.name} size="SMALL" fontWeight="BOLD" marginBelow="NONE" headingTag="H2" />
                            {card.description && (
                              <RichTextDisplayField
                                labelPosition="COLLAPSED"
                                value={[
                                  <TextItem style="PLAIN" size="STANDARD" color="SECONDARY" text={card.description}/>
                                ]}
                              />
                            )}
                            <div className="flex items-center gap-3">
                              <ImageField
                                images={[{
                                  imageType: 'user' as const,
                                  user: {
                                    initials: getInitials(card.createdBy),
                                    name: getDisplayName(card.createdBy),
                                  },
                                }]}
                                labelPosition="COLLAPSED"
                                size="ICON_PLUS"
                                style="AVATAR"
                                marginBelow="NONE"
                              />
                              {total > 0 && (
                                <div className="flex-1">
                                  <ProgressBar
                                    percentage={Math.round((done / total) * 100)}
                                    style="THIN"
                                    color="#FAA92F"
                                    label={`${done} of ${total}`}
                                    labelPosition="COLLAPSED"
                                    marginBelow="NONE"
                                    showPercentage={false}
                                  />
                                </div>
                              )}
                            </div>
                          </CardLayout>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Card detail dialog */}
      {selectedCard && (
        <DialogField
          open={true}
          onClose={() => { setSelectedCard(null); setNewTaskTitle('') }}
          title={selectedCard.name}
          width="MEDIUM_PLUS"
        >
          <div className="space-y-4">
            {/* Move to list */}
            <DropdownField
              label="List"
              value={selectedCard.listId}
              choiceLabels={lists.map(l => l.name)}
              choiceValues={lists.map(l => l.id)}
              onChange={(val: number) => {
                if (val !== selectedCard.listId) handleMoveCard(selectedCard, val)
              }}
              labelPosition="ABOVE"
              marginBelow="STANDARD"
            />

            {/* Priority toggle */}
            <div className="flex items-center gap-3">
              <ButtonWidget
                label={selectedCard.isPriority ? 'Remove Priority' : 'Mark Priority'}
                style="OUTLINE"
                color={selectedCard.isPriority ? 'NEGATIVE' : 'SECONDARY'}
                size="SMALL"
                icon="AlertCircle"
                onClick={() => handleTogglePriority(selectedCard)}
              />
            </div>

            {/* Description */}
            {selectedCard.description && (
              <div>
                <HeadingField text="Description" size="SMALL" marginBelow="EVEN_LESS" />
                <RichTextDisplayField
                  value={[
                    <TextItem key="desc" text={selectedCard.description} size="STANDARD" color="SECONDARY" />
                  ]}
                  marginBelow="NONE"
                />
              </div>
            )}

            {/* Tasks checklist */}
            <div>
              <HeadingField text={`Tasks (${completedCount(selectedCard.id)}/${totalCount(selectedCard.id)})`} size="SMALL" marginBelow="EVEN_LESS" />
              {totalCount(selectedCard.id) > 0 && (
                <ProgressBar
                  percentage={Math.round((completedCount(selectedCard.id) / totalCount(selectedCard.id)) * 100)}
                  style="THIN"
                  color="ACCENT"
                  labelPosition="COLLAPSED"
                  showPercentage={false}
                  marginBelow="LESS"
                />
              )}
              <div className="space-y-1">
                {tasksForCard(selectedCard.id).map(task => (
                  <div key={task.id} className="flex items-center gap-2 group">
                    <input
                      type="checkbox"
                      checked={task.isDone}
                      onChange={() => handleToggleTask(task)}
                      className="h-4 w-4 rounded border-gray-200 text-blue-500 focus:ring-blue-500"
                    />
                    <span className={`text-sm flex-1 ${task.isDone ? 'line-through text-gray-500' : 'text-gray-700'}`}>
                      {task.title}
                    </span>
                    <ButtonWidget
                      icon="Trash2"
                      style="GHOST"
                      size="SMALL"
                      color="SECONDARY"
                      onClick={() => handleDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <div className="flex-1">
                  <TextField
                    label=""
                    value={newTaskTitle}
                    onChange={setNewTaskTitle}
                    placeholder="Add a task..."
                    labelPosition="COLLAPSED"
                    marginBelow="NONE"
                  />
                </div>
                <ButtonWidget
                  label="Add"
                  style="OUTLINE"
                  color="ACCENT"
                  size="SMALL"
                  onClick={() => handleAddTask(selectedCard.id)}
                  disabled={!newTaskTitle.trim()}
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t pt-3 mt-3">
              <HeadingField text="Details" size="SMALL" marginBelow="EVEN_LESS" />
              <RichTextDisplayField
                value={[
                  <TextItem key="cb" text={`Created by ${getDisplayName(selectedCard.createdBy)} · ${selectedCard.createdOn}`} size="SMALL" color="SECONDARY" />,
                  <br key="br1" />,
                  <TextItem key="mb" text={`Modified by ${getDisplayName(selectedCard.modifiedBy)} · ${selectedCard.modifiedOn}`} size="SMALL" color="SECONDARY" />,
                ]}
                marginBelow="NONE"
              />
            </div>

            {/* Delete card */}
            <div className="border-t pt-3">
              <ButtonWidget
                label="Delete Card"
                style="OUTLINE"
                color="NEGATIVE"
                size="SMALL"
                icon="Trash2"
                onClick={() => handleDeleteCard(selectedCard.id)}
              />
            </div>
          </div>
        </DialogField>
      )}

      {/* New card dialog */}
      {showNewCardDialog && (
        <DialogField
          open={true}
          onClose={() => { setShowNewCardDialog(false); setNewCardName(''); setNewCardDescription('') }}
          title="New Card"
          width="MEDIUM"
        >
          <div className="space-y-4">
            <TextField
              label="Name"
              value={newCardName}
              onChange={setNewCardName}
              placeholder="Card name"
              labelPosition="ABOVE"
              marginBelow="STANDARD"
            />
            <TextField
              label="Description"
              value={newCardDescription}
              onChange={setNewCardDescription}
              placeholder="Optional description"
              labelPosition="ABOVE"
              marginBelow="STANDARD"
            />
            <DropdownField
              label="List"
              value={newCardListId}
              choiceLabels={lists.map(l => l.name)}
              choiceValues={lists.map(l => l.id)}
              onChange={(val: number) => setNewCardListId(val)}
              labelPosition="ABOVE"
              marginBelow="STANDARD"
            />
            <ButtonArrayLayout
              buttons={[
                { label: 'Create', style: 'SOLID', color: 'ACCENT', onClick: handleAddCard, disabled: !newCardName.trim() },
                { label: 'Cancel', style: 'OUTLINE', color: 'SECONDARY', onClick: () => { setShowNewCardDialog(false); setNewCardName(''); setNewCardDescription('') } },
              ]}
              align="START"
            />
          </div>
        </DialogField>
      )}
    </div>
  )
}
