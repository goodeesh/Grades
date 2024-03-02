import type { Prisma, Grade } from '@prisma/client'
import type { ScenarioData } from '@redwoodjs/testing/api'

export const standard = defineScenario<Prisma.GradeCreateArgs>({
  grade: {
    one: {
      data: {
        grade: 7726343,
        date: 'String',
        user: { create: { name: 'String' } },
        assignment: {
          create: {
            title: 'String',
            subject: {
              create: {
                subjectName: 'String',
                subjectDescription: 'String',
                teacher: { create: { name: 'String' } },
              },
            },
          },
        },
      },
    },
    two: {
      data: {
        grade: 5122984,
        date: 'String',
        user: { create: { name: 'String' } },
        assignment: {
          create: {
            title: 'String',
            subject: {
              create: {
                subjectName: 'String',
                subjectDescription: 'String',
                teacher: { create: { name: 'String' } },
              },
            },
          },
        },
      },
    },
  },
})

export type StandardScenario = ScenarioData<Grade, 'grade'>
