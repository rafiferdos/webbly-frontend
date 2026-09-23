"use client"

import { useEffect } from "react"

import { useWorkspaceNavigation } from "@/hooks/use-workspace-navigation"
import { getBreadcrumb, getChildren } from "@/lib/workspace-utils"
import { useWorkspaceStore } from "@/store/workspace-store"

import { CreateItemDialog } from "./create-item-dialog"
import { DeleteItemDialog } from "./delete-item-dialog"
import { FileEditor } from "./file-editor"
import { RenameItemDialog } from "./rename-item-dialog"
import { UnsavedChangesDialog } from "./unsaved-changes-dialog"
import { WorkspaceSearch } from "./workspace-search"
import { WorkspaceTree } from "./workspace-tree"

export function WorkspaceExplorer() {
  useEffect(() => {
    useWorkspaceStore.persist.rehydrate()
  }, [])

  const items = useWorkspaceStore((state) => state.items)

  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId)

  const openedFileId = useWorkspaceStore((state) => state.openedFileId)

  const { openFolder, openItem } = useWorkspaceNavigation()

  const children = getChildren(items, selectedFolderId)

  const breadcrumb = getBreadcrumb(items, selectedFolderId)

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <UnsavedChangesDialog />

      <aside className="w-full shrink-0 border-b md:w-64 md:border-r md:border-b-0">
        <div className="max-h-56 overflow-auto p-3 md:max-h-screen">
          <WorkspaceTree />
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {breadcrumb.map((item, index) => (
            <div key={item.id} className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => openFolder(item.id)}
                className="max-w-40 truncate transition-colors hover:text-foreground sm:max-w-none"
              >
                {item.name}
              </button>

              {index < breadcrumb.length - 1 && <span>/</span>}
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <CreateItemDialog type="folder" />
            <CreateItemDialog type="file" />
          </div>

          <WorkspaceSearch />
        </div>

        {openedFileId ? (
          <FileEditor />
        ) : children.length > 0 ? (
          <div className="space-y-2">
            {children.map((item) => (
              <div
                key={item.id}
                className="flex min-w-0 items-center rounded-md border transition-colors hover:bg-muted"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (item.type === "folder") {
                      openFolder(item.id)
                      return
                    }

                    openItem(item.id)
                  }}
                  className="flex min-w-0 flex-1 items-center gap-2 p-3 text-left"
                >
                  <span className="shrink-0">
                    {item.type === "folder" ? "📁" : "📄"}
                  </span>

                  <span className="truncate">{item.name}</span>
                </button>

                <div className="flex shrink-0 items-center gap-1 pr-2">
                  <RenameItemDialog item={item} />

                  <DeleteItemDialog item={item} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed p-6 text-center sm:p-8">
            <p className="text-sm text-muted-foreground">
              This folder is empty.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
