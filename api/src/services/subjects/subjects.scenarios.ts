import type { Prisma, Subject } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubjectCreateArgs>({
  subject: {
    one: {
      data: {
        subjectName: 'String',
        teacher: {
          create: {
            username: 'String1377252',
            password: 'String',
            role: 'String',
          },
        },
      },
    },
    two: {
      data: {
        subjectName: 'String',
        teacher: {
          create: {
            username: 'String4627377',
            password: 'String',
            role: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Subject, 'subject'>
