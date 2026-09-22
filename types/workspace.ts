export type TWorkspace = {
  id: string
  name: string
  type: TWorkspaceType
  parentId: string | null
  content?: string
}

export type TWorkspaceType = "folder" | "file"
