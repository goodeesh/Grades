import { render } from '@redwoodjs/testing/web'

import PersistentDrawerLeft from './PersistentDrawerLeft'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('PersistentDrawerLeft', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<PersistentDrawerLeft />)
    }).not.toThrow()
  })
})
