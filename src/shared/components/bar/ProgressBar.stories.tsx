import type { Meta, StoryObj } from '@storybook/react-vite';
import ProgressBar from './ProgressBar';

const meta = {
  title: 'Components/Bar/ProgressBar',
  component: ProgressBar,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    percentage: {
      control: {
        type: 'range',
        min: 0,
        max: 100,
        step: 1,
      },
    },
    'aria-label': {
      control: 'text',
      description: '접근성을 위한 라벨. 스크린 리더가 읽을 텍스트입니다.',
    },
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    percentage: 50,
  },
};

export const Zero: Story = {
  args: {
    percentage: 0,
  },
};

export const Quarter: Story = {
  args: {
    percentage: 25,
  },
};

export const Half: Story = {
  args: {
    percentage: 50,
  },
};

export const ThreeQuarters: Story = {
  args: {
    percentage: 75,
  },
};

export const Complete: Story = {
  args: {
    percentage: 100,
  },
};

export const Overflow: Story = {
  args: {
    percentage: 150, // Should be capped at 100
  },
};

export const Negative: Story = {
  args: {
    percentage: -10, // Should be capped at 0
  },
};

export const ProgressStates: Story = {
  args: {
    percentage: 50,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <span className="text-sm">시작 (0%)</span>
        <ProgressBar percentage={0} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm">진행 중 (33%)</span>
        <ProgressBar percentage={33} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm">진행 중 (66%)</span>
        <ProgressBar percentage={66} />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm">완료 (100%)</span>
        <ProgressBar percentage={100} />
      </div>
    </div>
  ),
};
