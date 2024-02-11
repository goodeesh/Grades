import type { Prisma, Assignment } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.AssignmentCreateArgs>({
  assignment: {
    one: {
      data: {
        title: 'String',
        subject: {
          create: {
            subjectName: 'String',
            subjectDescription: 'String',
            teacher: {
              create: {
                email: 'String5451952',
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
        title: 'String',
        subject: {
          create: {
            subjectName: 'String',
            subjectDescription: 'String',
            teacher: {
              create: {
                email: 'String5308318',
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

export type StandardScenario = ScenarioData<Assignment, 'assignment'>
