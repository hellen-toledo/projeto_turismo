import type { AdminFeedback } from '../../../features/admin/types/admin';

interface FormAlertProps {
  feedback: AdminFeedback | null;
}

export const FormAlert = ({ feedback }: FormAlertProps) => {
  if (!feedback) {
    return null;
  }

  return (
    <div
      className={[
        'rounded-md px-4 py-3 text-sm font-medium',
        feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-700',
      ].join(' ')}
    >
      {feedback.message}
    </div>
  );
};
