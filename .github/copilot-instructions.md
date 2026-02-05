# FunCloud AI Coding Instructions

## Project Overview
FunCloud is a single-page web application with three interactive sections: **Quotes**, **Kids Zone**, and **Party Planner**. Built with vanilla HTML/CSS/JavaScript (no frameworks), it demonstrates state management via localStorage and modular code organization using IIFE patterns.

## Architecture

### Module Organization (`frontend/app.js`)
Code is organized as **four independent IIFE modules** with no cross-module dependencies:
1. **navInit()** – Page switching via nav buttons (data-page attributes)
2. **quoteAppInit()** – Quotes section with localStorage favorites
3. **kidsZoneInit()** – Kids explorer with modals, animations, and sound controls
4. **partyPlannerInit()** – Party booking form with local state tracking

**Key Pattern:** Each module encapsulates DOM selection, state, and event listeners. Modules communicate only via shared DOM structure and localStorage.

### Data Flow
- **Local state**: Quotes (hardcoded), Party selections (client-side only)
- **Persistent storage**: `localStorage` with versioned keys (`funcloud_favs_v1`, `funcloud_booking_v1`)
- **No backend**: All data client-side; bookings are demo-only

### Content Structure

**Kids Zone items** defined in `ITEMS` object (lines 185-247 in app.js):
- Key format: `"zone:item"` (e.g., `"animals:lion"`)
- Properties: `title`, `animation` (gif/mp4 path), `sound` (mp3 path), `facts` (array)
- Animation files: `assets/animations/*.gif|mp4`
- Sound files: `assets/sounds/*.mp3`

**Missing assets** gracefully show placeholder text; don't require pre-built files to develop.

## Critical Developer Workflows

### Local Development
```bash
# No build required – open frontend/index.html directly in browser
# Or use a simple HTTP server to avoid CORS:
python3 -m http.server 8000
# Visit: http://localhost:8000/frontend/
```

### Adding Kids Zone Content
1. Add entry to `ITEMS` object (app.js, line 185+)
2. Create HTML tile in matching `kzPanel` with `data-zone` and `data-item` attributes
3. Provide animation file at `assets/animations/`; sound at `assets/sounds/` (optional)
4. Facts render as list items automatically

### Favorites & Bookings
- Edit localStorage **key** in code (e.g., `FAV_KEY`, `KEY`) to version on schema changes
- Test via browser DevTools → Application → Local Storage
- Clear with dedicated buttons in UI

## Code Conventions

### Selectors & Naming
- **DOM IDs:** camelCase, descriptive (e.g., `btnQuote`, `moodLabel`)
- **Classes for styling:** kebab-case (e.g., `.quote`, `.kz-item`)
- **Data attributes:** lowercase (e.g., `data-page`, `data-zone`, `data-item`)
- **Element references:** Store with `document.getElementById()` or `querySelectorAll()` at module init

### State Management
- **No global state object** – each module has its own scope
- **Favor simple data:** Arrays (favorites), objects (ITEMS registry)
- **Toggle patterns:** Use `classList.toggle()` with boolean conditions
- **Validation:** Check for null/empty before rendering (e.g., quote text check, favorites list)

### UI Patterns
- **Visibility:** `.hidden` class with `display: none !important` (style.css, line 13)
- **Active states:** `.isActive` class for nav, tabs, and choices
- **Status feedback:** Populate dedicated `.status` or `.partyStatus` divs with messages
- **Modal closure:** Escape key + click-outside handled (kidsZoneInit lines 269–270)

## Integration Points

### CSS Architecture
- **Utility classes:** `.hidden`, `.small`, `.outline`, `.danger`
- **Layout:** Flexbox grid system (`.grid`, `.choiceGrid`, `.partyGrid`)
- **Responsive:** `min()` for container width; flex-wrap for small screens
- **Color scheme:** Light theme with gradient background; indigo/amber accents

### Audio/Media Handling
- **Audio element:** Preload auto, play/pause methods with error handling (line 241)
- **Image/Video:** Conditional loading with error fallbacks; GIF vs MP4 auto-detection (lines 231–263)
- **Sound state:** Global `soundOn` toggle in kidsZoneInit

### Accessibility
- **ARIA labels:** `.page`, `.panel`, `.kzPanel` marked with `aria-label`
- **Semantic HTML:** `<button>`, `<select>`, native form inputs
- **Keyboard:** Modal closes on Escape; toggle buttons use `aria-pressed`
- **Screen readers:** Favorites list announces count; no empty alt text

## Common Tasks

### Adding a New Quote Category
1. Add category to `LOCAL_QUOTES` array (app.js, line 44+)
2. Add matching `<option>` to `#category` select (index.html, line 57+)
3. Filter logic handles "all" and category match automatically

### Adding a New Page
1. Create `<section class="page">` with matching ID (e.g., `id="page-newfeature"`)
2. Add button with `data-page="newfeature"`
3. navInit() auto-wires visibility via classList toggle

### Testing Storage
```javascript
// Browser console
localStorage.getItem("funcloud_favs_v1") // View favorites
localStorage.removeItem("funcloud_favs_v1") // Clear
localStorage.clear() // Clear all
```

## Common Pitfalls
- **Missing null checks:** Always validate element exists before adding listeners
- **Hardcoded paths:** Use relative paths for assets (e.g., `assets/animations/lion.gif`)
- **localStorage errors:** Wrap in try-catch; some contexts (private browsing) throw on access
- **Event delegation:** Use specific selectors (`.kzItem`); avoid bubbling assumptions
- **Animation fallbacks:** Always provide placeholder text if asset missing

## Files at a Glance
- [frontend/index.html](frontend/index.html) – Structure & semantic markup
- [frontend/app.js](frontend/app.js) – All interactivity (466 lines, 4 IIFEs)
- [frontend/style.css](frontend/style.css) – Responsive design & accessibility-aware styling
- [frontend/assets/animals/](frontend/assets/animals/), [sounds/](frontend/assets/sounds/) – Media (GIFs, MP3s)
