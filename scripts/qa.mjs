import { spawn } from "node:child_process";

const site = new URL(process.env.SITE ?? "http://127.0.0.1:3013");
if (site.pathname !== "/") {
  throw new Error("SITE must be an origin without a pathname");
}

const env = {
  ...process.env,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? site.origin,
  SITE: site.origin,
};

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env,
      stdio: "inherit",
    });
    child.once("error", reject);
    child.once("exit", (code, signal) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(
          `${command} ${args.join(" ")} failed ${
            signal ? `with signal ${signal}` : `with exit code ${code}`
          }`,
        ),
      );
    });
  });
}

async function waitForServer() {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${site.origin}/robots.txt`, {
        signal: AbortSignal.timeout(2_000),
      });
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  throw new Error(`Timed out waiting for ${site.origin}`);
}

for (const script of [
  "api:health",
  "qa:backend",
  "typecheck",
  "lint",
  "test",
  "seo",
  "qa:catalog",
  "build",
  "qa:performance",
]) {
  console.log(`\n[qa] npm run ${script}`);
  await run("npm", ["run", script]);
}

if (process.env.QA_EXTERNAL_SERVER === "1") {
  await waitForServer();
  await run("npm", ["run", "qa:seo-runtime"]);
  await run("npm", ["run", "qa:seo-browser"]);
} else {
  const server = spawn(
    "npm",
    [
      "run",
      "start",
      "--",
      "-H",
      site.hostname,
      "-p",
      site.port || (site.protocol === "https:" ? "443" : "80"),
    ],
    {
      env,
      stdio: "inherit",
    },
  );

  let serverExit;
  const exited = new Promise((resolve) => {
    server.once("exit", (code, signal) => {
      serverExit = { code, signal };
      resolve();
    });
  });

  try {
    await Promise.race([
      waitForServer(),
      exited.then(() => {
        throw new Error(
          `Production server exited before becoming ready: ${JSON.stringify(serverExit)}`,
        );
      }),
    ]);
    console.log(`\n[qa] production server ready at ${site.origin}`);
    await run("npm", ["run", "qa:seo-runtime"]);
    await run("npm", ["run", "qa:seo-browser"]);
  } finally {
    if (serverExit === undefined) {
      server.kill("SIGTERM");
      await Promise.race([
        exited,
        new Promise((resolve) => setTimeout(resolve, 5_000)),
      ]);
      if (serverExit === undefined) server.kill("SIGKILL");
    }
  }
}
