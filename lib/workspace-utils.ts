import type { TWorkspace } from "@/types/workspace"

export const getChildren = (
  items: TWorkspace[],
  parentId: string
): TWorkspace[] => {
  return items.filter((item) => item.parentId === parentId)
}

export const getBreadcrumb = (
  items: TWorkspace[],
  folderId: string
): TWorkspace[] => {
  const breadcrumb: TWorkspace[] = []

  let current = items.find((item) => item.id === folderId)

  while (current) {
    breadcrumb.unshift(current)

    if (!current.parentId) break

    current = items.find((item) => item.id === current?.parentId)
  }

  return breadcrumb
}

export const getDescendantIds = (
  items: TWorkspace[],
  parentId: string
): string[] => {
  const children = items.filter((item) => item.parentId === parentId)

  return children.flatMap((child) => [
    child.id,
    ...getDescendantIds(items, child.id),
  ])
}

export const getAncestorFolderIds = (
  items: TWorkspace[],
  itemId: string
): string[] => {
  const ancestorIds: string[] = []

  let current = items.find((item) => item.id === itemId)

  while (current?.parentId) {
    const parent = items.find((item) => item.id === current?.parentId)

    if (!parent) break

    if (parent.type === "folder") {
      ancestorIds.unshift(parent.id)
    }

    current = parent
  }

  return ancestorIds
}

export const getItemPath = (items: TWorkspace[], itemId: string): string => {
  const path: string[] = []

  let current = items.find((item) => item.id === itemId)

  while (current) {
    path.unshift(current.name)

    if (!current.parentId) break

    current = items.find((item) => item.id === current?.parentId)
  }

  return path.join(" / ")
}
