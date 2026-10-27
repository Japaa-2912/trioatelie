export default function StoreLoading() {
  return (
    <div className="container-page py-10 md:py-14" aria-busy="true">
      <p className="sr-only">Carregando conteúdo…</p>
      <div className="h-3 w-24 animate-pulse rounded-full bg-line" />
      <div className="mt-6 h-10 w-2/3 max-w-xl animate-pulse rounded-2xl bg-ivory" />
      <div className="mt-4 h-4 w-1/2 max-w-md animate-pulse rounded-full bg-ivory" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="overflow-hidden rounded-[1.4rem] border border-line/70 bg-ivory"
          >
            <div className="aspect-[4/5] animate-pulse bg-cream" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded-full bg-cream" />
              <div className="h-3 w-1/2 animate-pulse rounded-full bg-cream" />
              <div className="h-9 w-full animate-pulse rounded-full bg-cream" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
