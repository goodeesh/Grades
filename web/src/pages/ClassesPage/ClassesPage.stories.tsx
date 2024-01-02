import type { Meta, StoryObj } from '@storybook/react'

import ClassesPage from './ClassesPage'

const meta: Meta<typeof ClassesPage> = {
  component: ClassesPage,
}

export default meta

type Story = StoryObj<typeof ClassesPage>

export const Primary: Story = {}
