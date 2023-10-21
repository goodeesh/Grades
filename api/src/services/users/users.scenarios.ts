import type { Prisma, User } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.UserCreateArgs>({
  user: {
    one: {
      data: { username: 'String7424668', password: 'String', role: 'String' },
    },
    two: {
      data: { username: 'String2671818', password: 'String', role: 'String' },
    },
  },
})

export type StandardScenario = ScenarioData<User, 'user'>
