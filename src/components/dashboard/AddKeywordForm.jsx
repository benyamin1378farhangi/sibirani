import { useState } from 'react'
import { useTranslations } from '../../context/TranslationsContext'

export default function AddKeywordForm({ onClose }) {
  const { languages, activeLanguage, addKeyword } = useTranslations()
  const [key, setKey] = useState('')
  const [languageCode, setLanguageCode] = useState(activeLanguage)
  const [translationText, setTranslationText] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    if (!key.trim()) return

    addKeyword(key, languageCode, translationText)
    setKey('')
    setTranslationText('')
    onClose()
  }

  return (
    <form className="add-keyword-form glass" onSubmit={handleSubmit}>
      <div className="add-keyword-form__row">
        <label>
          Keyword
          <input
            autoFocus
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="e.g. goodbye"
            required
          />
        </label>

        <label>
          Language
          <select value={languageCode} onChange={(event) => setLanguageCode(event.target.value)}>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.nativeName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label>
        Translation
        <input
          value={translationText}
          onChange={(event) => setTranslationText(event.target.value)}
          placeholder="Translation for the selected language"
          dir={languages.find((l) => l.code === languageCode)?.dir}
        />
      </label>

      <div className="add-keyword-form__actions">
        <button type="button" className="btn btn--ghost" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="btn btn--primary">
          Save keyword
        </button>
      </div>
    </form>
  )
}
