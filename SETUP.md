# Lloyd Davage Homepage — WebStorm Project Setup Guide

## Project Structure

```
lloyd-davage-site/
├── index.html          ← Main page (clean — no inline CSS or JS)
├── css/
│   └── style.css       ← All styles
├── js/
│   └── main.js         ← All JavaScript
├── images/
│   ├── LogoLDHalf.png
│   └── MyMugShot.png
├── .gitignore
└── SETUP.md            ← This file
```

---

## Step 1 — Open the Project in WebStorm

1. Launch **WebStorm**
2. Choose **Open** from the Welcome screen (or **File → Open**)
3. Browse to the `lloyd-davage-site` folder and click **Open**
4. WebStorm will detect it as a plain HTML project — no further configuration needed

---

## Step 2 — Enable Live Preview (Built-in Dev Server)

WebStorm has a built-in web server so you can preview the site without any extra tooling:

1. Open `index.html` in the editor
2. Hover over the top-right corner of the editor — browser icons appear
3. Click any browser icon (Chrome recommended) to open the live preview
4. The URL will be something like `http://localhost:63342/lloyd-davage-site/index.html`
5. The page auto-refreshes whenever you save a file (**Ctrl+S** / **Cmd+S**)

Alternatively, right-click `index.html` in the Project panel → **Open In → Browser**

---

## Step 3 — Configure File Watchers (Optional but Recommended)

WebStorm can watch your files and trigger actions on save. For a plain HTML/CSS/JS project no watcher is required, but if you later add Sass or TypeScript:

1. Go to **File → Settings** (Windows/Linux) or **WebStorm → Preferences** (macOS)
2. Navigate to **Tools → File Watchers**
3. Click **+** to add a watcher (e.g. SCSS → CSS)

---

## Step 4 — Enable Emmet & HTML Validation

These are on by default but worth confirming:

1. **File → Settings → Editor → Emmet** — ensure HTML and CSS are ticked
2. **File → Settings → Editor → Inspections** → search "HTML" — ensure inspections are enabled
3. **File → Settings → Editor → Inspections** → search "CSS" — ensure CSS validation is on

---

## Step 5 — Code Style Settings (Recommended)

To keep the code tidy:

1. **File → Settings → Editor → Code Style → HTML**
   - Indent: **4 spaces**
   - Wrap attributes: **Do not wrap**

2. **File → Settings → Editor → Code Style → CSS**
   - Indent: **4 spaces**

3. **File → Settings → Editor → Code Style → JavaScript**
   - Indent: **4 spaces**

You can auto-format any file at any time with **Ctrl+Alt+L** (Windows/Linux) or **Cmd+Option+L** (macOS).

---

## Step 6 — Set Up Git (Version Control)

1. Open the **Terminal** panel in WebStorm (**Alt+F12** / **Option+F12**)
2. Run the following commands:

```bash
git init
git add .
git commit -m "Initial commit — refactored site with separate CSS and JS"
```

3. To connect to a remote (e.g. GitHub):
   - Create a new empty repo on GitHub
   - Then run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/lloyd-davage-site.git
git branch -M main
git push -u origin main
```

4. WebStorm's built-in Git panel (**Git → Commit** or the Git icon in the toolbar) handles all future commits visually.

---

## Step 7 — Working with Claude in WebStorm

To use Claude (AI assistant) for help while editing:

**Option A — Claude.ai in the browser**
- Keep a Claude.ai tab open alongside WebStorm
- Copy/paste code sections you want help with
- Paste Claude's suggestions back into the editor

**Option B — JetBrains AI Assistant plugin (if available)**
1. **File → Settings → Plugins**
2. Search for **AI Assistant** or **GitHub Copilot**
3. Install and authenticate

**Option C — Paste files directly into Claude**
- Drag `style.css`, `main.js`, or `index.html` into a Claude chat
- Claude can read, edit, and return updated versions

---

## Day-to-Day Editing Workflow

| Task | How |
|---|---|
| Edit content | Open `index.html`, find the section, edit the HTML |
| Change colours/fonts | Open `css/style.css`, find the `:root` variables at the top |
| Add a new page section | Add a new `<div id="newpage" class="page">` in `index.html`, add a nav button in the sidebar, add `showPage('newpage', this)` to the button |
| Add a JS interaction | Edit `js/main.js` |
| Add a new image | Drop it into the `images/` folder, reference it as `images/filename.jpg` |
| Preview changes | Save the file — the browser auto-refreshes |
| Commit changes | Use WebStorm's Git panel or the terminal |

---

## Useful WebStorm Shortcuts

| Shortcut (Win/Linux) | Shortcut (Mac) | Action |
|---|---|---|
| Ctrl+S | Cmd+S | Save (triggers live reload) |
| Ctrl+Alt+L | Cmd+Option+L | Reformat code |
| Ctrl+F | Cmd+F | Find in current file |
| Ctrl+Shift+F | Cmd+Shift+F | Find in all project files |
| Ctrl+/ | Cmd+/ | Toggle line comment |
| Alt+F12 | Option+F12 | Open terminal |
| Shift+F10 | Ctrl+R | Run / open in browser |
| Ctrl+Click | Cmd+Click | Jump to CSS class definition |

---

## Deployment

When you're ready to publish updates to `davage.co.uk`:

1. **FTP/SFTP deployment**: **File → Settings → Build, Execution, Deployment → Deployment**
   - Add your hosting server credentials
   - Right-click any file → **Deployment → Upload to [server]**

2. **Manual**: Zip the project folder and upload via your hosting control panel

3. **Git-based hosting** (Netlify, Vercel, GitHub Pages):
   - Push to your repo — the host deploys automatically
