import { useEffect, useRef, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable'
import { useTranslations } from '../context/TranslationsContext'
import LanguageSelect from '../components/LanguageSelect'
import KeywordRow from '../components/dashboard/KeywordRow'
import AddKeywordForm from '../components/dashboard/AddKeywordForm'

export default function Dashboard() {
  const { keywords, reorderKeywords } = useTranslations()
  const [isAdding, setIsAdding] = useState(false)
  const formRef = useRef(null)

  // The trigger button is fixed to the viewport, so opening the form can
  // happen from anywhere in a long list — scroll it into view instead of
  // leaving it wherever it lands in the document flow.
  useEffect(() => {
    if (isAdding) {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [isAdding])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const fromIndex = keywords.findIndex((k) => k.id === active.id)
    const toIndex = keywords.findIndex((k) => k.id === over.id)
    if (fromIndex === -1 || toIndex === -1) return

    reorderKeywords(fromIndex, toIndex)
  }

  return (
    <div className="page dashboard">
      <header className="page__header">
        <h1>Translation Management</h1>
        <LanguageSelect />
      </header>

      <div className="dashboard__panel glass">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={keywords.map((k) => k.id)} strategy={verticalListSortingStrategy}>
            <ul className="keyword-list">
              {keywords.map((keyword) => (
                <KeywordRow key={keyword.id} keyword={keyword} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      </div>

      {isAdding && (
        <div ref={formRef}>
          <AddKeywordForm onClose={() => setIsAdding(false)} />
        </div>
      )}

      {!isAdding && (
        <div className="dashboard__action-bar">
          <button type="button" className="btn btn--primary btn--block" onClick={() => setIsAdding(true)}>
            + Add Keyword
          </button>
        </div>
      )}
    </div>
  )
}
