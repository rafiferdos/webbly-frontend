import type { TWorkspace } from "@/types/workspace"

export const getChildren = (
  items: TWorkspace[],
  parentId: string
): TWorkspace[] => {
  return items.filter((item) => item.parentId === parentId)
}
