---
inclusion: fileMatch
fileMatchPattern: "src/pages/**"
---

# Sailwind Component Props Reference

All props for every Sailwind component, parsed from the installed package. Use exact prop names and values — do not guess.

**47 components** | All prop values must be UPPERCASE where the type is a SAIL enum.

## Common Props (omitted from tables below)

Most components accept these optional props. They are not repeated in each table:

| Prop | Type | Description |
|------|------|-------------|
| `className` | `string` | Additional Tailwind classes for prototype-specific styling (not part of SAIL API) |
| `showWhen` | `boolean` | Controls component visibility |
| `marginAbove` | `SAILMarginSize` | Space added above component |
| `marginBelow` | `SAILMarginSize` | Space added below component |
| `accessibilityText` | `string` | Additional text for screen readers |
| `labelPosition` | `SAILLabelPosition` | Where the label appears (ABOVE / ADJACENT / COLLAPSED / JUSTIFIED) |
| `helpTooltip` | `string` | Displays a help icon with tooltip text |
| `instructions` | `string` | Supplemental text about this field |
| `validationGroup` | `string` | Validation group name (no spaces) |
| `requiredMessage` | `string` | Custom message when required and not provided |

### AgentSteps

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `steps` | `AgentStep[]` | ✓ | Array of steps to display |
| `size` | `SMALL / STANDARD / LARGE` |  | Size of step text: SMALL (12px), STANDARD (14px), LARGE (18px) |

### ApplicationHeader

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `name` | `string` |  | Name of the application or object |
| `userInitials` | `string` |  | User initials to display in avatar |
| `showDesignerControls` | `boolean` |  | Show interface designer controls |
| `objectType` | `'app' / 'interface' / 'record-type' / 'expression-rule'` |  | Type of object being displayed |
| `iconSrc` | `string` |  | Path to custom icon image |
| `previewEnabled` | `boolean` |  | Preview mode enabled |
| `showStoriesView` | `boolean` |  | Stories view enabled |
| `onPreviewToggle` | `(enabled: boolean) => void` |  | Callback when preview toggle changes |
| `onStoryToggle` | `function` |  | Callback when stories toggle changes |
| `onBackClick` | `function` |  | Callback when back button clicked |
| `appianLogoSrc` | `string` |  | Path to Appian logo image |
| `backgroundColor` | `string` |  | Background color for the header (hex). Foreground colors auto-swap for contrast. |
| `additionalButtons` | `Array(object)` |  | Additional buttons to display before the right-side controls |

### ButtonArrayLayout

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `buttons` | `ButtonWidgetProps[]` | ✓ | Array of button configurations |
| `align` | `SAILAlign` |  | Determines alignment of buttons |

### ButtonToggle

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `text` | `string` |  | Text to display on the toggle button |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `disabled` | `boolean` |  | Determines if the field should display as grayed out |
| `value` | `boolean` |  | Current pressed state (true = pressed, false = unpressed) |
| `validations` | `string[]` |  | Validation errors to display below the field |
| `saveInto` | `(value: boolean) => void` |  | Callback when the user toggles the button |
| `onChange` | `(value: boolean) => void` |  | Callback when the user toggles the button (React-style alias for saveInto) |
| `size` | `SAILSize` |  | Size of the toggle button |
| `color` | `ACCENT / POSITIVE / NEGATIVE / SECONDARY / STANDARD / SAILColorInput` |  | Color when toggle is pressed (hex or semantic) |
| `style` | `SOLID / OUTLINE / GHOST` |  | Determines the button's appearance |
| `icon` | `string` |  | Icon to display in the button |
| `iconPosition` | `START / END` |  | Position of icon relative to text |

