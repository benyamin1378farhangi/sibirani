import { useTranslations } from '../context/TranslationsContext'

export default function LanguageSelect() {
  const { languages, activeLanguage, setActiveLanguage } = useTranslations()

  return (
    <select
      className="language-select"
      value={activeLanguage}
      onChange={(event) => setActiveLanguage(event.target.value)}
      aria-label="Active language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.nativeName}
        </option>
      ))}
    </select>
  )
}
