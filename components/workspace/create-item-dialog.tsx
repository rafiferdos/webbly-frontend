"use client"

import { useState } from "react"
import { FilePlus, FolderPlus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useWorkspaceStore } from "@/store/workspace-store"
import type { TWorkspaceType } from "@/types/workspace"

type CreateItemDialogProps = {
  type: TWorkspaceType
}

export function CreateItemDialog({ type }: CreateItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId)

  const createItem = useWorkspaceStore((state) => state.createItem)

  const isFolder = type === "folder"

  const reset = () => {
    setName("")
    setError("")
  }

  const handleCreate = () => {
    const result = createItem(selectedFolderId, name, type)

    if (!result.success) {
      setError(result.error ?? "Unable to create item.")
      return
    }

    reset()
    setOpen(false)
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)

    if (!value) {
      reset()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        {isFolder ? (
          <FolderPlus className="size-4" />
        ) : (
          <FilePlus className="size-4" />
        )}

        {isFolder ? "New Folder" : "New File"}
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isFolder ? "Create folder" : "Create file"}
          </DialogTitle>

          <DialogDescription>
            The new item will be created inside the current folder.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            autoFocus
            value={name}
            placeholder={isFolder ? "Folder name" : "File name"}
            onChange={(event) => {
              setName(event.target.value)

              if (error) {
                setError("")
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleCreate()
              }
            }}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleCreate}>Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
