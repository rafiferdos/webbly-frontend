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