### ButtonWidget

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display on the button |
| `style` | `SOLID / OUTLINE / GHOST / LINK` |  | Determines the button's appearance |
| `color` | `SAILColorInput` |  | Enhancement to SAIL |
| `size` | `SAILSize` |  | Determines size of the button |
| `width` | `MINIMIZE / FILL` |  | Determines button width |
| `disabled` | `boolean` |  | Prevents user from clicking the button |
| `submit` | `boolean` |  | Whether this button submits a form |
| `validate` | `boolean` |  | Determines whether button performs validation |
| `confirmMessage` | `string` |  | Text for confirmation dialog |
| `confirmHeader` | `string` |  | Text for confirmation dialog header |
| `confirmButtonLabel` | `string` |  | Text for confirmation button |
| `cancelButtonLabel` | `string` |  | Text for cancel button |
| `icon` | `string` |  | Icon to display |
| `iconPosition` | `START / END` |  | Position of icon |
| `tooltip` | `string` |  | Tooltip text on hover |
| `loadingIndicator` | `boolean` |  | Loading indicator on press |
| `value` | `any` |  | Value associated with this button |
| `saveInto` | `function` |  | Click handler (maps to saveInto in SAIL) |
| `onClick` | `function` |  | Click handler (React-style alias for saveInto) |

### CardLayout

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `children` | `ReactNode` | ✓ | Content to display inside the card |
| `height` | `AUTO / SHORT / MEDIUM / TALL / EXTRA_TALL` |  | Determines the height of the card |
| `style` | `NONE / TRANSPARENT / STANDARD / ACCENT / SUCCESS / WARN / ERROR / INFO / CHARCOAL_SCHEME / NAVY_SCHEME / PLUM_SCHEME / string` |  | Determines the card background color. Valid values: Any hex color (including transparency with 8 digits), or semantic values |
| `shape` | `SAILShape` |  | Determines the border radius |
| `padding` | `SAILPadding` |  | Determines the padding inside the card |
| `showBorder` | `boolean` |  | Whether to show card border |
| `showShadow` | `boolean` |  | Whether to show card shadow |
| `borderColor` | `SAILColorInput` |  | Determines the border color. Valid values: Any hex color (including transparency), or "STANDARD" (default), "ACCENT", "POSITIVE", "WARN", "NEGATIVE" |
| `decorativeBarPosition` | `TOP / START / NONE` |  | Position of decorative bar |
| `decorativeBarColor` | `SAILColorInput` |  | Color of decorative bar (hex or semantic) |

### ChatAssistantMessage

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `message` | `string` | ✓ |  |

### ChatConfirmation

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `message` | `string` | ✓ | Confirmation message to display |
| `primaryAction` | `ChatConfirmationAction` | ✓ | Primary action button |
| `secondaryAction` | `ChatConfirmationAction` |  | Optional secondary action button |
| `completed` | `boolean` |  | Whether the confirmation has been acted on |

### ChatFeedback

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `style` | `'DEFAULT' / 'AGENT_EVALUATION'` |  | Color scheme style - "DEFAULT": Blue icon when selected, no background - "AGENT_EVALUATION": Thumbs up uses green, thumbs down uses red with backgrounds / |
| `showDetailsDialog` | `boolean` |  | Whether clicking thumbs up/down should open a dialog for detailed feedback |
| `showFeedbackOptions` | `boolean` |  | Whether to show selectable options in the dialog |
| `feedbackOptions` | `FeedbackOptions` |  | Selectable options for categorizing feedback |
| `dialogConfig` | `{` |  | Custom dialog configuration |
| `onFeedbackSubmit` | `(details: FeedbackDetails) => void` |  | Callback when feedback is submitted |

### ChatInput

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `placeholder` | `string` |  | Placeholder text for the input |
| `onSubmit` | `(message: string) => void` |  | Callback when message is submitted |
| `disabled` | `boolean` |  | Whether the input is disabled |
| `value` | `string` |  | Value of the input (controlled) |
| `saveInto` | `(value: string) => void` |  | Callback when value changes (controlled) |
| `showUpload` | `boolean` |  | Whether to show the upload/attach button |

### ChatPanel

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `title` | `string` |  | Title displayed in the header |
| `headerActions` | `ChatPanelHeaderAction[]` |  | Action buttons displayed in the header |
| `children` | `ReactNode` | ✓ | Content to display in the scrollable area |
| `footer` | `ReactNode` |  | Content to display in the footer (typically ChatInput) |
| `height` | `SAILGridHeight` |  | Height of the panel |

### ChatUserMessage

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `message` | `string` | ✓ |  |

