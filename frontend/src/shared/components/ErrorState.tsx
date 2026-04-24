import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export const ErrorState = ({
  title,
  description,
  actionLabel = 'Voltar para a home',
  actionTo = '/',
}: ErrorStateProps) => {
  return (
    <div
      className="rounded-2xl border border-red-100 bg-red-50 p-10 text-center"
      role="alert"
      aria-live="assertive"
    >
      <h2 className="text-xl font-semibold text-red-700">{title}</h2>
      <p className="mt-2 text-red-600">{description}</p>
      <Link
        to={actionTo}
        className="mt-6 inline-flex rounded-full bg-red-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-red-700"
      >
        {actionLabel}
      </Link>
    </div>
  );
};
