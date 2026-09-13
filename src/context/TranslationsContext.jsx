import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, DEFAULT_LANGUAGE_CODE } from '../data/languages'
import { SEED_KEYWORDS } from '../data/seedKeywords'
import { loadKeywords, saveKeywords } from '../utils/storage'
import { generateId } from '../utils/id'

const TranslationsContext = createContext(null)

function createEmptyTranslations() {
  return LANGUAGES.reduce((acc, lang) => {
    acc[lang.code] = ''
    return acc
  }, {})
}

export function TranslationsProvider({ children }) {
  const [keywords, setKeywords] = useState(() => loadKeywords(SEED_KEYWORDS))
  const [activeLanguage, setActiveLanguage] = useState(DEFAULT_LANGUAGE_CODE)

  // Single source of truth: every change to `keywords` is written to
  // localStorage here, so both pages stay in sync after a reload.
  useEffect(() => {
    saveKeywords(keywords)
  }, [keywords])

  function addKeyword(key, languageCode, translationText) {
    const trimmedKey = key.trim()
    if (!trimmedKey) return

    const translations = createEmptyTranslations()
    if (languageCode) {
      translations[languageCode] = translationText.trim()
    }

    setKeywords((prev) => [
      ...prev,
      { id: generateId(), key: trimmedKey, translations },
    ])
  }

  function updateTranslation(id, languageCode, text) {
    setKeywords((prev) =>
      prev.map((keyword) =>
        keyword.id === id
          ? { ...keyword, translations: { ...keyword.translations, [languageCode]: text } }
          : keyword,
      ),
    )
  }

  function reorderKeywords(fromIndex, toIndex) {
    setKeywords((prev) => {
      const next = [...prev]
      const [moved] = next.splice(fromIndex, 1)
      next.splice(toIndex, 0, moved)
      return next
    })
  }

  const value = useMemo(
    () => ({
      keywords,
      languages: LANGUAGES,
      activeLanguage,
      setActiveLanguage,
      addKeyword,
      updateTranslation,
      reorderKeywords,
    }),
    [keywords, activeLanguage],
  )

  return <TranslationsContext.Provider value={value}>{children}</TranslationsContext.Provider>
}

export function useTranslations() {
  const context = useContext(TranslationsContext)
  if (!context) {
    throw new Error('useTranslations must be used within a TranslationsProvider')
  }
  return context
}
