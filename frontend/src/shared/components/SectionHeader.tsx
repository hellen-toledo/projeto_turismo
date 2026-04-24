import { Link } from 'react-router-dom';

interface SectionHeaderProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export const SectionHeader = ({
  title,
  description,
  actionLabel,
  actionTo,
}: SectionHeaderProps) => {
  return (
    <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        {description ? <p className="mt-1 text-gray-600">{description}</p> : null}
      </div>

      {actionLabel && actionTo ? (
        <Link to={actionTo} className="font-semibold text-green-700 hover:underline">
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
};
