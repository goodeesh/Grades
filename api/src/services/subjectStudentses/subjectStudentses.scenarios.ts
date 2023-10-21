import type { Prisma, SubjectStudents } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.SubjectStudentsCreateArgs>({
  subjectStudents: {
    one: {
      data: {
        subject: {
          create: {
            subjectName: 'String',
            teacher: {
              create: {
                username: 'String2398769',
                password: 'String',
                role: 'String',
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        subject: {
          create: {
            subjectName: 'String',
            teacher: {
              create: {
                username: 'String3951218',
                password: 'String',
                role: 'String',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<SubjectStudents, 'subjectStudents'>
