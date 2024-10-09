export interface User {
  id: string
  name: string | null
  lastName: string
  email: string
  emailVerified: boolean
  createdAt: Date
  phone: string
  businessName: string
  cuitOrDni: string
  province: string
  state: string
  address: string
  preferredTransport: string
  roleName: string | null
}

export interface Role {
  id: string
  name: string | null
}
