import type { Meta, StoryObj } from '@storybook/react'

import ClassPage from './ClassPage'

const meta: Meta<typeof ClassPage> = {
  component: ClassPage,
}

export default meta

type Story = StoryObj<typeof ClassPage>

export const Primary: Story = {}
