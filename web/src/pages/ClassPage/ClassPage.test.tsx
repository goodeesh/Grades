import { render } from '@redwoodjs/testing/web'

import ClassPage from './ClassPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ClassPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ClassPage />)
    }).not.toThrow()
  })
})
