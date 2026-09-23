"use client"

import { useMemo, useState } from "react"
import { FileText, Folder, Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { getItemPath } from "@/lib/workspace-utils"
import { useWorkspaceStore } from "@/store/workspace-store"

export function WorkspaceSearch() {
  const [query, setQuery] = useState("")

  const items = useWorkspaceStore((state) => state.items)

  const navigateToItem = useWorkspaceStore((state) => state.navigateToItem)

  const normalizedQuery = query.trim().toLowerCase()

  const results = useMemo(() => {
    if (!normalizedQuery) {
      return []
    }

    return items.filter(
      (item) =>
        item.id !== "workspace" &&
        item.name.toLowerCase().includes(normalizedQuery)
    )
  }, [items, normalizedQuery])

  const handleResultClick = (id: string) => {
    navigateToItem(id)
    setQuery("")
  }

  return (
    <div className="relative w-full sm:max-w-sm">
      <Search className="pointer-events-none absolute top-2.5 left-3 size-4 text-muted-foreground" />

      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search workspace..."
        className="pl-9"
      />

      {normalizedQuery && (
        <div className="absolute top-full right-0 left-0 z-50 mt-2 max-h-80 overflow-y-auto rounded-md border bg-popover p-1 shadow-md">
          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleResultClick(item.id)}
                className="flex w-full items-start gap-3 rounded-sm px-3 py-2 text-left hover:bg-muted"
              >
                {item.type === "folder" ? (
                  <Folder className="mt-0.5 size-4 shrink-0" />
                ) : (
                  <FileText className="mt-0.5 size-4 shrink-0" />
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.name}</p>

                  <p className="truncate text-xs text-muted-foreground">
                    {getItemPath(items, item.id)}
                  </p>
                </div>
              </button>
            ))
          ) : (
            <div className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
