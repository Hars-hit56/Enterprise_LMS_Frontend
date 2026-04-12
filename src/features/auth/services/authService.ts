import type { User, UserRole } from '../../../types'
import { mockApi } from '../../../services/mockApi'
import { userRegistryStorageKey } from '../../../utils/constants'

const seededUsers: User[] = [
  { id: 'u-100', name: 'John Doe', email: 'student@learnhub.dev', password: 'password123', role: 'student', status: 'Active', joined: 'Jan 15, 2025' },
  { id: 'u-101', name: 'Sarah Chen', email: 'instructor@learnhub.dev', password: 'password123', role: 'instructor', status: 'Active', joined: 'Dec 1, 2024' },
  { id: 'u-102', name: 'Alice Martin', email: 'admin@learnhub.dev', password: 'password123', role: 'admin', status: 'Active', joined: 'Nov 21, 2024' },
]

function readRegistry() {
  const stored = localStorage.getItem(userRegistryStorageKey)
  const createdUsers = stored ? (JSON.parse(stored) as User[]) : []
  return [...seededUsers, ...createdUsers]
}

function writeRegistry(users: User[]) {
  const customUsers = users.filter((user) => !seededUsers.some((seeded) => seeded.id === user.id))
  localStorage.setItem(userRegistryStorageKey, JSON.stringify(customUsers))
}

export const authService = {
  async login(email: string, password: string) {
    const user = readRegistry().find(
      (entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password,
    )

    if (!user) {
      throw new Error('Invalid credentials. Try one of the demo accounts below.')
    }

    return mockApi({ ...user, password: undefined })
  },

  async signup(payload: {
    name: string
    email: string
    password: string
    role: UserRole
  }) {
    const users = readRegistry()
    const exists = users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())

    if (exists) {
      throw new Error('An account with this email already exists.')
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      password: payload.password,
      role: payload.role,
      status: 'Invited',
      joined: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    }

    writeRegistry([...users, newUser])
    return mockApi({ ...newUser, password: undefined })
  },

  async getUsers() {
    return mockApi(
      readRegistry().map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        status: user.status,
        joined: user.joined,
      })),
      200,
    )
  },
}
