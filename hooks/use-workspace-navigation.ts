"use client"

import { useWorkspaceStore } from "@/store/workspace-store"

export function useWorkspaceNavigation() {
  const hasUnsavedChanges = useWorkspaceStore(
    (state) => state.hasUnsavedChanges
  )

  const setHasUnsavedChanges = useWorkspaceStore(
    (state) => state.setHasUnsavedChanges
  )

  const setSelectedFolderId = useWorkspaceStore(
    (state) => state.setSelectedFolderId
  )

  const navigateToItem = useWorkspaceStore((state) => state.navigateToItem)

  const confirmNavigation = () => {
    if (!hasUnsavedChanges) {
      return true
    }

    return window.confirm(
      "You have unsaved changes. Discard them and continue?"
    )
  }

  const openFolder = (id: string) => {
    if (!confirmNavigation()) {
      return
    }

    setHasUnsavedChanges(false)
    setSelectedFolderId(id)
  }

  const openItem = (id: string) => {
    if (!confirmNavigation()) {
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
