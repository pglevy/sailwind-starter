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

### 1. Clone or Use This Template

**Option A: Clone directly**
```bash
git clone https://github.com/pglevy/sailwind-starter.git my-prototype
cd my-prototype
```

**Option B: Use as GitHub template**
1. Click "Use this template" button on GitHub
2. Clone your new repository
3. `cd` into your project

### 2. Install Dependencies

```bash
npm install
```

That's it! Everything is pre-configured and ready to go.

### 3. Start Prototyping

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see your prototype!

## 📁 Project Structure

```
sailwind-starter/
├── src/
│   ├── pages/           # Your prototype pages go here!
│   │   ├── home.tsx
│   │   ├── task-dashboard.tsx
│   │   ├── application-status.tsx
│   │   ├── document-review.tsx
│   │   └── not-found.tsx
│   ├── App.tsx          # Routing configuration
│   ├── main.tsx
│   └── index.css
├── package.json
└── README.md
```

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

## 🖼️ Adding Images

Place your images in the `/public` folder and reference them with absolute paths:

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
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Lint code
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

**Made with ❤️ for rapid Appian prototyping**
