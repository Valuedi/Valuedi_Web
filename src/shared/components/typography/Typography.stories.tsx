import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from '../typography';

const meta = {
  title: 'Components/Typography',
  component: Typography,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'title-1',
        'title-2',
        'title-3',
        'headline-1',
        'headline-2',
        'headline-3',
        'body-1',
        'body-1-reading',
        'body-2',
        'body-3',
        'caption-1',
        'caption-2',
      ],
    },
    weight: {
      control: 'select',
      options: ['bold', 'medium', 'regular', 'semi-bold'],
    },
    color: {
      control: 'select',
      options: ['title', 'body', 'sub-body', 'disabled'],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Typography 기본 예제',
    variant: 'body-1',
    weight: 'regular',
    color: 'body',
  },
};

export const TitleVariants: Story = {
  args: { children: ' ' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="title-1" weight="bold" color="title">
        Title 1 - Bold
      </Typography>
      <Typography variant="title-2" weight="bold" color="title">
        Title 2 - Bold
      </Typography>
      <Typography variant="title-3" weight="bold" color="title">
        Title 3 - Bold
      </Typography>
    </div>
  ),
};

export const HeadlineVariants: Story = {
  args: { children: ' ' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="headline-1" weight="semi-bold" color="title">
        Headline 1 - Semi Bold
      </Typography>
      <Typography variant="headline-2" weight="semi-bold" color="title">
        Headline 2 - Semi Bold
      </Typography>
      <Typography variant="headline-3" weight="semi-bold" color="title">
        Headline 3 - Semi Bold
      </Typography>
    </div>
  ),
};

export const BodyVariants: Story = {
  args: { children: ' ' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="body-1" weight="regular" color="body">
        Body 1 - Regular: 이것은 본문 텍스트입니다.
      </Typography>
      <Typography variant="body-1-reading" weight="regular" color="body">
        Body 1 Reading - Regular: 이것은 읽기용 본문 텍스트입니다.
      </Typography>
      <Typography variant="body-2" weight="regular" color="body">
        Body 2 - Regular: 이것은 작은 본문 텍스트입니다.
      </Typography>
      <Typography variant="body-3" weight="regular" color="sub-body">
        Body 3 - Regular: 이것은 더 작은 본문 텍스트입니다.
      </Typography>
    </div>
  ),
};

export const CaptionVariants: Story = {
  args: { children: ' ' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="caption-1" weight="medium" color="sub-body">
        Caption 1 - Medium
      </Typography>
      <Typography variant="caption-2" weight="medium" color="sub-body">
        Caption 2 - Medium
      </Typography>
    </div>
  ),
};

export const FontWeights: Story = {
  args: { children: ' ' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="body-1" weight="bold" color="title">
        Bold Weight
      </Typography>
      <Typography variant="body-1" weight="semi-bold" color="title">
        Semi Bold Weight
      </Typography>
      <Typography variant="body-1" weight="medium" color="title">
        Medium Weight
      </Typography>
      <Typography variant="body-1" weight="regular" color="title">
        Regular Weight
      </Typography>
    </div>
  ),
};

export const Colors: Story = {
  args: { children: ' ' },
  render: () => (
    <div className="flex flex-col gap-4">
      <Typography variant="body-1" weight="regular" color="title">
        Title Color
      </Typography>
      <Typography variant="body-1" weight="regular" color="body">
        Body Color
      </Typography>
      <Typography variant="body-1" weight="regular" color="sub-body">
        Sub Body Color
      </Typography>
      <Typography variant="body-1" weight="regular" color="disabled">
        Disabled Color
      </Typography>
    </div>
  ),
};