### CheckboxField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `disabled` | `boolean` |  | Determines if the field should display as grayed out |
| `choiceLabels` | `any[]` | ✓ | Array of options for the user to select |
| `choiceValues` | `any[]` | ✓ | Array of values associated with the corresponding choices |
| `value` | `any[]` |  | Values of choices to display as selected |
| `validations` | `string[]` |  | Validation errors to display below the field |
| `saveInto` | `(value: any[]) => void` |  | Callback when the user changes the selections |
| `onChange` | `(value: any[]) => void` |  | Callback when the user changes the selections (React-style alias for saveInto) |
| `align` | `SAILAlignLegacy` |  | Determines alignment of choice labels. Use with Grid Layout |
| `choiceLayout` | `STACKED / COMPACT` |  | Determines the layout of choices |
| `choiceStyle` | `STANDARD / CARDS` |  | Determines how choices are displayed |
| `spacing` | `STANDARD / MORE / EVEN_MORE` |  | Determines space between options |
| `data` | `any` |  | Data source (record type) - not implemented in prototype |
| `sort` | `any[]` |  | Sort configurations - not implemented in prototype |
| `choicePosition` | `START / END` |  | Determines whether checkboxes appear on left or right |

### DialogField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `open` | `boolean` |  | Whether the dialog is open |
| `onOpenChange` | `(open: boolean) => void` |  | Callback when dialog open state changes |
| `trigger` | `ReactNode` |  | Element that triggers the dialog (usually a button) |
| `title` | `string` |  | Dialog title text |
| `description` | `string` |  | Dialog description text |
| `children` | `ReactNode` | ✓ | Main content of the dialog |
| `width` | `DialogWidth` |  | Width of the dialog |
| `height` | `DialogHeight` |  | Height of the dialog |
| `showCloseButton` | `boolean` |  | Whether to show the close button |
| `closeOnOutsideClick` | `boolean` |  | Whether clicking outside closes the dialog |
| `closeOnEscape` | `boolean` |  | Whether pressing escape closes the dialog |
| `onClose` | `function` |  | Callback when dialog is closed |

### DocumentImage

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `document` | `string` | ✓ | The image file path (relative to public directory) |
| `altText` | `string` |  | Alternate text for accessibility and screen readers |
| `caption` | `string` |  | Optional caption text for mouseover and slideshow mode |
| `link` | `function` |  | Link behavior when image is clicked |

### DropdownField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `disabled` | `boolean` |  | Determines if the field should display as grayed out |
| `choiceLabels` | `any[]` | ✓ | Array of options for the user to select |
| `choiceValues` | `any[]` | ✓ | Array of values associated with the corresponding choices |
| `placeholder` | `string` |  | Text to display when nothing is selected and value is null |
| `value` | `any` |  | Value of the choice to display as selected |
| `validations` | `string[]` |  | Validation errors to display below the field |
| `saveInto` | `(value: any) => void` |  | Callback when the user changes the selection |
| `onChange` | `(value: any) => void` |  | Callback when the user changes the selection (React-style alias for saveInto) |
| `searchDisplay` | `AUTO / ON / OFF` |  | Determines when a search box displays above options |
| `data` | `any` |  | Data source (record type) - not implemented in prototype |
| `sort` | `any[]` |  | Sort configurations - not implemented in prototype |

### FieldLabel

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | The label text to display |
| `required` | `boolean` |  | Whether the field is required (shows asterisk) |
| `htmlFor` | `string` |  | HTML for attribute to associate label with input |

### FieldWrapper

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | The label text to display |
| `required` | `boolean` |  | Whether the field is required (shows asterisk) |
| `inputId` | `string` | ✓ | HTML ID for the input element (for label association) |
| `children` | `ReactNode` | ✓ | The input/control element to render |
| `footer` | `ReactNode` |  | Optional additional content below instructions (validation errors, etc.) |

### FileCard

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `fileName` | `string` | ✓ | The file name to display |
| `fileSize` | `number` | ✓ | The file size in bytes |
| `showRemove` | `boolean` |  | Whether to show the remove button |
| `onRemove` | `function` |  | Callback when the remove button is clicked |
| `fileType` | `string` |  | Optional file type override (inferred from fileName if not provided) |
| `maxWidth` | `string` |  | Maximum width of the component (CSS value) |

