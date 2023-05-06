// import { createNextApiHandler } from "@trpc/server/adapters/next";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { env } from "~/env.mjs";
import { createInnerTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import type { NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";

// export API handler
const handler = async (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    createContext: () => {
      const auth = getAuth(req);
      return createInnerTRPCContext({ auth });
    },
    req,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  });

export const config = {
  runtime: "edge",
};

export default handler;
