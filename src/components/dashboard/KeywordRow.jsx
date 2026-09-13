import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTranslations } from '../../context/TranslationsContext'

export default function KeywordRow({ keyword }) {
  const { activeLanguage, languages, updateTranslation } = useTranslations()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: keyword.id,
  })

  const lang = languages.find((l) => l.code === activeLanguage)
  const translation = keyword.translations[activeLanguage] ?? ''
  const isMissing = translation.trim().length === 0

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className="keyword-row">
      <button
        type="button"
        className="keyword-row__handle"
        aria-label={`Reorder ${keyword.key}`}
        {...attributes}
        {...listeners}
      >
        ⠿
      </button>

      <span className={`keyword-row__key ${isMissing ? 'is-missing' : ''}`}>{keyword.key}</span>

      <input
        className={`keyword-row__input ${isMissing ? 'is-missing' : ''}`}
        value={translation}
        placeholder="....."
        dir={lang?.dir}
        onChange={(event) => updateTranslation(keyword.id, activeLanguage, event.target.value)}
        aria-label={`${keyword.key} translation in ${lang?.name}`}
      />
    </li>
  )
}
