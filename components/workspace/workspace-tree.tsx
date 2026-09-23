"use client"

import { ChevronDown, ChevronRight, Folder } from "lucide-react"

import { useWorkspaceNavigation } from "@/hooks/use-workspace-navigation"
import { getChildren } from "@/lib/workspace-utils"
import { useWorkspaceStore } from "@/store/workspace-store"

type WorkspaceTreeItemProps = {
  folderId: string
  depth?: number
}

function WorkspaceTreeItem({ folderId, depth = 0 }: WorkspaceTreeItemProps) {
  const items = useWorkspaceStore((state) => state.items)

  const selectedFolderId = useWorkspaceStore((state) => state.selectedFolderId)

  const expandedFolderIds = useWorkspaceStore(
    (state) => state.expandedFolderIds
  )

  const toggleFolder = useWorkspaceStore((state) => state.toggleFolder)

  const { openFolder } = useWorkspaceNavigation()

  const folder = items.find((item) => item.id === folderId)

  if (!folder || folder.type !== "folder") {
    return null
  }

  const childFolders = getChildren(items, folder.id).filter(
    (item) => item.type === "folder"
  )

  const isExpanded = expandedFolderIds.includes(folder.id)

  const isSelected = selectedFolderId === folder.id

  const hasChildren = childFolders.length > 0

  return (
    <div>
      <div
        className={`flex items-center gap-1 rounded-md py-1.5 pr-2 text-sm ${
          isSelected ? "bg-muted font-medium" : "hover:bg-muted/60"
        }`}
        style={{
          paddingLeft: `${depth * 16 + 8}px`,
        }}
      >
        <button
          type="button"
          onClick={() => {
            if (hasChildren) {
              toggleFolder(folder.id)
            }
          }}
          className="flex size-5 items-center justify-center"
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )
          ) : (
            <span className="size-4" />
          )}
        </button>

        <button
          type="button"
          onClick={() => openFolder(folder.id)}
          className="flex flex-1 items-center gap-2 text-left"
        >
          <Folder className="size-4" />

          <span className="truncate">{folder.name}</span>
        </button>
      </div>

      {isExpanded &&
        childFolders.map((child) => (
          <WorkspaceTreeItem
            key={child.id}
            folderId={child.id}
            depth={depth + 1}
          />
        ))}
    </div>
  )
}

export function WorkspaceTree() {
  return <WorkspaceTreeItem folderId="workspace" />
}
