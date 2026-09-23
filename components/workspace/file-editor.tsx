"use client"

import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { useWorkspaceStore } from "@/store/workspace-store"

export function FileEditor() {
  const items = useWorkspaceStore((state) => state.items)
  const openedFileId = useWorkspaceStore((state) => state.openedFileId)
  const updateFileContent = useWorkspaceStore(
    (state) => state.updateFileContent
  )

  const file = items.find((item) => item.id === openedFileId)

  const [content, setContent] = useState("")

  useEffect(() => {
    if (file?.type === "file") {
      setContent(file.content ?? "")
    }
  }, [file])

  if (!file || file.type !== "file") {
    return null
  }

  const hasChanges = content !== (file.content ?? "")

  const handleSave = () => {
    updateFileContent(file.id, content)
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-medium">{file.name}</h2>

          {hasChanges && (
            <p className="text-xs text-muted-foreground">Unsaved changes</p>
          )}
        </div>

        <Button onClick={handleSave} disabled={!hasChanges}>
          Save
        </Button>
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        className="min-h-100 w-full resize-none rounded-md border bg-background p-4 outline-none"
      />
    </div>
  )
}
