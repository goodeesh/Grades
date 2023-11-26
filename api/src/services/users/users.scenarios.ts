import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: { email: 'String6841336', name: 'String', lastName: 'String' },
    },
    two: {
      data: { email: 'String7556562', name: 'String', lastName: 'String' },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
