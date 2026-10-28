# Sailwind Starter

A ready-to-use starter template for rapid prototyping of Appian SAIL-style interfaces using React and the [Sailwind component library](https://www.npmjs.com/package/@pglevy/sailwind).

Perfect for designers and developers who want to quickly mock up Appian interfaces and iterate with AI assistance!

## ✨ Features

- 🎨 **Pre-configured Sailwind Components** - All SAIL-style components ready to use
- 🚀 **Instant Setup** - Clone and run with a single command
- 🗺️ **Automatic Routing** - Just add files to `/src/pages/` and they're automatically routed
- 📋 **Table of Contents** - Built-in navigation for all your prototype pages
- 🎭 **Example Page** - A Kanban board built with lists, cards, and task checklists to learn from
- 💅 **Tailwind CSS v4** - Pre-configured and optimized
- 🤖 **LLM-Friendly** - Designed to work seamlessly with AI coding assistants

## 🚀 Quick Start

### 1. Download Template

[Download a copy](https://github.com/pglevy/sailwind-starter/archive/refs/heads/main.zip) of the template, extract the zip, and open in your preferred code editor.

(We don't recommend GitHub for private repos but if you're working in public, feel free to use the `Use this template` option to create a new GitHub repo based on this template.)

### 2. Install pnpm

This project uses [pnpm](https://pnpm.io/) as its package manager. If you don't have it yet, the easiest way to get started is with corepack (ships with Node.js 16.13+):

```bash
corepack enable
```

Alternatively, install pnpm directly:

```bash
# macOS with Homebrew
brew install pnpm

# or via npm
npm install -g pnpm
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Start Prototyping

Run this command to start the development server:

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see your prototype!

> [!Tip]
> Need some extra help getting set up? Ask your agent to use the `configure-environment` skill.

## 🪝 Agent Hooks

This project includes Kiro agent hooks (`.kiro/hooks/`) that automate common checks. All hooks are manually triggered from the Agent Hooks panel in Kiro IDE.

| Hook | What it does |
|------|-------------|
| **Verify Build** | Asks the agent to run `pnpm run build` and fix any errors before declaring work complete |
| **Check Color Palette** | Runs `scripts/check-color-palette.js` to warn about Tailwind color classes that aren't in the Sailwind palette (15 color families, steps 50–900) |
| **Check Sailwind Updates** | Checks if a newer version of `@pglevy/sailwind` is available and offers to update |

These hooks reduce the amount of guidance needed in AGENTS.md by handling checks programmatically instead of through written instructions.

## 📁 Project Structure

```
sailwind-starter/
├── src/
│   ├── db/              # Data layer (mock APIs, transition-ready)
│   │   ├── types.ts     # Shared type utilities
│   │   ├── users.ts     # Mock usernames for user-reference fields
│   │   ├── api-config.ts
│   │   ├── lists.ts     # Example entity modules (Kanban board)
│   │   ├── cards.ts
│   │   └── tasks.ts
│   ├── pages/           # Your prototype pages go here!
│   │   ├── home.tsx
│   │   ├── kanban-board.tsx
│   │   └── not-found.tsx
│   ├── App.tsx          # Routing configuration
│   ├── main.tsx
│   └── index.css        # Tailwind + Sailwind theme imports
├── scripts/             # Predev checks and steering sync (see below)
├── schemas/             # JSON schemas for contract validation
├── public               # Images referenced by path in data go here
├── package.json
├── README.md
└── AGENTS.md
```

## 📊 Data Layer Convention

All prototype data lives in `src/db/` as typed async functions. Pages import from `src/db/` — never inline data directly. This makes every prototype "transition-ready" for connecting to a real Appian backend.

Each entity gets its own file (e.g., `src/db/tasks.ts`) with:
- A TypeScript interface defining the data shape
- Seed data for prototyping
- Async CRUD functions (`getTasks()`, `createTask()`, etc.)

User-reference fields (like `assignee`, `createdBy`) store Appian usernames as plain strings.

### Appian App Generation

Three skills in `.kiro/skills/` enable going from prototype to Appian app:

1. **Extract Prototype Contract** — reads `src/db/` and produces an API contract JSON
2. **Generate Appian App** — takes the contract and produces an importable Appian package (record types + web APIs + DDL)
3. **Deploy to Appian** — deploys the package + DDL to an Appian environment via the Deployment REST API (inspect, import, poll for results)
4. **Connect to Appian** — rewrites `src/db/` to use real `fetch` calls against the generated web APIs

See the steering file at `.kiro/steering/data-layer.md` for the full convention.

## 🎯 Creating New Pages

### Step 1: Create a New Page File

Add a new file in `src/pages/`:

```typescript
// src/pages/my-prototype.tsx
import { HeadingField, CardLayout, TextField, ButtonWidget } from '@pglevy/sailwind'
import { Link } from 'wouter'

export default function MyPrototype() {
  return (
    <div className="space-y-6">
      <Link href="/" className="text-blue-600 hover:underline">← Back to Home</Link>

      <HeadingField text="My Prototype" size="LARGE" />

      <CardLayout>
        <TextField label="Name" placeholder="Enter your name" />
        <ButtonWidget label="Submit" style="PRIMARY" />
      </CardLayout>
    </div>
  )
}
```

### Step 2: Register the Route

Add your page to `src/App.tsx`:

```typescript
// Import your page
import MyPrototype from './pages/my-prototype'

// Add to the pages array
const pages = [
  { path: '/', title: 'Home', component: Home },
  { path: '/my-prototype', title: 'My Prototype', component: MyPrototype },
  // ... other pages
]
```

That's it! Your page is now accessible at `/my-prototype`.

## 🧩 Available Components

Sailwind provides the SAIL components you need. The full, current list lives in `.kiro/steering/sail-components.md`, with every prop in `sail-props.md` and every SAIL type in `sail-types.md`. These files are generated from the installed package each time you run `pnpm run dev`, so they always match your Sailwind version. You can also browse the [Storybook component reference](https://pglevy.github.io/sailwind/components/).

A quick tour of what's in the package:

- **Layout** - `BoxLayout`, `CardLayout`, `ApplicationHeader`, `SideNavAdmin`
- **Display** - `HeadingField`, `RichTextDisplayField`, `ImageField` (including built-in illustrations), `StampField`, `MessageBanner`, `TagField`, `ProgressBar`, `MilestoneField`
- **Input** - `TextField`, `ParagraphField`, `CheckboxField`, `RadioButtonField`, `DropdownField`, `MultipleDropdownField`, `ToggleField`, `SliderField`
- **Actions** - `ButtonWidget`, `ButtonArrayLayout`, `DialogField`, `TabsField`
- **Grids** - `ReadOnlyGrid`, `GridColumn`, `Paging`
- **AI & chat** - `ChatPanel`, `ChatInput`, `ChatUserMessage`, `ChatAssistantMessage`, `AgentSteps`, `TaskPlan`, `TaskProgress`

## 💡 Working with AI Assistants

This starter is optimized for AI-assisted development. Here are some example prompts:

### Creating a New Page
```
Create a new page called "vendor-registration" that includes:
- A form for vendor information (company name, contact, email)
- Address fields
- A checkbox for terms acceptance
- Submit and cancel buttons
```

### Modifying Existing Pages
```
Update the kanban-board page to show tasks in a table format instead of cards,
with columns for task name, assignee, due date, and priority
```

### Adding New Features
```
Add a search bar to the home page that filters the page list in the
table of contents as you type
```

## 🤖 Kiro-Specific Features

This starter includes special features for [Kiro IDE](https://kiro.dev) and [Kiro CLI](https://kiro.dev/cli) users:

### For Kiro CLI Users

**Pre-configured "sailor" Agent**
- Custom agent optimized for Sailwind prototyping
- Includes browser automation tools (Chrome DevTools & Playwright MCP servers)
- Pre-loaded with project context (AGENTS.md, README.md, GIT.md)
- Auto-approved commands for common tasks (`npm run build`, `npm run dev`, etc.)
- Located at `.kiro/agents/sailor.json`

To use the sailor agent:
```bash
kiro-cli --agent sailor
```

### For Kiro IDE Users

Skills live in `.kiro/skills/` and are invoked by telling Kiro what you want to do. No installation needed — they're already in the project.

| Skill | What it does |
|-------|-------------|
| **Configure Environment** | Checks for and installs Homebrew, nvm, Node.js, and pnpm, then gets the dev server running. Good for refreshing setup or "command not found" errors. |
| **Security Audit** | Scans the project for exposed secrets, suspicious packages, misconfigured security settings, and common mistakes. Good for periodic checkups or before making a repo public. |
| **Share Link** | Creates a temporary public URL to your local dev server using Cloudflare's free tunnel service — no deployment needed. |
| **Upgrade from Template** | Syncs your project with the latest scripts, hooks, and steering files from the template repo by fetching directly from GitHub. |
| **Extract Prototype Contract** | Reads `src/db/` and produces an `api-contract.json` describing the data model — the first step toward generating an Appian app. |
| **Generate Appian App** | Takes the API contract and produces an importable Appian package (record types, web APIs, DDL, and more). |
| **Deploy to Appian** | Deploys the generated package to an Appian environment via the Deployment REST API — inspect, import, and poll for results. |
| **Connect to Appian** | Rewrites `src/db/` to use real `fetch` calls against the generated Appian web APIs. Page components stay unchanged. |
| **Sailwind Migration** | Full migration for projects not yet on sailwind-starter conventions or old Sailwind versions. |

**Git Workflow Guidance**
- Designer-friendly git instructions in `.kiro/steering/git.md`
- Automatically included in context when working with git
- Helps with branching, commits, and pull requests

### For Both Kiro IDE & CLI

**Steering Files** (`.kiro/steering/`)
- `data-layer.md` - Data layer convention for `src/db/`
- `git.md` - Git workflow guidance for designers
- `publishing.md` - Sharing and publishing prototypes
- `sail-components.md`, `sail-props.md`, `sail-types.md` - Component names, props, and SAIL types, generated from the installed `@pglevy/sailwind` package

`AGENTS.md` at the project root holds the core component library rules. These files provide context to Kiro automatically, making it easier to work with the Sailwind component library and follow project conventions.

The three `sail-*.md` files are regenerated by `pnpm run dev` (via the `predev` script), so they follow whatever Sailwind version you have installed. After updating Sailwind, run `node scripts/check-sailwind-update.js` to refresh them without starting the dev server.

## 🖼️ Adding Images

Sailwind components take images as URL strings, so there are two places to put your own images. A rule of thumb: if you `import` it, it goes in `src/assets/`. If you type its path in a string, it goes in `public/`.

**Import from `src/assets/`** for images your code refers to directly, like a logo or an empty-state illustration. Vite resolves the path wherever the prototype is deployed, and the build fails if the file is missing:

```tsx
import logo from '../assets/logo.png'

<ImageField images={[{ source: logo, altText: 'Company logo' }]} size="MEDIUM" />
```

**Put in `public/`** for images named in mock data (like a `photoUrl` per user) or files that need a fixed URL:

```
public/
├── images/
│   ├── logo.png
│   └── photo.jpg
└── vite.svg
```

```tsx
{ name: 'Jane Doe', photoUrl: 'images/avatars/jane.png' }
```

Leave off the leading slash (`images/avatars/jane.png`, not `/images/avatars/jane.png`). Prototypes are often deployed in a subfolder, and a leading slash points to the root of the site instead. Files in `public/` aren't checked at build time, so a wrong path only shows up as a broken image.

Sailwind also ships built-in illustrations for empty states and similar spots:

```tsx
<ImageField images={[{ imageType: 'illustration' as const, illustration: 'NO_DATA' }]} />
```

See `IllustrationImage` in `.kiro/steering/sail-props.md` for the available names.

## 🎨 Styling

This template uses **Tailwind CSS v4** and is already configured to scan Sailwind components for classes.

Add custom styles using Tailwind utility classes:
```tsx
<div className="p-4 bg-blue-50 rounded-lg shadow">
  <HeadingField text="Custom Styled Card" />
</div>
```

See the full [SAIL-to-Tailwind mapping](https://github.com/pglevy/sailwind/blob/main/TAILWIND-SAIL-MAPPING.md) in the source Sailwind repo.

## 📦 What's Included

- **React 19** - Latest React with TypeScript
- **Vite** - Lightning-fast dev server
- **Tailwind CSS v4** - Utility-first styling
- **Wouter** - Lightweight routing
- **Sailwind** - Complete SAIL component library
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

## 🔧 Available Scripts

```bash
pnpm run dev           # Start development server (predev syncs steering files with the installed Sailwind version)
pnpm run build         # Build for production
pnpm run preview       # Preview production build
pnpm run lint          # Lint code
pnpm run check:colors  # Check for off-palette Tailwind color steps
pnpm run deploy:site   # Deploy to GitLab site (Appian internal)
```

## 📚 Documentation

- **Sailwind Components**: [GitHub](https://github.com/pglevy/sailwind)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **React**: [react.dev](https://react.dev)
- **Vite**: [vite.dev](https://vite.dev)

## 🤝 Contributing

This is a starter template - feel free to customize it for your needs!

If you have suggestions for improvements, please open an issue or PR on the [Sailwind Starter repository](https://github.com/pglevy/sailwind-starter).

## 📄 License

MIT License - feel free to use this for any project!

## 🎉 Happy Prototyping!

This template is designed to get you from idea to interactive prototype as quickly as possible. Just describe what you want to your AI assistant and start building!

---

**Made with 🩸,😅, and 😭 for rapid Appian prototyping**
