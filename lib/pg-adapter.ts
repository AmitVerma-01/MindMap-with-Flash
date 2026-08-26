import { PrismaPg } from "@prisma/adapter-pg";

function isLocalHost(hostname: string) {
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
}

/** PrismaPg adapter with SSL suited for managed Postgres (e.g. Aiven). */
export function createPgAdapter(connectionString: string) {
  const url = new URL(connectionString);
  const local = isLocalHost(url.hostname);

  // pg v8 maps sslmode=require to verify-full, which fails on Aiven's CA chain.
  // Strip ssl params from the URL and set SSL explicitly on the adapter.
  url.searchParams.delete("sslmode");
  url.searchParams.delete("ssl");

  return new PrismaPg({
    connectionString: url.toString(),
    ssl: local ? undefined : { rejectUnauthorized: false },
  });
}
