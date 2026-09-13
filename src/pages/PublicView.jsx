import { useTranslations } from '../context/TranslationsContext'
import LanguageSelect from '../components/LanguageSelect'
import KeywordCard from '../components/public/KeywordCard'

export default function PublicView() {
  const { keywords } = useTranslations()

  return (
    <div className="page public-view">
      <header className="page__header">
        <h1>Word Translations</h1>
        <LanguageSelect />
      </header>

      <ul className="keyword-card-grid">
        {keywords.map((keyword) => (
          <KeywordCard key={keyword.id} keyword={keyword} />
        ))}
      </ul>
    </div>
  )
}
