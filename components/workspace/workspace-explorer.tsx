"use client"

import { useEffect } from "react"

import { getBreadcrumb, getChildren } from "@/lib/workspace-utils"
import { useWorkspaceStore } from "@/store/workspace-store"

import { CreateItemDialog } from "./create-item-dialog"
import { FileEditor } from "./file-editor"
import { WorkspaceTree } from "./workspace-tree"

export function WorkspaceExplorer() {
  useEffect(() => {
    useWorkspaceStore.persist.rehydrate()
  }, [])

  const items = useWorkspaceStore((state) => state.items)

  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId)

  const openedFileId = useWorkspaceStore((state) => state.openedFileId)

  const setSelectedFolderId = useWorkspaceStore(
    (state) => state.setSelectedFolderId
  )

  const setOpenedFileId = useWorkspaceStore((state) => state.setOpenedFileId)

  const children = getChildren(items, selectedFolderId)

  const breadcrumb = getBreadcrumb(items, selectedFolderId)

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 shrink-0 border-r p-3">
        <WorkspaceTree />
      </aside>

      <main className="min-w-0 flex-1 p-6">
        <div className="mb-5 flex items-center gap-2 text-sm text-muted-foreground">
          {breadcrumb.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedFolderId(item.id)}
                className="transition-colors hover:text-foreground"
              >
                {item.name}
              </button>

              {index < breadcrumb.length - 1 && <span>/</span>}
            </div>
          ))}
        </div>

        <div className="mb-5 flex items-center gap-2">
          <CreateItemDialog type="folder" />
          <CreateItemDialog type="file" />
        </div>

        {openedFileId ? (
          <FileEditor />
        ) : children.length > 0 ? (
          <div className="space-y-2">
            {children.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => {
                  if (item.type === "folder") {
                    setSelectedFolderId(item.id)
                    return
                  }

                  setOpenedFileId(item.id)
                }}
                className="flex w-full cursor-pointer items-center gap-2 rounded-md border p-3 text-left transition-colors hover:bg-muted"
              >
                <span>{item.type === "folder" ? "📁" : "📄"}</span>

                <span>{item.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-8 text-center">
            <p className="text-sm text-muted-foreground">
              This folder is empty.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