### GridColumn

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the column header |
| `sortField` | `string` |  | Field name used for sorting when this column header is clicked |
| `value` | `string / ((row: any, index: number) => ReactNode)` |  | Display value for each cell. Can be: - A string field name to look up on each row object - A function (row: any, index: number) => React.ReactNode / |
| `align` | `SAILAlign` |  | Alignment for header and cell content |
| `width` | `SAILGridColumnWidth` |  | Column width |
| `backgroundColor` | `SAILColorInput / ((row: any) => string)` |  | Background color for cells — hex color or semantic name |

### HeadingField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `text` | `string` | ✓ | Text to display in the header |
| `size` | `EXTRA_SMALL / SMALL / MEDIUM / MEDIUM_PLUS / LARGE / LARGE_PLUS` |  | Determines the text size |
| `headingTag` | `H1 / H2 / H3 / H4 / H5 / H6` |  | Determines the heading tag for screen readers |
| `color` | `SAILColorInput` |  | Determines the label color - hex color, semantic color, or palette token (e.g. TEAL_700) |
| `fontWeight` | `LIGHT / REGULAR / SEMI_BOLD / BOLD` |  | Determines the thickness of the text |
| `link` | `function` |  | Link to apply to the text (simplified - accepts onClick handler) |
| `align` | `SAILAlign` |  | Determines alignment of the text |
| `preventWrapping` | `boolean` |  | Prevents wrapping to multiple lines when true |

### Icon

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `icon` | `string` | ✓ | The key of the icon to display |
| `altText` | `string` |  | Alternative text for accessibility |
| `caption` | `string` |  | Text to display on mouseover |
| `size` | `SAILSizeExtended` |  | Icon size |
| `color` | `SAILColorInput` |  | Icon color - semantic color, palette token (e.g. TEAL_700), or hex value |
| `link` | `function` |  | Link behavior when icon is clicked |
| `linkStyle` | `INLINE / STANDALONE` |  | How the link is underlined |

### ImageField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `images` | `DocumentImageProps / UserImageProps / WebImageProps[]` | ✓ | Array of images to display (supports both document and user images) |
| `size` | `ICON / ICON_PLUS / TINY / EXTRA_SMALL / SMALL / SMALL_PLUS / MEDIUM / MEDIUM_PLUS / LARGE / LARGE_PLUS / EXTRA_LARGE / FIT / GALLERY` |  | Determines how the images are sized |
| `isThumbnail` | `boolean` |  | Determines whether images can be viewed larger when clicked |
| `style` | `STANDARD / AVATAR` |  | Determines how the images are rendered |
| `shape` | `SAILShape` |  | Determines the border radius of images. Ignored when style is "AVATAR" (always circular). |
| `align` | `SAILAlign` |  | Determines alignment of the images |

### MessageBanner

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `primaryText` | `string` |  | Text to display on the first line inside the banner |
| `secondaryText` | `string` |  | Text to display beneath the primary text inside the banner |
| `backgroundColor` | `BackgroundColor` |  | Background color - semantic values or hex color (with optional transparency) |
| `highlightColor` | `HighlightColor` |  | Color of the decorative bar and icon - semantic values or hex color |
| `icon` | `info / success / warning / error` |  | Icon to display before the primary text (decorative only) |
| `showDecorativeBar` | `boolean` |  | Whether to show the decorative bar |
| `shape` | `SAILShape` |  | Banner shape |
| `announceBehavior` | `AnnounceBehavior` |  | Screen reader behavior for announcing banner text |
| `buttons` | `ButtonWidgetProps[]` |  | Optional buttons to display to the right of the content |
| `buttonsAlign` | `SAILAlign` |  | Alignment of the optional buttons |
| `showCloseButton` | `boolean` |  | Whether to show a close button in the upper right |
| `onClose` | `function` |  | Callback when the close button is clicked |

### MilestoneField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `steps` | `string[]` | ✓ | Array of labels describing the sequence of steps |
| `links` | `any[]` |  | Array of links to apply to the steps |
| `active` | `number / null` |  | Index of the current step. When null, all steps are future. When -1, all steps are completed |
| `orientation` | `HORIZONTAL / VERTICAL` |  | Determines the layout of the milestone steps |
| `color` | `ACCENT / POSITIVE / NEGATIVE / WARN / SAILColorInput` |  | Determines the fill color |
| `stepStyle` | `LINE / CHEVRON / DOT` |  | Determines the style of the milestone steps |

