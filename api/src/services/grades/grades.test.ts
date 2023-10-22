import type { Grade } from '@prisma/client'

import { grades, grade, createGrade, updateGrade, deleteGrade } from './grades'
import type { StandardScenario } from './grades.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('grades', () => {
  scenario('returns all grades', async (scenario: StandardScenario) => {
    const result = await grades()

    expect(result.length).toEqual(Object.keys(scenario.grade).length)
  })

  scenario('returns a single grade', async (scenario: StandardScenario) => {
    const result = await grade({ id: scenario.grade.one.id })

    expect(result).toEqual(scenario.grade.one)
  })

  scenario('creates a grade', async (scenario: StandardScenario) => {
    const result = await createGrade({
      input: {
        subjectId: scenario.grade.two.subjectId,
        userId: scenario.grade.two.userId,
        grade: 5573325,
        date: 'String',
      },
    })

    expect(result.subjectId).toEqual(scenario.grade.two.subjectId)
    expect(result.userId).toEqual(scenario.grade.two.userId)
    expect(result.grade).toEqual(5573325)
    expect(result.date).toEqual('String')
  })

  scenario('updates a grade', async (scenario: StandardScenario) => {
    const original = (await grade({ id: scenario.grade.one.id })) as Grade
    const result = await updateGrade({
      id: original.id,
      input: { grade: 5684082 },
    })

    expect(result.grade).toEqual(5684082)
  })

  scenario('deletes a grade', async (scenario: StandardScenario) => {
    const original = (await deleteGrade({ id: scenario.grade.one.id })) as Grade
    const result = await grade({ id: original.id })

    expect(result).toEqual(null)
  })
})
