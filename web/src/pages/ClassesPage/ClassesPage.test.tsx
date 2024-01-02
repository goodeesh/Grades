import { render } from '@redwoodjs/testing/web'

import ClassesPage from './ClassesPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ClassesPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ClassesPage />)
    }).not.toThrow()
  })
})