### MultipleDropdownField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `disabled` | `boolean` |  | Determines if the field should display as grayed out |
| `placeholder` | `string` |  | Text to display in the field when it is empty |
| `choiceLabels` | `any[]` | ✓ | Array of options for the user to select |
| `choiceValues` | `any[]` | ✓ | Array of values associated with the corresponding choices |
| `value` | `any[]` |  | Values of choices to display as selected |
| `validations` | `string[]` |  | Validation errors to display below the field |
| `saveInto` | `(value: any[] / null) => void` |  | Callback when the user changes the selections |
| `onChange` | `(value: any[] / null) => void` |  | Callback when the user changes the selections (React-style alias for saveInto) |
| `searchDisplay` | `AUTO / ON / OFF` |  | Determines when a search box displays above options |
| `data` | `any` |  | Data source (record type) - not implemented in prototype |
| `sort` | `any[]` |  | Sort configurations - not implemented in prototype |

### Paging

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `totalCount` | `number` | ✓ | Total number of items |
| `pageSize` | `number` | ✓ | Number of items per page |
| `currentPage` | `number` | ✓ | Current page number (1-based) |
| `onPageChange` | `(page: number) => void` | ✓ | Callback when page changes |
| `pagingControls` | `'STANDARD' / 'ROW_COUNT'` |  | Determines if the paging includes the total row count. "STANDARD" hides total count; "ROW_COUNT" shows total count and first/last controls. |

### ParagraphField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `readOnly` | `boolean` |  | Determines if the field should display as not editable |
| `disabled` | `boolean` |  | Determines if the field should display as potentially editable but grayed out |
| `value` | `string` |  | Text to display in the paragraph field |
| `validations` | `string[]` |  | Validation errors to display below the field when the value is not null |
| `saveInto` | `(value: string) => void` |  | Callback when the user changes the text |
| `onChange` | `(value: string) => void` |  | Callback when the user changes the text (React-style alias for saveInto) |
| `refreshAfter` | `KEYPRESS / UNFOCUS` |  | Determines when the interface is refreshed with the saved value |
| `placeholder` | `string` |  | Text to display in the field when it is empty |
| `characterLimit` | `number` |  | Determines the maximum number of characters |
| `showCharacterCount` | `boolean` |  | Determines if the character count displays on the field |
| `height` | `SHORT / MEDIUM / TALL / EXTRA_TALL` |  | Determines the height of the paragraph field |
| `width` | `NARROW / MEDIUM / FULL` |  | Determines the width of the paragraph field |
| `linkify` | `boolean` |  | Determines if URLs in read-only mode are automatically converted to links |
| `borderless` | `boolean` |  | Removes border and background for embedding inside custom containers |
| `onKeyDown` | `(e: React.KeyboardEvent(HTMLTextAreaElement)) => void` |  | Keyboard event handler passed through to the textarea |

### ProgressBar

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `percentage` | `number` | ✓ | Number to display between 0 and 100 |
| `color` | `ProgressBarColor` |  | Progress bar color - semantic values or hex color |
| `style` | `ProgressBarStyle` |  | Thickness of the progress bar |
| `showPercentage` | `boolean` |  | Whether to display the percentage text |

### RadioButtonField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `disabled` | `boolean` |  | Determines if the field should display as grayed out |
| `choiceLabels` | `any[]` | ✓ | Array of options for the user to select |
| `choiceValues` | `any[]` | ✓ | Array of values associated with the corresponding choices |
| `value` | `any` |  | Value of choice to display as selected |
| `validations` | `string[]` |  | Validation errors to display below the field |
| `saveInto` | `(value: any) => void` |  | Callback when the user changes the selection |
| `onChange` | `(value: any) => void` |  | Callback when the user changes the selection (React-style alias for saveInto) |
| `choiceLayout` | `STACKED / COMPACT` |  | Determines the layout of choices |
| `choiceStyle` | `STANDARD / CARDS` |  | Determines how choices are displayed |
| `spacing` | `STANDARD / MORE / EVEN_MORE` |  | Determines space between options |
| `data` | `any` |  | Data source (record type) - not implemented in prototype |
| `sort` | `any[]` |  | Sort configurations - not implemented in prototype |
| `choicePosition` | `START / END` |  | Determines whether radio buttons appear on left or right |

