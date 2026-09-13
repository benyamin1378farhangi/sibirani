import { useTranslations } from '../../context/TranslationsContext'

export default function KeywordCard({ keyword }) {
  const { activeLanguage, languages } = useTranslations()
  const lang = languages.find((l) => l.code === activeLanguage)
  const translation = keyword.translations[activeLanguage]?.trim()

  return (
    <li className="keyword-card glass">
      <span className="keyword-card__key">{keyword.key}</span>
      {translation ? (
        <span className="keyword-card__translation" dir={lang?.dir}>
          {translation}
        </span>
      ) : (
        <span className="keyword-card__empty" dir={lang?.dir}>
          {lang?.emptyStateText ?? 'Not translated yet'}
        </span>
      )}
    </li>
  )
}
