import { Button } from "@/components/ui/button";
import { useHealth } from "@/hooks/use-health";

export function DashboardPage() {
  const { data, isPending, isError, error, refetch, isFetching } = useHealth();

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center gap-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">SJA Analytics</h1>
        <p className="text-muted-foreground text-sm">
          Skeleton - the full stack is wired end to end.
        </p>
      </header>

      <section className="rounded-lg border p-4">
        <h2 className="mb-2 text-sm font-medium">API health</h2>

        {isPending && <p className="text-muted-foreground text-sm">Checking…</p>}
        {isError && <p className="text-destructive text-sm">{error.message}</p>}
        {data && (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <dt className="text-muted-foreground">status</dt>
            <dd>{data.status}</dd>
            <dt className="text-muted-foreground">app</dt>
            <dd>{data.app_name}</dd>
            <dt className="text-muted-foreground">env</dt>
            <dd>{data.app_env}</dd>
            <dt className="text-muted-foreground">database</dt>
            <dd>{data.database}</dd>
          </dl>
        )}
      </section>

      <Button onClick={() => refetch()} disabled={isFetching} className="self-start">
        {isFetching ? "Refreshing…" : "Refresh"}
      </Button>
    </main>
  );
}
