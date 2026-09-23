# Mini Workspace Explorer

A small browser-based file and folder explorer built with Next.js and TypeScript.

It works like a simple workspace. You can create folders and files, open nested folders, edit file content, search the workspace, rename or delete items, and keep saved data after refreshing the page.

## Features

- Create folders and files
- Create folders inside other folders
- Expand and collapse folders from the sidebar
- Open folders and view their contents
- Breadcrumb navigation
- Rename files and folders
- Delete files and folders
- Delete nested folders with everything inside them
- Edit and save file content
- Search files and folders across the whole workspace
- Open search results directly
- Warn before leaving a file with unsaved changes
- Prevent empty names
- Prevent duplicate names inside the same folder
- Keep saved workspace data after page refresh
- Handle empty folders
- Works without a backend or database

## How to Run

Install the dependencies:

```bash
pnpm install
```

Start the development server:

```bash
pnpm dev
```

Then open:

```text
http://localhost:3000
```

To check the project before submitting:

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Project Structure

The main project files are kept small and separated by responsibility.

```text
app/
  page.tsx

components/
  ui/
  workspace/
    create-item-dialog.tsx
    delete-item-dialog.tsx
    file-editor.tsx
    rename-item-dialog.tsx
    unsaved-changes-dialog.tsx
    workspace-explorer.tsx
    workspace-search.tsx
    workspace-tree.tsx

hooks/
  use-workspace-navigation.ts

lib/
  workspace-data.ts
  workspace-utils.ts

store/
  workspace-store.ts

types/
  workspace.ts
```

`workspace-explorer.tsx` is the main screen.

The smaller workspace components handle things like the folder tree, file editor, search, create, rename, delete, and unsaved-change dialog.

Helper functions for things like breadcrumbs, descendants, ancestors, and paths are kept inside `lib/workspace-utils.ts`.

## State Management

The project uses Zustand for workspace state.

The store keeps track of:

- All files and folders
- The currently selected folder
- The currently opened file
- Expanded folders in the sidebar
- Unsaved changes
- Pending navigation when there are unsaved changes

The workspace items are saved in browser local storage using Zustand's persist middleware.

Only the actual workspace data needs to stay after refresh. Temporary UI state, such as the open file or unsaved-change dialog, is not stored.

## File-System Data Structure

Files and folders use the same simple object shape:

```ts
type TWorkspace = {
  id: string
  name: string
  type: "folder" | "file"
  parentId: string | null
  content?: string
}
```

The workspace is stored as one flat array instead of deeply nested objects.

For example:

```ts
{
  id: "projects",
  name: "Projects",
  type: "folder",
  parentId: "workspace"
}
```

A child only needs to know its parent's ID.

This makes creating, renaming, deleting, searching, and saving items simple. The folder tree is built recursively from the same data when it is displayed.

## Important Implementation Decisions

### Flat data instead of nested objects

I used a flat array with `parentId` instead of storing folders inside folders.

This keeps updates simple and avoids rebuilding large nested objects every time something changes.

### Recursive folder handling

The sidebar tree is recursive, so it can display folders at any depth.

The same idea is used when deleting a folder. All of its children and deeper descendants are found and removed with it.

### Duplicate names

Two items cannot have the same name inside the same folder.

The check is case-insensitive, so `Notes` and `notes` are treated as the same name.

The same name can still be used in different folders.

### Search

Search runs across the full workspace, not only the current folder.

Clicking a result opens the correct folder or file and expands the needed folders in the sidebar.

### File editing

File content is edited locally first.

The stored content only changes after pressing **Save**.

If there are unsaved changes and the user tries to move somewhere else, a confirmation dialog is shown before leaving.

The browser also warns before refresh or tab close when there are unsaved changes.

### Persistence

There is no backend.

Saved workspace data stays in the browser through local storage, so refreshing the page does not reset the workspace.

## Tech Used

- Next.js
- React
- TypeScript
- Zustand
- shadcn/ui
- Tailwind CSS
- Lucide React
