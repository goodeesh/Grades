import type { Prisma, Subject } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubjectCreateArgs>({
  subject: {
    one: {
      data: {
        subjectName: 'String',
        teacher: {
          create: {
            id: 'String',
            role: 'String',
            name: 'String',
            lastName: 'String',
          },
        },
      },
    },
    two: {
      data: {
        subjectName: 'String',
        teacher: {
          create: {
            id: 'String',
            role: 'String',
            name: 'String',
            lastName: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subject, 'subject'>
