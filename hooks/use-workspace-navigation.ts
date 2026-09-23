"use client"

import { useWorkspaceStore } from "@/store/workspace-store"

export function useWorkspaceNavigation() {
  const hasUnsavedChanges = useWorkspaceStore(
    (state) => state.hasUnsavedChanges
  )

  const setHasUnsavedChanges = useWorkspaceStore(
    (state) => state.setHasUnsavedChanges
  )

  const setPendingNavigation = useWorkspaceStore(
    (state) => state.setPendingNavigation
  )

  const setSelectedFolderId = useWorkspaceStore(
    (state) => state.setSelectedFolderId
  )

  const navigateToItem = useWorkspaceStore((state) => state.navigateToItem)

  const openFolder = (id: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation({
        type: "folder",
        id,
      })

      return false
    }

    setHasUnsavedChanges(false)
    setSelectedFolderId(id)

    return true
  }

  const openItem = (id: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation({
        type: "item",
        id,
      })

      return false
    }

    setHasUnsavedChanges(false)
    navigateToItem(id)

    return true
  }

  return {
    openFolder,
    openItem,
  }
}
