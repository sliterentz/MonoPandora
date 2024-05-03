import type { Meta, StoryObj } from '@storybook/react';
import { Ui } from './ui';

import { within } from '@storybook/testing-library';
import { expect } from '@storybook/jest';

const meta: Meta<typeof Ui> = {
  component: Ui,
  title: 'Ui',
};
export default meta;
type Story = StoryObj<typeof Ui>;

export const Primary = {
  args: {},
};

export const Heading: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByText(/Welcome to Ui!/gi)).toBeTruthy();
  },
};
