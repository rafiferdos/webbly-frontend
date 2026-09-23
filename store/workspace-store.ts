import { create } from "zustand"
import { persist } from "zustand/middleware"

import { initialWorkspace } from "@/lib/workspace-data"
import { getAncestorFolderIds, getDescendantIds } from "@/lib/workspace-utils"
import type { TWorkspace, TWorkspaceType } from "@/types/workspace"

type TActionResult = {
  success: boolean
  error?: string
}

type TWorkspaceStore = {
  items: TWorkspace[]
  selectedFolderId: string
  openedFileId: string | null
  expandedFolderIds: string[]
  hasUnsavedChanges: boolean

  setSelectedFolderId: (id: string) => void
  setOpenedFileId: (id: string | null) => void
  setHasUnsavedChanges: (value: boolean) => void

  toggleFolder: (id: string) => void
  navigateToItem: (id: string) => void

  updateFileContent: (id: string, content: string) => void

  createItem: (
    parentId: string,
    name: string,
    type: TWorkspaceType
  ) => TActionResult

  renameItem: (id: string, name: string) => TActionResult

  deleteItem: (id: string) => TActionResult
}

export const useWorkspaceStore = create<TWorkspaceStore>()(
  persist(
    (set, get) => ({
      items: initialWorkspace,
      selectedFolderId: "workspace",
      openedFileId: null,
      expandedFolderIds: ["workspace"],
      hasUnsavedChanges: false,

      setSelectedFolderId: (id) => {
        set({
          selectedFolderId: id,
          openedFileId: null,
        })
      },

      setOpenedFileId: (id) => {
        set({
          openedFileId: id,
        })
      },

      setHasUnsavedChanges: (value) => {
        set({
          hasUnsavedChanges: value,
        })
      },

      toggleFolder: (id) => {
        set((state) => ({
          expandedFolderIds: state.expandedFolderIds.includes(id)
            ? state.expandedFolderIds.filter((folderId) => folderId !== id)
            : [...state.expandedFolderIds, id],
        }))
      },

      navigateToItem: (id) => {
        const state = get()

        const item = state.items.find(
          (workspaceItem) => workspaceItem.id === id
        )

        if (!item) return

        const ancestorFolderIds = getAncestorFolderIds(state.items, item.id)

        const expandedIds = new Set([
          ...state.expandedFolderIds,
          ...ancestorFolderIds,
        ])

        if (item.type === "folder") {
          expandedIds.add(item.id)

          set({
            selectedFolderId: item.id,
            openedFileId: null,
            expandedFolderIds: [...expandedIds],
          })

          return
        }

        set({
          selectedFolderId: item.parentId ?? "workspace",
          openedFileId: item.id,
          expandedFolderIds: [...expandedIds],
        })
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

      renameItem: (id, name) => {
        const item = get().items.find(
          (workspaceItem) => workspaceItem.id === id
        )

        if (!item) {
          return {
            success: false,
            error: "Item not found.",
          }
        }

        const trimmedName = name.trim()

        if (!trimmedName) {
          return {
            success: false,
            error: "Name cannot be empty.",
          }
        }

        const finalName =
          item.type === "file" && !trimmedName.toLowerCase().endsWith(".txt")
            ? `${trimmedName}.txt`
            : trimmedName

        const duplicateExists = get().items.some(
          (workspaceItem) =>
            workspaceItem.id !== id &&
            workspaceItem.parentId === item.parentId &&
            workspaceItem.name.toLowerCase() === finalName.toLowerCase()
        )

        if (duplicateExists) {
          return {
            success: false,
            error: `"${finalName}" already exists in this folder.`,
          }
        }

        set((state) => ({
          items: state.items.map((workspaceItem) =>
            workspaceItem.id === id
              ? {
                  ...workspaceItem,
                  name: finalName,
                }
              : workspaceItem
          ),
        }))

        return {
          success: true,
        }
      },

      deleteItem: (id) => {
        const state = get()

        const item = state.items.find(
          (workspaceItem) => workspaceItem.id === id
        )

        if (!item) {
          return {
            success: false,
            error: "Item not found.",
          }
        }

        if (item.id === "workspace") {
          return {
            success: false,
            error: "The root workspace cannot be deleted.",
          }
        }

        const descendantIds =
          item.type === "folder" ? getDescendantIds(state.items, item.id) : []

        const idsToDelete = new Set([item.id, ...descendantIds])

        const selectedFolderWasDeleted = idsToDelete.has(state.selectedFolderId)

        const openedFileWasDeleted = state.openedFileId
          ? idsToDelete.has(state.openedFileId)
          : false

        set({
          items: state.items.filter(
            (workspaceItem) => !idsToDelete.has(workspaceItem.id)
          ),

          selectedFolderId: selectedFolderWasDeleted
            ? (item.parentId ?? "workspace")
            : state.selectedFolderId,

          openedFileId: openedFileWasDeleted ? null : state.openedFileId,

          hasUnsavedChanges: openedFileWasDeleted
            ? false
            : state.hasUnsavedChanges,

          expandedFolderIds: state.expandedFolderIds.filter(
            (folderId) => !idsToDelete.has(folderId)
          ),
        })

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
