import React from 'react';
import { toast } from 'sonner';

export const showSuccessToast = ({ message }: { message: string }) => {
  toast.success(message, {
    style: {
      backgroundColor: 'var(--primary)',
      color: 'var(--primary-foreground)',
      boxShadow: '0 0 15px var(--primary)',
    },
  });
};

export const showErrorToast = ({
  message,
  description,
}: {
  message: string;
  description: string;
}) => {
  toast.error(message, {
    style: {
      backgroundColor: 'var(--destructive)',
      color: 'var(--destructive-foreground)',
      boxShadow: '0 0 15px var(--destructive)',
    },
    description: description,
  });
};
