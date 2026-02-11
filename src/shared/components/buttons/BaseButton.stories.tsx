import type { Meta, StoryObj } from '@storybook/react-vite';
import BaseButton from './BaseButton';

const meta = {
  title: 'Components/Buttons/BaseButton',
  component: BaseButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['small', 'medium', 'large', 'custom'],
    },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'ghost'],
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof BaseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '버튼',
    variant: 'primary',
    size: 'medium',
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <BaseButton variant="primary" text="Primary Button" />
      <BaseButton variant="secondary" text="Secondary Button" />
      <BaseButton variant="outline" text="Outline Button" />
      <BaseButton variant="ghost" text="Ghost Button" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4 items-start">
      <BaseButton size="small" text="Small Button" />
      <BaseButton size="medium" text="Medium Button" />
      <BaseButton size="large" text="Large Button" />
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <BaseButton text="Normal Button" />
      <BaseButton text="Loading Button" loading />
      <BaseButton text="Disabled Button" disabled />
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div className="w-[320px]">
      <BaseButton text="Full Width Button" fullWidth />
    </div>
  ),
};
