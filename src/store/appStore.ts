import { create } from 'zustand'

interface AppState {
  isSidebarOpen: boolean
  isSidebarCollapsed: boolean
  searchQuery: string
  toggleSidebar: () => void
  toggleSidebarCollapsed: () => void
  closeSidebar: () => void
  setSearchQuery: (value: string) => void
}

export const useAppStore = create<AppState>((set) => ({
  isSidebarOpen: false,
  isSidebarCollapsed: false,
  searchQuery: '',
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleSidebarCollapsed: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  closeSidebar: () => set({ isSidebarOpen: false }),
  setSearchQuery: (value) => set({ searchQuery: value }),
}))
