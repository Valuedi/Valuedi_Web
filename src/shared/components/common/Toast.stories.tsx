import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Toast } from './Toast';
import BaseButton from '../buttons/BaseButton';

const meta = {
  title: 'Components/Common/Toast',
  component: Toast,
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  tags: ['autodocs'],
  argTypes: {
    message: {
      control: 'text',
    },
    isOpen: {
      control: 'boolean',
    },
    autoClose: {
      control: 'boolean',
    },
    autoCloseDelay: {
      control: 'number',
    },
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 토스트 (자동 닫기)
export const Default: Story = {
  args: {
    message: '기본 토스트 메시지입니다.',
    isOpen: true,
    autoClose: true,
    autoCloseDelay: 3000,
  },
};

// 수동 닫기 토스트
export const ManualClose = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative w-full h-screen bg-neutral-5 p-5">
        <div className="space-y-4">
          <BaseButton variant="primary" text="토스트 열기" onClick={() => setIsOpen(true)} />
          <Toast
            message="수동으로 닫을 수 있는 토스트입니다. X 버튼을 클릭하세요."
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            autoClose={false}
          />
        </div>
      </div>
    );
  },
};

// 에러 토스트
export const ErrorToast = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative w-full h-screen bg-neutral-5 p-5">
        <div className="space-y-4">
          <BaseButton variant="primary" text="에러 토스트 열기" onClick={() => setIsOpen(true)} />
          <Toast
            message="연동 해제에 실패했습니다. 다시 시도해주세요."
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            autoClose={false}
          />
        </div>
      </div>
    );
  },
};

// 긴 메시지 토스트
export const LongMessage = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative w-full h-screen bg-neutral-5 p-5">
        <div className="space-y-4">
          <BaseButton variant="primary" text="긴 메시지 토스트 열기" onClick={() => setIsOpen(true)} />
          <Toast
            message="이것은 매우 긴 메시지입니다. 토스트가 여러 줄로 표시되는지 확인할 수 있습니다. 텍스트가 길어도 잘 표시되어야 합니다."
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            autoClose={false}
          />
        </div>
      </div>
    );
  },
};

// 자동 닫기 토스트
export const AutoClose = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div className="relative w-full h-screen bg-neutral-5 p-5">
        <div className="space-y-4">
          <BaseButton variant="primary" text="자동 닫기 토스트 열기 (3초)" onClick={() => setIsOpen(true)} />
          <Toast
            message="3초 후 자동으로 닫힙니다."
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            autoClose={true}
            autoCloseDelay={3000}
          />
        </div>
      </div>
    );
  },
};
