"use client"

import { UserProfile as ClerkUserProfile } from "@clerk/nextjs"
import type { Theme, UserProfileProps } from "@clerk/types"

const appearance: Theme = {
  elements: {
    rootBox: {
      maxWidth: "700px",
    },
    cardBox: {
      maxWidth: "700px",
    },
  },
  variables: {
    borderRadius: "0.25rem",
  },
}

export function UserProfile({ ...props }: UserProfileProps) {
  return (
    <ClerkUserProfile
      appearance={{
        ...appearance,
        variables: {
          ...appearance.variables,
        },
      }}
      {...props}
    />
  )
}
