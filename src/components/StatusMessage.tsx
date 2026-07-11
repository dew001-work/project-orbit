interface StatusMessageProps {
  message: string;
}

export function StatusMessage({ message }: StatusMessageProps) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
      {message}
    </div>
  );
}
