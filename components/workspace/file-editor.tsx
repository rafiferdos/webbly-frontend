"use client"

import { useWorkspaceStore } from "@/store/workspace-store"

export function FileEditor() {
  const items = useWorkspaceStore((state) => state.items)
  const openedFileId = useWorkspaceStore((state) => state.openedFileId)

  const file = items.find((item) => item.id === openedFileId)

  if (!file || file.type !== "file") {
    return null
  }

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-medium">{file.name}</h2>
      </div>

      <textarea
        defaultValue={file.content}
        className="min-h-100 w-full resize-none rounded-md border bg-background p-4 outline-none"
      />
    </div>
  )
}
