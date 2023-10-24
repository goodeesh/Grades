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
                id: 'String',
                role: 'String',
                name: 'String',
                lastName: 'String',
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
                id: 'String',
                role: 'String',
                name: 'String',
                lastName: 'String',
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<SubjectStudents, 'subjectStudents'>
