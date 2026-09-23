import { create } from "zustand"

import { initialWorkspace } from "@/lib/workspace-data"
import type { TWorkspace } from "@/types/workspace"

type TWorkspaceStore = {
  items: TWorkspace[]
  selectedFolderId: string
  expandedFolderIds: string[]

  setSelectedFolderId: (id: string) => void
  toggleFolder: (id: string) => void
}

export const useWorkspaceStore = create<TWorkspaceStore>((set) => ({
  items: initialWorkspace,
  selectedFolderId: "workspace",
  expandedFolderIds: ["workspace"],

  setSelectedFolderId: (id) => {
    set({ selectedFolderId: id })
  },

  toggleFolder: (id) => {
    set((state) => ({
      expandedFolderIds: state.expandedFolderIds.includes(id)
        ? state.expandedFolderIds.filter((folderId) => folderId !== id)
        : [...state.expandedFolderIds, id],
    }))
  },
}))