### ReadOnlyGrid

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the grid label |
| `emptyGridMessage` | `string` |  | Text to display when no data is available |
| `data` | `Record[]` |  | The data array to display |
| `children` | `ReactNode` |  | GridColumn children defining the columns |
| `pageSize` | `number` |  | Maximum rows per page. Default: 10 |
| `initialSorts` | `SortInfo[]` |  | Initial sort configurations |
| `selectable` | `boolean` |  | Whether rows are selectable |
| `selectionStyle` | `CHECKBOX / ROW_HIGHLIGHT / CHECKBOX_SUBTLE_HIGHLIGHT / SUBTLE_HIGHLIGHT` |  | Selection visual style |
| `selectionValue` | `(string / number)[]` |  | Currently selected row identifiers |
| `selectionSaveInto` | `(selectedIds: (string / number)[]) => void` |  | Callback when selection changes |
| `validations` | `string[]` |  | Validation messages to display below the grid |
| `spacing` | `STANDARD / DENSE` |  | Cell spacing |
| `height` | `SAILGridHeight` |  | Grid height |
| `borderStyle` | `STANDARD / LIGHT` |  | Border style |
| `shadeAlternateRows` | `boolean` |  | Whether to shade alternate rows |
| `rowHeader` | `number` |  | Index of column to use as row header for accessibility |
| `pagingControls` | `STANDARD / ROW_COUNT` |  | Determines if the paging includes the total row count. "STANDARD" hides total count for performance; "ROW_COUNT" shows total count and first/last controls. |

### RecordView

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `displayName` | `string` |  | Site/solution display name |
| `pages` | `SiteNavPage[]` | ✓ | Site pages for the left nav |
| `collapsed` | `boolean` |  | Controlled collapsed state |
| `onCollapseToggle` | `(collapsed: boolean) => void` |  | Collapse toggle callback |
| `userName` | `string` |  | User full name |
| `appianLogoSrc` | `string` |  | Appian logo path |
| `highlightColor` | `SAILSemanticColor / string` |  | Highlight color for selected nav item (passed to SiteNav) |
| `recordTitle` | `string` | ✓ | Record title (e.g. "REC-001 \| Sample Record") |
| `recordActions` | `RecordAction[]` |  | Record action buttons shown in the record header. First 3 are shown as buttons; extras appear in an overflow dropdown. |
| `views` | `RecordViewTab[]` |  | Record view tabs |
| `selectedViewIndex` | `number` |  | Index of the currently selected view (controlled). When provided, overrides isSelected on individual tabs. |
| `onViewChange` | `(index: number) => void` |  | Callback when a view tab is clicked. Receives the index of the clicked tab. |
| `children` | `ReactNode` |  | Content to render inside the active view area. This is the slot UXDs fill in. |

### RichTextDisplayField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `align` | `SAILAlignLegacy` |  | Alignment of the text value |
| `value` | `ReactNode[]` |  | Array of rich text to display |
| `preventWrapping` | `boolean` |  | Prevents wrapping to multiple lines |
| `tooltip` | `string` |  | Tooltip text on mouseover |

### SideNavAdmin

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `sections` | `NavSection[]` |  | Navigation sections with headings and items |
| `activeItem` | `string` |  | Label of the currently active/selected item |
| `onItemClick` | `(label: string) => void` |  | Callback when a nav item is clicked |

### SiteNav

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `displayName` | `string` |  | Site/solution display name (maps to NavigationLayout.displayName) |
| `pages` | `SiteNavPage[]` | ✓ | Array of site pages (maps to NavigationLayout.tabs / NavigationNode[]) |
| `collapsed` | `boolean` |  | Controlled collapsed state |
| `onCollapseToggle` | `(collapsed: boolean) => void` |  | Callback when collapse toggle is clicked |
| `showNavigation` | `boolean` |  | Whether to show the navigation (maps to NavigationLayout.showNavigation) |
| `userName` | `string` |  | User full name — initials are derived automatically |
| `appianLogoSrc` | `string` |  | Path to Appian logo image |
| `highlightColor` | `SAILSemanticColor / string` |  | Background color for the selected/highlighted page. Accepts hex or semantic color. Default: "POSITIVE" |

