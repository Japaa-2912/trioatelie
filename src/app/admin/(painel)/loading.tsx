export default function AdminLoading() {
  return (
    <div className="space-y-6" aria-busy="true">
      <p className="sr-only">Carregando painel…</p>
      <div className="h-3 w-28 animate-pulse rounded-full bg-line" />
      <div className="h-10 w-1/2 max-w-md animate-pulse rounded-xl bg-ivory" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-28 animate-pulse rounded-2xl bg-ivory" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl bg-ivory" />
    </div>
  );
}
