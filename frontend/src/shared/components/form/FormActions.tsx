import type { PropsWithChildren } from 'react';

interface FormActionsProps extends PropsWithChildren {
  align?: 'start' | 'end';
}

export const FormActions = ({ align = 'end', children }: FormActionsProps) => {
  return <div className={`flex flex-wrap gap-3 ${align === 'end' ? 'justify-end' : 'justify-start'}`}>{children}</div>;
};
