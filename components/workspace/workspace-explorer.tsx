"use client"

import { getChildren } from "@/lib/workspace-utils"
import { useWorkspaceStore } from "@/store/workspace-store"

export function WorkspaceExplorer() {
  const items = useWorkspaceStore((state) => state.items)
  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId)
  const setSelectedFolderId = useWorkspaceStore(
    (state) => state.setSelectedFolderId
  )

  const children = getChildren(items, selectedFolderId)

  return (
    <main className="p-6">
      <h1 className="mb-4 text-xl font-semibold">Workspace</h1>

      <div className="space-y-2">
        {children.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.type === "folder") {
                setSelectedFolderId(item.id)
              }
            }}
            className={`rounded-md border p-3 ${
              item.type === "folder"
                ? "cursor-pointer hover:bg-muted"
                : "cursor-default"
            }`}
          >
            {item.type === "folder" ? "📁" : "📄"} {item.name}
          </div>
        ))}
      </div>
    </main>
  )
}
