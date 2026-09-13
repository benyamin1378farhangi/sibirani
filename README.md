# Sib Irani – Translation Management Tool

An internal tool for managing interface keyword translations, built for the
Front-End Developer (React) technical assignment.

Two pages, one shared source of truth:

- **Management Dashboard** (`/`) — the team edits translations, adds new
  keywords, and reorders the list by dragging.
- **Public View** (`/view`) — end users read keywords and their
  translations and switch between languages.

## Stack

- React 18 + JavaScript (no TypeScript), scaffolded with Vite
- React Router for the two routes
- React Context (`TranslationsContext`) for shared state — no prop drilling
- `@dnd-kit` for accessible drag-and-drop reordering (pointer + keyboard)
- Plain CSS (no UI framework), responsive with CSS Grid/Flexbox, styled as
  an Apple-style "liquid glass" UI (see [UI/UX enhancements](#uiux-enhancements))
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

State, logic and presentation are kept separate: the context owns state and
mutations, pages compose components, and components only read from
`useTranslations()` and render.

## Data model

```js
// keywords: Array<{ id, key, translations }>
{
  id: 'seed-hello',
  key: 'hello',
  translations: { en: 'Hello', fa: 'سلام', ar: 'مرحبا', fr: 'Bonjour' },
}
```

The array's order **is** the display order — reordering just moves an
element in the array before it's persisted, so both pages always render in
the same order without a separate `order` field to keep in sync.

## Persistence

The full `keywords` array is written to `localStorage` (key
`sibirani.translations.v1`) on every change via a `useEffect` in the
provider. On load, `utils/storage.js` reads and `JSON.parse`s the entry
inside a `try/catch`; if the key is missing, not valid JSON, or not an
array, it silently falls back to the seed data instead of throwing.

## Assumptions

- The three pre-set languages plus one extra (English, Persian, Arabic,
  French) are enough to demonstrate "at least three languages" and an
  empty-translation state; more can be added by extending
  `data/languages.js` (see written answer #1).
- "Editing an existing translation" and "adding a translation for a
  language that was empty" are the same action (an inline text input) —
  there's no separate empty vs. filled UI state, matching the design.
- The keyword's canonical English text (`key`) doubles as its display
  label and its id-ish reference; new keywords are only created through
  the dashboard, so uniqueness isn't currently enforced (see below).
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

None of these affect the core requirements; happy to add any of them as a
follow-up.

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
colors, and the missing-translation highlight all match the designs.

## UI/UX enhancements

Beyond the base requirements, the interface was iterated on for a more
polished, brand-appropriate feel:

- **Vazirmatn font.** Self-hosted via `@fontsource-variable/vazirmatn`
  (a single variable-weight file covering the Latin and Arabic/Persian
  subsets, no external CDN at runtime) and set as the app-wide typeface —
  it reads well in both Persian and English, which matters since both
  scripts appear side by side throughout the UI.
- **Liquid glass UI.** Restyled the interface around an Apple-style
  "liquid glass" look: a soft, fixed mesh-gradient background sits behind
  every panel, and a shared `.glass` treatment
  (`backdrop-filter: blur() saturate()`, a translucent white fill, a thin
  light border, and a soft top highlight) is applied to the nav bar,
  dashboard panel, add-keyword form, and public-view cards so they read
  as frosted glass over the gradient rather than flat, opaque cards.
- **Sib Irani logo in the header.** Replaced the plain text brand label
  in the nav bar with the actual Sib Irani logo (`assets/logo-sib-irani.webp`),
  linked back to the dashboard.
- **Consistent border-radius scale.** Every rounded corner in the app now
  comes from exactly two tokens plus one deliberate exception:
  `--radius-control` (14px, for inputs and small buttons),
  `--radius-surface` (22px, for panels/cards/forms — sized so a control
  nested inside a surface reads as concentric rather than clashing), and
  `--radius-pill` (999px, reserved for elements meant to look like true
  capsules: nav bar, buttons, language select). Previously these radii
  were set ad hoc per component and didn't line up visually.
- **Fixed a focus-outline bug.** Clicking a nav link (e.g. switching from
  Dashboard to Public View) briefly showed the browser's default focus
  outline, which is a plain rectangle and doesn't respect `border-radius`
  — so it visibly poked out past the pill's rounded corners for a frame.
  Fixed by disabling the native outline on interactive glass elements
  (`outline: none` + `-webkit-tap-highlight-color: transparent`) and
  replacing it with a `box-shadow`-based `:focus-visible` ring, which
  *does* follow the element's own border-radius.
- **Localized empty-translation state.** The Public View previously
  always showed the English string "No translation yet" regardless of
  the active language. Each language in `data/languages.js` now carries
  its own `emptyStateText` (e.g. Persian shows "هنوز ترجمه نشده است",
  Arabic shows "لم تتم الترجمة بعد"), so a reader never sees English
  copy embedded in an otherwise fully localized page.
- **Fixed a white-screen crash on LAN/mobile testing.** `addKeyword` used
  `crypto.randomUUID()` for new ids. That API only exists in a *secure
  context* (HTTPS, or `localhost`) — opening the dev server from a phone
  via its LAN IP (`http://192.168.x.x:5173`) is plain HTTP, so
  `crypto.randomUUID` is `undefined` there. Calling it threw inside the
  submit handler, and with no error boundary in the tree the whole app
  unmounted to a blank white page. Fixed in two layers: `utils/id.js` now
  generates ids with `crypto.randomUUID()` when available and falls back
  to a timestamp+random string when it isn't, and `ErrorBoundary.jsx`
  wraps the app so any future unexpected render error shows a recoverable
  message instead of a blank screen (existing `localStorage` data is
  untouched either way).
- **Fixed action bar for "+ Add Keyword".** The button used to sit at the
  end of the keyword list, so on a long list it was invisible until you
  scrolled all the way down. It's now pinned to the bottom of the
  viewport (`position: fixed`, matching the content column's width) with
  a soft gradient fade behind it, while the keyword list itself scrolls
  normally underneath. Opening the form scrolls it smoothly into view
  from wherever the button was tapped.
