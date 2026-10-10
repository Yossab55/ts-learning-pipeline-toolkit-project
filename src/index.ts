/**
 * 🛡️ Backend Pipeline Toolkit
 * Main Entrypoint
 */
import { PipelineRunner } from "./pipeline/runner";
import {
  createRulerGuard,
  createLogger,
  handleUserAction,
} from "./middlewares";
import { createRequestId, createUserId, PipelineContext } from "./types/domain";
import { formatError } from "./errors";
console.log("🛡️ Backend Pipeline Toolkit Initialized!");

const runner = new PipelineRunner();

runner
  .use(createLogger("[PIPELINE]"))
  .use(createRulerGuard(["admin", "moderator"]))
  .use(handleUserAction);

const ctx1: PipelineContext = {
  requestId: createRequestId("1"),
  user: {
    id: createUserId("1"),
    name: "Yossab Samouel",
    role: "admin",
    email: "yos@gamil.com",
  },
  metadata: {
    context: "should be succeed",
  },
};

const ctx2: PipelineContext = {
  requestId: createRequestId("2"),
  user: {
    id: createUserId("2"),
    name: "Ahmad",
    role: "user",
    email: "ah@gamil.com",
  },
  metadata: {
    context: "should be failed",
  },
};

(async function execute(): Promise<void> {
  try {
    await runner.execute(ctx1);
    runner.resetState();
    await runner.execute(ctx2);
  } catch (error) {
    console.log(formatError(error));
  }
})();
