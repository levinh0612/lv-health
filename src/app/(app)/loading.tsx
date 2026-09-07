export default function Loading() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-3 w-24 rounded-full bg-paper-dim" />
      <div className="h-8 w-40 rounded-sm bg-paper-dim" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-20 rounded-sm bg-paper-dim" />
        ))}
      </div>
      <div className="h-40 rounded-sm bg-paper-dim" />
    </div>
  );
}
