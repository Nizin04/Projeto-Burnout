// Simple authentication utilities for the burnout monitoring system
export interface User {
  id: string
  name: string
  email: string
  type: "employee" | "admin"
  verifiedAt?: Date
}

export interface EmployeeSession {
  user: User
  verificationToken: string
  expiresAt: Date
}

function getStoredUsers(): User[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("mockUsers")
  return stored ? JSON.parse(stored) : []
}

function getStoredSessions(): EmployeeSession[] {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem("mockSessions")
  return stored ? JSON.parse(stored) : []
}

function saveUsers(users: User[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mockUsers", JSON.stringify(users))
  }
}

function saveSessions(sessions: EmployeeSession[]): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("mockSessions", JSON.stringify(sessions))
  }
}

export function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function createEmployeeUser(name: string, email: string): User | null {
  if (!name.trim() || !email.trim()) {
    return null
  }

  if (!isValidEmail(email)) {
    return null
  }

  const users = getStoredUsers()

  const existingUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (existingUser) {
    return existingUser
  }

  const user: User = {
    id: Math.random().toString(36).substring(2, 15),
    name: name.trim(),
    email: email.toLowerCase().trim(),
    type: "employee",
  }

  users.push(user)
  saveUsers(users)
  return user
}

export function createEmployeeSession(user: User): EmployeeSession {
  const sessions = getStoredSessions()

  const filteredSessions = sessions.filter((s) => s.user.id !== user.id)

  const session: EmployeeSession = {
    user,
    verificationToken: generateVerificationToken(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  }

  filteredSessions.push(session)
  saveSessions(filteredSessions)
  return session
}

export function verifyEmployeeToken(token: string): User | null {
  const sessions = getStoredSessions()
  const session = sessions.find((s) => s.verificationToken === token && new Date(s.expiresAt) > new Date())

  if (session) {
    session.user.verifiedAt = new Date()

    const users = getStoredUsers()
    const userIndex = users.findIndex((u) => u.id === session.user.id)
    if (userIndex >= 0) {
      users[userIndex] = session.user
      saveUsers(users)
    }

    return session.user
  }
  return null
}

export function verifyAdminCode(code: string): boolean {
  // In production, this should be properly secured
  return code === "admin123"
}

export function getCurrentUser(): User | null {
  // In a real app, this would check session/cookies
  if (typeof window !== "undefined") {
    const userData = localStorage.getItem("currentUser")
    return userData ? JSON.parse(userData) : null
  }
  return null
}

export function setCurrentUser(user: User): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("currentUser", JSON.stringify(user))
  }
}

export function logout(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser")
  }
}
