import type { Assignment } from '@prisma/client'

import {
  assignments,
  assignment,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from './assignments'
import type { StandardScenario } from './assignments.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('assignments', () => {
  scenario('returns all assignments', async (scenario: StandardScenario) => {
    const result = await assignments()

    expect(result.length).toEqual(Object.keys(scenario.assignment).length)
  })

  scenario(
    'returns a single assignment',
    async (scenario: StandardScenario) => {
      const result = await assignment({ id: scenario.assignment.one.id })

      expect(result).toEqual(scenario.assignment.one)
    }
  )

  scenario('creates a assignment', async (scenario: StandardScenario) => {
    const result = await createAssignment({
      input: { title: 'String', subjectId: scenario.assignment.two.subjectId },
    })

    expect(result.title).toEqual('String')
    expect(result.subjectId).toEqual(scenario.assignment.two.subjectId)
  })

  scenario('updates a assignment', async (scenario: StandardScenario) => {
    const original = (await assignment({
      id: scenario.assignment.one.id,
    })) as Assignment
    const result = await updateAssignment({
      id: original.id,
      input: { title: 'String2' },
    })

    expect(result.title).toEqual('String2')
  })

  scenario('deletes a assignment', async (scenario: StandardScenario) => {
    const original = (await deleteAssignment({
      id: scenario.assignment.one.id,
    })) as Assignment
    const result = await assignment({ id: original.id })

    expect(result).toEqual(null)
  })
})
