import type { Meta, StoryObj } from '@storybook/react-vite';
import MbtiCard from './MbtiCard';

// 임시 SVG 아이콘 컴포넌트 (실제 아이콘이 없을 경우를 대비)
const PlaceholderIcon = ({ className }: { className?: string }) => (
  <svg
    width="120"
    height="120"
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="60" cy="60" r="50" stroke="#666666" strokeWidth="2" fill="none" />
    <text x="60" y="65" fontSize="20" fill="#666666" textAnchor="middle">
      MBTI
    </text>
  </svg>
);

const meta = {
  title: 'Components/MBTI/MbtiCard',
  component: MbtiCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: false,
      description: 'MBTI 타입별 아이콘 SVG 컴포넌트',
    },
  },
} satisfies Meta<typeof MbtiCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mbtiType: 'ENFP',
    subDetail: '재기발랄한 활동가',
    description:
      '열정적이고 창의적인 활동가입니다. 새로운 경험과 사람들을 만나는 것을 좋아하며, 항상 긍정적인 에너지로 주변을 밝게 만듭니다.',
    icon: PlaceholderIcon,
  },
};

export const INTJ: Story = {
  args: {
    mbtiType: 'INTJ',
    subDetail: '용의주도한 전략가',
    description:
      '체계적이고 논리적인 사고를 가진 전략가입니다. 장기적인 목표를 세우고 계획을 실행하는데 탁월하며, 독립적으로 일하는 것을 선호합니다.',
    icon: PlaceholderIcon,
  },
};

export const ISFP: Story = {
  args: {
    mbtiType: 'ISFP',
    subDetail: '호기심 많은 예술가',
    description:
      '부드럽고 친절한 성격의 예술가입니다. 아름다움을 추구하고 감성적이며, 개인의 가치관을 중요하게 생각합니다.',
    icon: PlaceholderIcon,
  },
};

export const ESTJ: Story = {
  args: {
    mbtiType: 'ESTJ',
    subDetail: '엄격한 관리자',
    description:
      '체계적이고 조직적인 관리자입니다. 규칙과 질서를 중시하며, 목표 달성을 위해 효율적으로 일하는 것을 좋아합니다.',
    icon: PlaceholderIcon,
  },
};

export const AllTypes: Story = {
  args: {
    mbtiType: 'ENFP',
    subDetail: '재기발랄한 활동가',
    description: '열정적이고 창의적인 활동가입니다.',
    icon: PlaceholderIcon,
  },
  render: () => (
    <div className="flex flex-col gap-8">
      <MbtiCard
        mbtiType="ENFP"
        subDetail="재기발랄한 활동가"
        description="열정적이고 창의적인 활동가입니다. 새로운 경험과 사람들을 만나는 것을 좋아하며, 항상 긍정적인 에너지로 주변을 밝게 만듭니다."
        icon={PlaceholderIcon}
      />
      <MbtiCard
        mbtiType="INTJ"
        subDetail="용의주도한 전략가"
        description="체계적이고 논리적인 사고를 가진 전략가입니다. 장기적인 목표를 세우고 계획을 실행하는데 탁월하며, 독립적으로 일하는 것을 선호합니다."
        icon={PlaceholderIcon}
      />
      <MbtiCard
        mbtiType="ISFP"
        subDetail="호기심 많은 예술가"
        description="부드럽고 친절한 성격의 예술가입니다. 아름다움을 추구하고 감성적이며, 개인의 가치관을 중요하게 생각합니다."
        icon={PlaceholderIcon}
      />
    </div>
  ),
};
