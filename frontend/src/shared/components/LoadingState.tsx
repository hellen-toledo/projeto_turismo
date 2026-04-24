interface LoadingStateProps {
  label: string;
}

export const LoadingState = ({ label }: LoadingStateProps) => {
  return (
    <div
      className="rounded-2xl border border-gray-100 bg-white p-10 text-center text-gray-500"
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />
      <p className="italic">{label}</p>
    </div>
  );
};
