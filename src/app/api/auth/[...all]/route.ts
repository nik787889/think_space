export const dynamic = "force-dynamic"; // Ensures no caching of auth requests

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);