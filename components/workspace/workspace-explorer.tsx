"use client"

import { getBreadcrumb, getChildren } from "@/lib/workspace-utils"
import { useWorkspaceStore } from "@/store/workspace-store"
import { WorkspaceTree } from "./workspace-tree"

export function WorkspaceExplorer() {
  const items = useWorkspaceStore((state) => state.items)

  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId)

  const setSelectedFolderId = useWorkspaceStore(
    (state) => state.setSelectedFolderId
  )

  const children = getChildren(items, selectedFolderId)
  const breadcrumb = getBreadcrumb(items, selectedFolderId)

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r p-3">
        <WorkspaceTree />
      </aside>

      <main className="flex-1 p-6">
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumb.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <button
                onClick={() => setSelectedFolderId(item.id)}
                className="hover:text-foreground"
              >
                {item.name}
              </button>

              {index < breadcrumb.length - 1 && <span>/</span>}
            </div>
          ))}
        </div>

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
    </div>
  )
}
