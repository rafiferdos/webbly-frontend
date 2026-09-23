"use client"

import { TriangleAlert } from "lucide-react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useWorkspaceStore } from "@/store/workspace-store"

export function UnsavedChangesDialog() {
  const pendingNavigation = useWorkspaceStore(
    (state) => state.pendingNavigation
  )

  const setPendingNavigation = useWorkspaceStore(
    (state) => state.setPendingNavigation
  )

  const setHasUnsavedChanges = useWorkspaceStore(
    (state) => state.setHasUnsavedChanges
  )

  const setSelectedFolderId = useWorkspaceStore(
    (state) => state.setSelectedFolderId
  )

  const navigateToItem = useWorkspaceStore((state) => state.navigateToItem)

  const handleDiscard = () => {
    if (!pendingNavigation) {
      return
    }

    const navigation = pendingNavigation

    setHasUnsavedChanges(false)
    setPendingNavigation(null)

    if (navigation.type === "folder") {
      setSelectedFolderId(navigation.id)

      return
    }

    navigateToItem(navigation.id)
  }

  const handleCancel = () => {
    setPendingNavigation(null)
  }

  return (
    <AlertDialog
      open={Boolean(pendingNavigation)}
      onOpenChange={(open) => {
        if (!open) {
          setPendingNavigation(null)
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <TriangleAlert className="size-8" />
          </AlertDialogMedia>

          <AlertDialogTitle>Unsaved changes</AlertDialogTitle>

          <AlertDialogDescription>
            You have changes that haven&apos;t been saved. Leaving now will
            discard them.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            Keep editing
          </AlertDialogCancel>

          <AlertDialogAction variant="destructive" onClick={handleDiscard}>
            Discard changes
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
