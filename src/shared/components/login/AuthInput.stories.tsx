import type { Meta, StoryObj } from '@storybook/react-vite';
import React, { useState } from 'react';
import AuthInput from './AuthInput';
import BaseButton from '../buttons/BaseButton';

const meta = {
  title: 'Components/Login/AuthInput',
  component: AuthInput,
  args: {
    onChange: () => {},
  },
  parameters: {
    layout: 'centered',
    viewport: {
      defaultViewport: 'mobile',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'password', 'email'],
    },
    width: {
      control: 'select',
      options: ['full', 'withButton', undefined],
    },
  },
} satisfies Meta<typeof AuthInput>;

export default meta;
type Story = StoryObj<typeof meta>;

// Interactive wrapper component for controlled input
const InteractiveWrapper = (args: React.ComponentProps<typeof AuthInput>) => {
  const [value, setValue] = useState(args.value || '');
  return <AuthInput {...args} value={value} onChange={(e) => setValue(e.target.value)} />;
};

export const Default: Story = {
  render: InteractiveWrapper,
  args: {
    name: 'email',
    label: '이메일',
    placeholder: '이메일을 입력해주세요',
    type: 'text',
    value: '',
  },
};

export const WithLabel: Story = {
  render: InteractiveWrapper,
  args: {
    name: 'username',
    label: '사용자명',
    placeholder: '사용자명을 입력해주세요',
    type: 'text',
    value: '',
  },
};

export const Password: Story = {
  render: InteractiveWrapper,
  args: {
    name: 'password',
    label: '비밀번호',
    placeholder: '비밀번호를 입력해주세요',
    type: 'password',
    value: '',
  },
};

export const Email: Story = {
  render: InteractiveWrapper,
  args: {
    name: 'email',
    label: '이메일',
    placeholder: 'example@email.com',
    type: 'email',
    value: '',
  },
};

export const WithError: Story = {
  render: InteractiveWrapper,
  args: {
    name: 'email',
    label: '이메일',
    placeholder: '이메일을 입력해주세요',
    type: 'email',
    value: 'invalid-email',
    error: '올바른 이메일 형식이 아닙니다',
  },
};

export const WithSuccess: Story = {
  render: InteractiveWrapper,
  args: {
    name: 'email',
    label: '이메일',
    placeholder: '이메일을 입력해주세요',
    type: 'email',
    value: 'valid@email.com',
    success: '사용 가능한 이메일입니다',
  },
};

export const WithButton: Story = {
  args: {
    name: 'code',
    value: '',
    onChange: () => {},
  },
  render: () => {
    const [value, setValue] = useState('');
    return (
      <AuthInput
        name="code"
        label="인증번호"
        placeholder="인증번호를 입력해주세요"
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        width="withButton"
        rightElement={
          <BaseButton size="medium" variant="primary" text="인증" onClick={() => alert('인증 버튼 클릭')} />
        }
      />
    );
  },
};

export const ReadOnly: Story = {
  args: {
    name: 'readonly',
    label: '읽기 전용',
    value: '수정할 수 없는 값',
    readOnly: true,
  },
};

export const GrayBackground: Story = {
  render: InteractiveWrapper,
  args: {
    name: 'graybg',
    label: '회색 배경',
    placeholder: '회색 배경이 적용됩니다',
    type: 'text',
    value: '',
    isGrayBg: true,
  },
};

export const DoubleSpacing: Story = {
  render: InteractiveWrapper,
  args: {
    name: 'double',
    label: '이중 간격',
    placeholder: '더 작은 하단 여백',
    type: 'text',
    value: '',
    isDouble: true,
  },
};