### SliderField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `disabled` | `boolean` |  | Determines if the field should display as grayed out |
| `value` | `number / number[]` |  | Current value(s) - single number for single slider, array for range |
| `min` | `number` |  | Minimum value |
| `max` | `number` |  | Maximum value |
| `step` | `number` |  | Step increment |
| `validations` | `string[]` |  | Validation errors to display below the field |
| `saveInto` | `(value: number / number[]) => void` |  | Callback when the user changes the slider value |
| `onChange` | `(value: number / number[]) => void` |  | Callback when the user changes the slider value (React-style alias for saveInto) |
| `size` | `SAILSize` |  | Size of the slider |
| `color` | `ACCENT / POSITIVE / NEGATIVE / SECONDARY / SAILColorInput` |  | Color of the slider track and thumb (hex or semantic) |
| `orientation` | `HORIZONTAL / VERTICAL` |  | Orientation of the slider |
| `showValue` | `boolean` |  | Show current value(s) as text |
| `formatValue` | `(value: number) => string` |  | Custom formatter for displayed values |

### StampField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `icon` | `string` |  | Icon to display inside the stamp |
| `text` | `string` |  | Text to display within the stamp |
| `backgroundColor` | `SAILColorInput / TRANSPARENT` |  | Determines the background color |
| `contentColor` | `SAILColorInput` |  | Determines the icon color |
| `size` | `TINY / SMALL / MEDIUM / LARGE` |  | Determines the size of the stamp |
| `align` | `SAILAlign` |  | Determines alignment of the stamp |
| `tooltip` | `string` |  | Text to display on mouseover (web) or tap (mobile) |
| `link` | `any` |  | Link to apply to the stamp |
| `shape` | `SAILShape` |  | Determines the stamp shape |

### TabsField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `tabs` | `TabItem[]` | ✓ | Array of tab configurations |
| `value` | `string` |  | Currently active tab value (controlled) |
| `defaultValue` | `string` |  | Default active tab value (uncontrolled) |
| `onValueChange` | `(value: string) => void` |  | Callback when active tab changes |
| `variant` | `TabsVariant` |  | Visual variant for tab styling |
| `orientation` | `HORIZONTAL / VERTICAL` |  | Orientation of the tabs (only applies to UNDERLINE variant) |
| `align` | `SAILAlign` |  | Alignment of tab labels in vertical orientation |
| `size` | `SAILSize` |  | Size of the tab triggers |
| `density` | `TabsDensity` |  | Spacing density for tab triggers |
| `loop` | `boolean` |  | Whether tabs should loop when navigating with keyboard |
| `color` | `ACCENT / POSITIVE / NEGATIVE / SECONDARY / SAILColorInput` |  | Color scheme for active tabs (hex or semantic) |
| `activationMode` | `AUTOMATIC / MANUAL` |  | Activation mode - whether tabs activate on focus or click |
| `navigationOnly` | `boolean` |  | Whether to suppress rendering of the content panel (navigation-only mode) |
| `contentsPadding` | `SAILMarginSize` |  | Determines the space between the tab edges and its contents (default: STANDARD) |
| `fullWidthSeparator` | `boolean` |  | Whether the separator line extends to the full width of the parent container |

### TagField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `tags` | `TagItemProps[]` | ✓ | Array of tag items to display |
| `label` | `string` |  | Text to display as the field label |
| `align` | `SAILAlign` |  | Determines alignment of tags |
| `size` | `Extract(SAILSize, SMALL / STANDARD)` |  | Size of the tags |

### TagItem

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `text` | `string` | ✓ | Text to display within the tag (max 40 characters in SAIL) |
| `backgroundColor` | `SAILColorInput` |  | Background color - hex value, semantic color, or palette token (e.g. TEAL_700) |
| `textColor` | `SAILColorInput` |  | Text color - hex value, semantic color, palette token, or "STANDARD" |
| `tooltip` | `string` |  | Tooltip text to display on hover |
| `link` | `string` |  | Link to apply to the tag (href string for React implementation) |

