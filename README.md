# Sailwind Starter

A ready-to-use starter template for rapid prototyping of Appian SAIL-style interfaces using React and the [Sailwind component library](https://www.npmjs.com/package/@pglevy/sailwind).

Perfect for designers and developers who want to quickly mock up Appian interfaces and iterate with AI assistance!

## ✨ Features

- 🎨 **Pre-configured Sailwind Components** - All SAIL-style components ready to use
- 🚀 **Instant Setup** - Clone and run with a single command
- 🗺️ **Automatic Routing** - Just add files to `/src/pages/` and they're automatically routed
- 📋 **Table of Contents** - Built-in navigation for all your prototype pages
- 🎭 **Example Pages** - Three full example pages to learn from
- 💅 **Tailwind CSS v4** - Pre-configured and optimized
- 🤖 **LLM-Friendly** - Designed to work seamlessly with AI coding assistants

## 🚀 Quick Start

### 1. Use This Template

1. **Click "Use this template" button** on GitHub to create a new repository
    - *Make it private for internal work!*
2. **Download your new repository** (or clone if using git)
3. **Open folder in VS Code** (or preferred IDE)

### 2. Install pnpm

This project uses [pnpm](https://pnpm.io/) as its package manager. If you don't have it yet, the easiest way to get started is with corepack (ships with Node.js 16.13+):

```bash
corepack enable
```

That's it — corepack reads the `packageManager` field in `package.json` and sets up the right version of pnpm automatically.

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
> Need some extra help getting set up? If you're using Kiro IDE, there's a setup power built in, or you can grab the [pnpm-setup skill](https://github.com/pglevy/agent-skills) for step-by-step guidance. See the [options below](#for-kiro-ide-users) for more details.

## 🪝 Agent Hooks

This project includes Kiro agent hooks (`.kiro/hooks/`) that automate common checks. All hooks are manually triggered from the Agent Hooks panel in Kiro IDE.

| Hook | What it does |
|------|-------------|
| **Verify Build** | Asks the agent to run `pnpm run build` and fix any errors before declaring work complete |
| **Check Color Palette** | Runs `scripts/check-color-palette.js` to warn about Tailwind color classes using steps outside the approved set (50, 100, 200, 500, 700, 900) |
| **Check Sailwind Updates** | Checks if a newer version of `@pglevy/sailwind` is available and offers to update |

These hooks reduce the amount of guidance needed in AGENTS.md by handling checks programmatically instead of through written instructions.

## 📁 Project Structure

```
sailwind-starter/
├── src/
│   ├── db/              # Data layer (mock APIs, transition-ready)
│   │   ├── types.ts     # Shared type utilities
│   │   ├── users.ts     # Mock usernames for user-reference fields
│   │   ├── tasks.ts     # Example entity module
│   │   ├── applications.ts
│   │   └── documents.ts
│   ├── pages/           # Your prototype pages go here!
│   │   ├── home.tsx
│   │   ├── task-dashboard.tsx
│   │   ├── application-status.tsx
│   │   ├── document-review.tsx
│   │   └── not-found.tsx
│   ├── App.tsx          # Routing configuration
│   ├── main.tsx
│   └── index.css
├── schemas/             # JSON schemas for contract validation
├── public               # Images go here
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

Sailwind provides all the SAIL components you need:

### Layout
- `CardLayout` - Container with card styling
- `TableOfContents` - Automatic navigation

### Display
- `HeadingField` - Various heading sizes
- `RichTextDisplayField` - Rich text with formatting
- `ImageField` - Images with sizing options
- `StampField` - Status stamps
- `MessageBanner` - Info, success, warning, error messages
- `TagField` - Tags and labels
- `ProgressBar` - Progress indicators
- `MilestoneField` - Step-by-step progress

### Input
- `TextField` - Text input with labels
- `CheckboxField` - Checkboxes
- `RadioButtonField` - Radio buttons
- `DropdownField` - Dropdown select
- `MultipleDropdownField` - Multi-select dropdown
- `SwitchField` - Toggle switch
- `ToggleField` - Button toggle
- `SliderField` - Numeric slider

### Actions
- `ButtonWidget` - Buttons with various styles
- `ButtonArrayLayout` - Button groups
- `DialogField` - Modal dialogs
- `TabsField` - Tabbed content

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
Update the task-dashboard page to show tasks in a table format instead of cards,
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
- `AGENTS.md` - Component library reference and best practices
- `GIT.md` - Git workflow guidance for designers
- `SETUP.md` - Development environment setup instructions

These files provide context to Kiro automatically, making it easier to work with the Sailwind component library and follow project conventions.

## 🖼️ Adding Images

Place your images in the `/public` folder and reference them with relative paths:

```
public/
├── images/
│   ├── logo.png
│   └── photo.jpg
└── vite.svg
```

Reference in your components:
```tsx
<img src="images/logo.png" alt="Logo" />
<img src="images/photo.jpg" alt="Photo" />
```

**Why `/public`?**
- Simple and fast for prototyping
- No imports needed - just drop images and reference them
- Easy to swap images without touching code
- Predictable URLs for dynamic image names

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
pnpm run dev           # Start development server
pnpm run build         # Build for production
pnpm run preview       # Preview production build
pnpm run lint          # Lint code
pnpm run check:colors  # Check for off-palette Tailwind color steps
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
