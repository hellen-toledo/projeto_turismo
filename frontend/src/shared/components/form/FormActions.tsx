import type { PropsWithChildren } from 'react';

interface FormActionsProps extends PropsWithChildren {
  align?: 'start' | 'end';
}

export const FormActions = ({ align = 'end', children }: FormActionsProps) => {
  return <div className={`flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center ${align === 'end' ? 'sm:justify-end' : 'sm:justify-start'}`}>{children}</div>;
};
