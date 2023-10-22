import type { Prisma, Grade } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.GradeCreateArgs>({
  grade: {
    one: {
      data: {
        grade: 6979688,
        date: 'String',
        subject: {
          create: {
            subjectName: 'String',
            teacher: {
              create: {
                username: 'String5405486',
                password: 'String',
                role: 'String',
              },
            },
          },
        },
        User: {
          create: {
            username: 'String7507501',
            password: 'String',
            role: 'String',
          },
        },
      },
    },
    two: {
      data: {
        grade: 479095,
        date: 'String',
        subject: {
          create: {
            subjectName: 'String',
            teacher: {
              create: {
                username: 'String6669991',
                password: 'String',
                role: 'String',
              },
            },
          },
        },
        User: {
          create: {
            username: 'String9244798',
            password: 'String',
            role: 'String',
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Grade, 'grade'>
