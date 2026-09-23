"use client"

import {
  useEffect,
  useState,
} from "react"

import { Button } from "@/components/ui/button"
import { useWorkspaceStore } from "@/store/workspace-store"

export function FileEditor() {
  const items = useWorkspaceStore(
    (state) => state.items
  )

  const openedFileId = useWorkspaceStore(
    (state) => state.openedFileId
  )

  const updateFileContent =
    useWorkspaceStore(
      (state) =>
        state.updateFileContent
    )

  const setHasUnsavedChanges =
    useWorkspaceStore(
      (state) =>
        state.setHasUnsavedChanges
    )

  const file = items.find(
    (item) => item.id === openedFileId
  )

  const [content, setContent] =
    useState("")

  useEffect(() => {
    if (file?.type === "file") {
      setContent(file.content ?? "")
      setHasUnsavedChanges(false)
    }
  }, [
    file?.id,
    file?.content,
    file?.type,
    setHasUnsavedChanges,
  ])

  const hasChanges =
    file?.type === "file" &&
    content !== (file.content ?? "")

  useEffect(() => {
    setHasUnsavedChanges(
      Boolean(hasChanges)
    )
  }, [
    hasChanges,
    setHasUnsavedChanges,
  ])

  useEffect(() => {
    if (!hasChanges) return

    const handleBeforeUnload = (
      event: BeforeUnloadEvent
    ) => {
      event.preventDefault()
    }

    window.addEventListener(
      "beforeunload",
      handleBeforeUnload
    )

    return () => {
      window.removeEventListener(
        "beforeunload",
        handleBeforeUnload
      )
    }
  }, [hasChanges])

  if (!file || file.type !== "file") {
    return null
  }

  const handleSave = () => {
    updateFileContent(
      file.id,
      content
    )

    setHasUnsavedChanges(false)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-medium">
            {file.name}
          </h2>

          {hasChanges && (
            <p className="text-xs text-muted-foreground">
              Unsaved changes
            </p>
          )}
        </div>

        <Button
          onClick={handleSave}
          disabled={!hasChanges}
        >
          Save
        </Button>
      </div>

      <textarea
        value={content}
        onChange={(event) =>
          setContent(
            event.target.value
          )
        }
        className="min-h-100 w-full resize-none rounded-md border bg-background p-4 outline-none"
      />
    </div>
  )
}