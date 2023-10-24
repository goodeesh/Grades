import type { Prisma, Grade } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.GradeCreateArgs>({
  grade: {
    one: {
      data: {
        grade: 2462868,
        date: 'String',
        subject: {
          create: {
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
        User: {
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
        grade: 7358374,
        date: 'String',
        subject: {
          create: {
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
        User: {
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

export type StandardScenario = ScenarioData<Grade, 'grade'>
