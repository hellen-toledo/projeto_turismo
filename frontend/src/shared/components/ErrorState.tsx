import { Link } from 'react-router-dom';

interface ErrorStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
  onRetry?: () => void;
}

export const ErrorState = ({ title, description, actionLabel, actionTo, onRetry }: ErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-900/50 bg-red-900/10 px-6 py-12 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="mb-4 h-12 w-12 text-red-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h3 className="mb-2 text-xl font-bold text-red-400">{title}</h3>
      <p className="mb-6 max-w-md text-red-300/80">{description}</p>

      {onRetry ? (
        <button
          onClick={onRetry}
          className="rounded-lg bg-red-600/20 px-6 py-2 font-semibold text-red-400 transition-colors hover:bg-red-600/30"
        >
          Tentar Novamente
        </button>
      ) : actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="rounded-lg bg-red-600/20 px-6 py-2 font-semibold text-red-400 transition-colors hover:bg-red-600/30"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};
