import { create } from "zustand"

import { initialWorkspace } from "@/lib/workspace-data"
import type { TWorkspace } from "@/types/workspace"

type TWorkspaceStore = {
  items: TWorkspace[]
  selectedFolderId: string
  openedFileId: string | null
  expandedFolderIds: string[]

  setSelectedFolderId: (id: string) => void
  setOpenedFileId: (id: string | null) => void
  toggleFolder: (id: string) => void
}

export const useWorkspaceStore = create<TWorkspaceStore>((set) => ({
  items: initialWorkspace,
  selectedFolderId: "workspace",
  openedFileId: null,
  expandedFolderIds: ["workspace"],

  setSelectedFolderId: (id) => {
    set({
      selectedFolderId: id,
      openedFileId: null,
    })
  },

  setOpenedFileId: (id) => {
    set({ openedFileId: id })
  },

  toggleFolder: (id) => {
    set((state) => ({
      expandedFolderIds: state.expandedFolderIds.includes(id)
        ? state.expandedFolderIds.filter((folderId) => folderId !== id)
        : [...state.expandedFolderIds, id],
    }))
  },
}))
