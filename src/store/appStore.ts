import { create } from 'zustand'

interface AppState {
  isSidebarOpen: boolean
  searchQuery: string
  toggleSidebar: () => void
  closeSidebar: () => void
  setSearchQuery: (value: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  searchQuery: '',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  setSearchQuery: (value) => set({ searchQuery: value }),
}))
