# Sib Irani – Translation Management Tool

An internal tool for managing interface keyword translations, built for the
Front-End Developer (React) technical assignment. It has two pages that
share the same data:

- **Management Dashboard** (`/`) — the team edits translations, adds new
  keywords, and reorders the list by dragging.
- **Public View** (`/view`) — end users read keywords and their
  translations and switch between languages.

## Stack

- React 18 + JavaScript (no TypeScript), scaffolded with Vite
- React Router for the two routes
- React Context (`TranslationsContext`) for shared state — no prop drilling
- `@dnd-kit` for accessible drag-and-drop reordering (pointer + keyboard
  sensors)
- Plain CSS (no UI framework), responsive with CSS Grid/Flexbox, with a
  glass/frosted visual treatment on top of the provided design (see
  [UI/UX enhancements](#uiux-enhancements))
- Self-hosted Vazirmatn variable font (`@fontsource-variable/vazirmatn`)

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The dashboard is the home page; the public
view is at `/view` (also reachable from the nav bar).

```bash
npm run build     # production build to dist/
npm run preview   # preview the production build
```

## Project structure

```
src/
  data/languages.js          list of supported languages
  data/seedKeywords.js       pre-set keywords used on first run
  utils/storage.js           safe localStorage read/write
  context/TranslationsContext.jsx   single source of truth + actions
  components/
    LanguageSelect.jsx
    NavBar.jsx
    dashboard/KeywordRow.jsx        draggable row + inline edit
    dashboard/AddKeywordForm.jsx
    public/KeywordCard.jsx
  pages/Dashboard.jsx
  pages/PublicView.jsx
```

State, logic and presentation are kept separate: the context owns shared
state and mutations, pages compose the UI, and components use
`useTranslations()` where they need access to shared state and actions.

## Data model

```js
// keywords: Array<{ id, key, translations }>
{
  id: 'seed-hello',
  key: 'hello',
  translations: { en: 'Hello', fa: 'سلام', ar: 'مرحبا', fr: 'Bonjour' },
}
```

`id` is the stable identifier for each keyword, while `key` represents the
actual interface keyword. New keywords are currently created through the
dashboard, and duplicate keyword validation is not implemented.

The array's order **is** the display order — reordering just moves an
element in the array before it's persisted, so both pages always render in
the same order without a separate `order` field to keep in sync.

## Persistence

The full `keywords` array is stored as JSON in `localStorage` (key
`sibirani.translations.v1`) and updated whenever the dataset changes. On
startup, invalid or missing data falls back to the seed dataset instead of
breaking the application.

## Assumptions

- The initial dataset covers four languages — English, Persian, Arabic,
  and French — which satisfies the "at least three languages" requirement
  and gives enough room to demonstrate missing translations. More can be
  added by extending `data/languages.js` (see written answer #1).
- "Editing an existing translation" and "adding a translation for a
  language that was empty" are the same action (an inline text input) —
  there's no separate empty vs. filled UI state, matching the design.
- `id` is used as the stable identifier for each keyword, while `key`
  represents the actual interface keyword. New keywords are currently
  created through the dashboard, and duplicate keyword validation is not
  implemented.
- Layout follows the provided designs closely; spacing, colors, and the
  card-based public view were reproduced from the screenshots with small
  refinements for empty/missing states.

## Not implemented (optional features)

Per the priority list in the assignment, I focused on the core
requirements end-to-end (view, edit, add, reorder, persist, language
switch, responsiveness) and left the optional features out to keep the
implementation small and easy to review:

- Search/filtering, delete/rename, import/export, animations, keyboard-only
  reordering beyond dnd-kit's built-in keyboard sensor, and unit tests.
- Duplicate-keyword validation on add.

I kept these out intentionally to stay within the assignment scope and
time limit.

## Written answers

### 1. Why did you choose this data structure for keywords and translations, and how does it hold up when a new language is added?

I used this structure for each keyword:

```js
{
  id,
  key,
  translations: {
    en: "...",
    fa: "...",
    ar: "..."
  }
}
```

I chose it because the main operation in this application is working with
a keyword and its translation in a specific language. With this
structure, getting or updating a translation is simple. For example, I
can directly access `translations.fa` without having to search through
another array.

I also keep the keyword order in the `keywords` array itself. This makes
reordering simpler because the array order is also the display order. I
don't need to keep a separate `order` field and make sure it stays
synchronized with the array.

If a new language is added, the existing data does not need to be
migrated. I only need to add the new language to the list of supported
languages. Existing keywords will not have a translation for that
language, so the UI can show the empty state until a translation is
added.

Overall, I preferred this structure because it is simple, easy to work
with in React, and fits the requirements of this application without
adding unnecessary complexity.

### 2. How would you scale this application to thousands of keywords and many languages? What would become the first bottleneck?

The current approach is fine for the size of this assignment, but it
would not be ideal for a very large dataset.

The first issue I would expect is `localStorage` and the fact that the
whole dataset is serialized and written again after every change. If
there were thousands of keywords and many languages, this could make
editing feel slower, especially if the data is saved on every keystroke.

I would first avoid writing to storage on every keystroke, for example by
saving after the user finishes editing or by using a small debounce. For
a larger client-side dataset, I would also consider `IndexedDB` instead
of `localStorage`.

Rendering thousands of rows would be another problem. In that case, I
would use list virtualization so the browser only renders the rows that
are currently visible.

I would also look at the Context structure. Since Context updates can
cause many components to render again, I would split the state or use a
more selective state management approach if profiling showed that
re-renders were becoming a problem.

If this were a real production application with a large number of
keywords and languages, I would eventually move the main data to a
backend API and load it with pagination/search instead of keeping the
complete dataset in the browser.

For this assignment, I intentionally kept the solution simpler because
the requirements are based on `localStorage` and a relatively small
dataset.

## Design references

Built closely following the `Management Dashboard.png` and
`Public View Page.png` mockups from the assignment archive — layout,
colors, and the missing-translation highlight all match the provided
designs.

## UI/UX enhancements

Beyond the core requirements, I made a few UI and usability improvements:

- **Vazirmatn font.** Self-hosted through `@fontsource-variable/vazirmatn`
  for consistent Persian and English typography without relying on an
  external CDN.
- **Glass-style UI.** Added a lightweight glass/frosted visual treatment
  to the main surfaces while keeping the layout close to the provided
  designs.
- **Sib Irani branding.** Added the provided Sib Irani logo to the
  navigation header.
- **Responsive layout.** The dashboard and public view adapt to smaller
  screens using CSS Grid/Flexbox.
- **Localized empty states.** Missing translations use the active
  language's empty-state message instead of always displaying English
  text.
- **Accessibility.** Drag-and-drop uses `@dnd-kit` with pointer and
  keyboard sensors, and interactive elements have visible
  `:focus-visible` states.
- **Mobile testing.** Added a fallback for keyword IDs when
  `crypto.randomUUID()` is unavailable outside a secure context, and an
  Error Boundary to prevent unexpected errors from resulting in a blank
  screen.
- **Add Keyword action.** Kept the add-keyword action accessible while
  scrolling through a longer keyword list.
