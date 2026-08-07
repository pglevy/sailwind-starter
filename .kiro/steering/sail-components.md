---
inclusion: fileMatch
fileMatchPattern: "src/pages/**"
---

# Available Sailwind Components

Import these from `@pglevy/sailwind`. Do not look in `src/components/` for these — they come from the npm package. Use exact names (case-sensitive).

```tsx
import { ComponentName } from '@pglevy/sailwind'
```

**Layout:** `CardLayout`, `CollapsibleSection`, `ApplicationHeader`, `SideNavAdmin`

**Display:** `HeadingField`, `RichTextDisplayField`, `TextItem`, `Icon`, `ImageField`, `MessageBanner`, `TagField`, `TagItem`, `StampField`, `ProgressBar`, `MilestoneField`

**Input:** `TextField`, `DropdownField`, `MultipleDropdownField`, `CheckboxField`, `RadioButtonField`, `ToggleField`, `SliderField`

**Actions:** `ButtonWidget`, `ButtonArrayLayout`, `DialogField`, `TabsField`

**Utility:** `FieldLabel`, `FieldWrapper`

**Other:** `AgentSteps`, `ButtonToggle`, `ChatAssistantMessage`, `ChatConfirmation`, `ChatFeedback`, `ChatInput`, `ChatPanel`, `ChatUserMessage`, `FileCard`, `GridColumn`, `Paging`, `ParagraphField`, `ReadOnlyGrid`, `RecordView`, `SiteNav`, `TaskPlan`, `TaskProgress`

**Total: 45 components**

Common name mistakes to avoid:
- ❌ `Button` → ✅ `ButtonWidget`
- ❌ `Card` → ✅ `CardLayout`
- ❌ `Text` → ✅ `TextItem` or `RichTextDisplayField`
- ❌ `Heading` → ✅ `HeadingField`
- ❌ `Tabs` → ✅ `TabsField`
- ❌ `Tag` → ✅ `TagField`
- ❌ `<UserImage />` → ✅ `<ImageField style="AVATAR" images={[{ imageType: 'user' as const, ... }]} />`
