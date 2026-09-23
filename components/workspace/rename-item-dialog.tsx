"use client"

import { useState } from "react"
import { Pencil } from "lucide-react"

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
import type { TWorkspace } from "@/types/workspace"

type RenameItemDialogProps = {
  item: TWorkspace
}

export function RenameItemDialog({ item }: RenameItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(item.name)
  const [error, setError] = useState("")

  const renameItem = useWorkspaceStore((state) => state.renameItem)

  const handleRename = () => {
    const result = renameItem(item.id, name)

    if (!result.success) {
      setError(result.error ?? "Unable to rename item.")
      return
    }

    setError("")
    setOpen(false)
  }

  const handleOpenChange = (value: boolean) => {
    setOpen(value)

    if (value) {
      setName(item.name)
    }

    if (!value) {
      setError("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={(event) => {
          event.stopPropagation()
          setOpen(true)
        }}
      >
        <Pencil className="size-4" />
        <span className="sr-only">Rename {item.name}</span>
      </Button>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename {item.type}</DialogTitle>

          <DialogDescription>
            Enter a new name for {item.name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Input
            autoFocus
            value={name}
            onChange={(event) => {
              setName(event.target.value)

              if (error) {
                setError("")
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleRename()
              }
            }}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>

          <Button onClick={handleRename}>Rename</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
