interface LoadingStateProps {
  label?: string;
}

export const LoadingState = ({ label = 'Carregando...' }: LoadingStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-800 border-t-green-500" />
      <p className="mt-4 font-medium text-gray-400">{label}</p>
    </div>
  );
};
