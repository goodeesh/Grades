import type { SubjectStudents } from '@prisma/client'

import {
  subjectStudentses,
  subjectStudents,
  createSubjectStudents,
  updateSubjectStudents,
  deleteSubjectStudents,
} from './subjectStudentses'
import type { StandardScenario } from './subjectStudentses.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('subjectStudentses', () => {
  scenario(
    'returns all subjectStudentses',
    async (scenario: StandardScenario) => {
      const result = await subjectStudentses()

      expect(result.length).toEqual(
        Object.keys(scenario.subjectStudents).length
      )
    }
  )

  scenario(
    'returns a single subjectStudents',
    async (scenario: StandardScenario) => {
      const result = await subjectStudents({
        id: scenario.subjectStudents.one.id,
      })

      expect(result).toEqual(scenario.subjectStudents.one)
    }
  )

  scenario('creates a subjectStudents', async (scenario: StandardScenario) => {
    const result = await createSubjectStudents({
      input: { subjectId: scenario.subjectStudents.two.subjectId },
    })

    expect(result.subjectId).toEqual(scenario.subjectStudents.two.subjectId)
  })

  scenario('updates a subjectStudents', async (scenario: StandardScenario) => {
    const original = (await subjectStudents({
      id: scenario.subjectStudents.one.id,
    })) as SubjectStudents
    const result = await updateSubjectStudents({
      id: original.id,
      input: { subjectId: scenario.subjectStudents.two.subjectId },
    })

    expect(result.subjectId).toEqual(scenario.subjectStudents.two.subjectId)
  })

  scenario('deletes a subjectStudents', async (scenario: StandardScenario) => {
    const original = (await deleteSubjectStudents({
      id: scenario.subjectStudents.one.id,
    })) as SubjectStudents
    const result = await subjectStudents({ id: original.id })

    expect(result).toEqual(null)
  })
})
