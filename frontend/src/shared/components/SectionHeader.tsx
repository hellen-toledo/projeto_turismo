import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export const SectionHeader = ({ title, description, actionLabel, actionTo }: SectionHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">{title}</h2>
        {description ? <p className="mt-2 text-lg text-gray-400">{description}</p> : null}
      </div>

      {actionLabel && actionTo ? (
        <Link
          to={actionTo}
          className="group inline-flex items-center font-semibold text-green-500 transition-colors hover:text-green-400"
        >
          {actionLabel}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      ) : null}
    </div>
  );
};