### TaskPlan

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `tasks` | `TaskPlanItem[]` | ✓ | The list of task plan items |
| `editing` | `boolean` |  | Whether the plan is in edit mode |
| `onTasksChange` | `(tasks: TaskPlanItem[]) => void` |  | Callback when tasks are updated in edit mode |

### TaskProgress

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `title` | `string` |  | Section title displayed in the collapsible header |
| `tasks` | `Task[]` | ✓ | Array of tasks to display |
| `defaultOpen` | `boolean` |  | Whether the task list starts expanded |

### TextField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `label` | `string` |  | Text to display as the field label |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `readOnly` | `boolean` |  | Determines if the field should display as not editable |
| `disabled` | `boolean` |  | Determines if the field should display as potentially editable but grayed out |
| `value` | `string` |  | Text to display in the text field |
| `validations` | `string[]` |  | Validation errors to display below the field when the value is not null |
| `saveInto` | `(value: string) => void` |  | Callback when the user changes the text |
| `onChange` | `(value: string) => void` |  | Callback when the user changes the text (React-style alias for saveInto) |
| `refreshAfter` | `KEYPRESS / UNFOCUS` |  | Determines when the interface is refreshed with the saved value |
| `align` | `SAILAlignLegacy` |  | Determines alignment of the text value |
| `placeholder` | `string` |  | Text to display in the field when it is empty |
| `masked` | `boolean` |  | Determines if the value is obscured from view (password field) |
| `inputPurpose` | `NAME / EMAIL / PHONE_NUMBER / STREET_ADDRESS / POSTAL_CODE / COUNTRY / CREDIT_CARD_NUMBER / FIRST_NAME / LAST_NAME / DOB / OFF` |  | Indicates the intent of input for accessibility improvements |
| `characterLimit` | `number` |  | Determines the maximum number of characters |
| `showCharacterCount` | `boolean` |  | Determines if the character count displays on the text field |

### TextItem

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `text` | `string / ReactNode / (string / ReactNode)[]` | ✓ | Array of text to display as a rich text item |
| `style` | `PLAIN / EMPHASIS / STRONG / UNDERLINE / STRIKETHROUGH / PLAIN / EMPHASIS / STRONG / UNDERLINE / STRIKETHROUGH[]` |  | Text style(s) to apply. Multiple styles may be applied |
| `size` | `SAILSizeExtended` |  | Text size |
| `color` | `SAILColorInput` |  | Text color - semantic color, palette token (e.g. TEAL_700), or hex value |
| `link` | `function` |  | Link to apply to the text |
| `linkStyle` | `INLINE / STANDALONE` |  | How the link is underlined |

### ToggleField

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `choiceLabel` | `string` |  | Text to display as the label next to the toggle |
| `required` | `boolean` |  | Determines if a value is required to submit the form |
| `disabled` | `boolean` |  | Determines if the field should display as grayed out |
| `value` | `boolean` |  | Current checked state (true = on, false = off) |
| `validations` | `string[]` |  | Validation errors to display below the field |
| `saveInto` | `(value: boolean) => void` |  | Callback when the user toggles the switch |
| `onChange` | `(value: boolean) => void` |  | Callback when the user toggles the switch (React-style alias for saveInto) |
| `choicePosition` | `START / END` |  | Determines whether the toggle appears on the left or right of the choice label. Valid values: "START" (default), "END" |

### UserImage

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `imageType` | `'user'` | ✓ | Discriminator to identify this as a user image |
| `user` | `User` |  | The user whose profile photo will be shown |
| `altText` | `string` |  | Alternate text for accessibility and screen readers |
| `caption` | `string` |  | Optional caption text for mouseover (tooltip) |
| `link` | `function` |  | Link behavior when image is clicked |
| `backgroundColor` | `string` |  | Background color for the initials fallback. Accepts SAIL color tokens (e.g. "ACCENT", "TEAL_200") or hex strings (e.g. "#4A90D9") |

### WebImage

| Prop | Type | Req | Description |
|------|------|:---:|-------------|
| `source` | `string` | ✓ | The external URL of the image |
| `altText` | `string` |  | Alternate text for accessibility and screen readers |
| `caption` | `string` |  | Optional caption text for mouseover and slideshow mode |
| `link` | `function` |  | Link behavior when image is clicked |
