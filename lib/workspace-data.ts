import type { TWorkspace } from "@/types/workspace"

export const initialWorkspace: TWorkspace[] = [
  {
    id: "workspace",
    name: "Workspace",
    type: "folder",
    parentId: null,
  },
  {
    id: "projects",
    name: "Projects",
    type: "folder",
    parentId: "workspace",
  },
  {
    id: "webbly",
    name: "Webbly",
    type: "folder",
    parentId: "projects",
  },
  {
    id: "notes",
    name: "notes.txt",
    type: "file",
    parentId: "webbly",
    content: "These are some notes for the Webbly project.",
  },
  {
    id: "documents",
    name: "Documents",
    type: "folder",
    parentId: "workspace",
  },
  {
    id: "readme",
    name: "README.txt",
    type: "file",
    parentId: "workspace",
    content: "Welcome to the Mini Workspace Explorer.",
  },
]
