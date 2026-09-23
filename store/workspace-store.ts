import { create } from "zustand"
import { persist } from "zustand/middleware"

import { initialWorkspace } from "@/lib/workspace-data"
import type { TWorkspace, TWorkspaceType } from "@/types/workspace"

type TCreateItemResult = {
  success: boolean
  error?: string
}

type TWorkspaceStore = {
  items: TWorkspace[]
  selectedFolderId: string
  openedFileId: string | null
  expandedFolderIds: string[]

  setSelectedFolderId: (id: string) => void
  setOpenedFileId: (id: string | null) => void
  toggleFolder: (id: string) => void
  updateFileContent: (id: string, content: string) => void

  createItem: (
    parentId: string,
    name: string,
    type: TWorkspaceType
  ) => TCreateItemResult
}

export const useWorkspaceStore = create<TWorkspaceStore>()(
  persist(
    (set, get) => ({
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

      updateFileContent: (id, content) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  content,
                }
              : item
          ),
        }))
      },

      createItem: (parentId, name, type) => {
        const trimmedName = name.trim()

        if (!trimmedName) {
          return {
            success: false,
            error: "Name cannot be empty.",
          }
        }

        const finalName =
          type === "file" && !trimmedName.toLowerCase().endsWith(".txt")
            ? `${trimmedName}.txt`
            : trimmedName

        const duplicateExists = get().items.some(
          (item) =>
            item.parentId === parentId &&
            item.name.toLowerCase() === finalName.toLowerCase()
        )

        if (duplicateExists) {
          return {
            success: false,
            error: `"${finalName}" already exists in this folder.`,
          }
        }

        const newItem: TWorkspace = {
          id: crypto.randomUUID(),
          name: finalName,
          type,
          parentId,
          ...(type === "file" ? { content: "" } : {}),
        }

        set((state) => ({
          items: [...state.items, newItem],
          expandedFolderIds:
            type === "folder" && !state.expandedFolderIds.includes(parentId)
              ? [...state.expandedFolderIds, parentId]
              : state.expandedFolderIds,
        }))

        return {
          success: true,
        }
      },
    }),
    {
      name: "workspace-storage",

      partialize: (state) => ({
        items: state.items,
      }),

      skipHydration: true,
    }
  )
)
