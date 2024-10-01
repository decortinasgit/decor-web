export interface User {
  id: string
  name: string | null
  email: string
  emailVerified: boolean
  createdAt: Date
  updatedAt: Date | null
}
