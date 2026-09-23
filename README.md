# Mini Workspace Explorer

A small file and folder explorer built with Next.js and TypeScript.

You can create folders and files, move through nested folders, edit file content, search the whole workspace, and keep your data after refreshing the browser.

## Features

- Nested folders and files
- Expand and collapse folders from the sidebar
- Open folders and see their contents
- Breadcrumb navigation
- Create new folders and files
- Rename folders and files
- Delete files and folders
- Deleting a folder also removes everything inside it
- Prevent duplicate names inside the same folder
- Prevent empty names
- Edit and save file content
- Warn before leaving a file with unsaved changes
- Search files and folders from anywhere in the workspace
- Open a search result directly
- Keep workspace data after page refresh
- Handle empty folders

## Tech Used

- Next.js
- React
- TypeScript
- Zustand
- shadcn/ui
- Tailwind CSS
- Lucide React

## Run Locally

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

## Checks

Run the TypeScript check:

```bash
pnpm typecheck
```

Run ESLint:

```bash
pnpm lint
```

Build the project:

```bash
pnpm build
```

## Data Storage

The workspace data is saved in the browser using local storage through Zustand.

There is no backend or database in this project.
