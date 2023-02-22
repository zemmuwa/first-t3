import { createNextApiHandler } from "@trpc/server/adapters/next";

import { env } from "../../../env.mjs";
import { createTRPCContext } from "../../../server/api/trpc";
import { appRouter } from "../../../server/api/root";
import cors from "nextjs-cors";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // Enable cors
  // await cors(req, res, {
  //   methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  //   origin: "*",
  //   optionsSuccessStatus: 200,
  // });
  // Create and call the tRPC handler
  return createNextApiHandler({
    router: appRouter,
    createContext: createTRPCContext,
    onError:
      env.NODE_ENV === "development"
        ? ({ path, error }) => {
            console.error(
              `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
            );
          }
        : undefined,
  })(req, res);
};

export default handler;
// export default createNextApiHandler({
//   router: appRouter,
//   createContext: createTRPCContext,
//   onError:
//     env.NODE_ENV === "development"
//       ? ({ path, error }) => {
//           console.error(
//             `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
//           );
//         }
//       : undefined,
// });
