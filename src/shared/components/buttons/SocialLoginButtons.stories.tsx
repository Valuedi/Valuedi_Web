import type { Meta, StoryObj } from '@storybook/react-vite';
import SocialLoginButtons from './SocialLoginButtons';

const meta = {
  title: 'Components/Buttons/SocialLoginButtons',
  component: SocialLoginButtons,
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'mobile',
    },
  },
  tags: ['autodocs'],
  args: {
    onKakaoClick: () => {},
    onEmailClick: () => {},
  },
} satisfies Meta<typeof SocialLoginButtons>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: '이메일로 계속하기',
  },
};

export const CustomText: Story = {
  args: {
    text: '이메일로 로그인',
  },
};

export const Interactive: Story = {
  args: {
    text: '이메일로 계속하기',
    onKakaoClick: () => alert('카카오 로그인 클릭'),
    onEmailClick: () => alert('이메일 로그인 클릭'),
  },
};
