interface EmptyStateProps {
  title: string;
  description: string;
}

export const EmptyState = ({ title, description }: EmptyStateProps) => {
  return (
    <div
      className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center"
      role="status"
      aria-live="polite"
    >
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      <p className="mt-2 text-gray-600">{description}</p>
    </div>
  );
};
