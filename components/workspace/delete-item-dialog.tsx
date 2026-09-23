"use client"

import { Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useWorkspaceStore } from "@/store/workspace-store"
import type { TWorkspace } from "@/types/workspace"

type DeleteItemDialogProps = {
  item: TWorkspace
}

export function DeleteItemDialog({
  item,
}: DeleteItemDialogProps) {
  const deleteItem = useWorkspaceStore(
    (state) => state.deleteItem
  )

  const handleDelete = () => {
    deleteItem(item.id)
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon"
          />
        }
      >
        <Trash2 className="size-4 text-destructive" />

        <span className="sr-only">
          Delete {item.name}
        </span>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Delete {item.name}?
          </AlertDialogTitle>

          <AlertDialogDescription>
            {item.type === "folder"
              ? "This folder and everything inside it will be permanently deleted."
              : "This file will be permanently deleted."}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            variant="destructive"
            onClick={handleDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}