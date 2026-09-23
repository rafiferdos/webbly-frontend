import { create } from "zustand"

import { initialWorkspace } from "@/lib/workspace-data"
import type { TWorkspace } from "@/types/workspace"

type TWorkspaceStore = {
  items: TWorkspace[]
  selectedFolderId: string
  setSelectedFolderId: (id: string) => void
}

export const useWorkspaceStore = create<TWorkspaceStore>((set) => ({
  items: initialWorkspace,
  selectedFolderId: "workspace",

  setSelectedFolderId: (id) => {
    set({ selectedFolderId: id })
  },
}))