import type { Subject } from '@prisma/client'

import {
  subjects,
  subject,
  createSubject,
  updateSubject,
  deleteSubject,
} from './subjects'
import type { StandardScenario } from './subjects.scenarios'

// Generated boilerplate tests do not account for all circumstances
// and can fail without adjustments, e.g. Float.
//           Please refer to the RedwoodJS Testing Docs:
//       https://redwoodjs.com/docs/testing#testing-services
// https://redwoodjs.com/docs/testing#jest-expect-type-considerations

describe('subjects', () => {
  scenario('returns all subjects', async (scenario: StandardScenario) => {
    const result = await subjects()

    expect(result.length).toEqual(Object.keys(scenario.subject).length)
  })

  scenario('returns a single subject', async (scenario: StandardScenario) => {
    const result = await subject({ id: scenario.subject.one.id })

    expect(result).toEqual(scenario.subject.one)
  })

  scenario('creates a subject', async (scenario: StandardScenario) => {
    const result = await createSubject({
      input: {
        teacherId: scenario.subject.two.teacherId,
        subjectName: 'String',
      },
    })

    expect(result.teacherId).toEqual(scenario.subject.two.teacherId)
    expect(result.subjectName).toEqual('String')
  })

  scenario('updates a subject', async (scenario: StandardScenario) => {
    const original = (await subject({ id: scenario.subject.one.id })) as Subject
    const result = await updateSubject({
      id: original.id,
      input: { subjectName: 'String2' },
    })

    expect(result.subjectName).toEqual('String2')
  })

  scenario('deletes a subject', async (scenario: StandardScenario) => {
    const original = (await deleteSubject({
      id: scenario.subject.one.id,
    })) as Subject
    const result = await subject({ id: original.id })

    expect(result).toEqual(null)
  })
})
