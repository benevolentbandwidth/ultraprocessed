const express = require("express");
const rateLimit = require("express-rate-limit");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");
const { createAuthHelpers } = require("./auth");

const PORT = Number(process.env.PORT || 8080);
const GCP_PROJECT_ID = (process.env.GCP_PROJECT_ID || "").trim();
const LLM_SECRET_NAME = (process.env.LLM_SECRET_NAME || "zest-gemini-default-api-key").trim();
const BOOTSTRAP_AUTH_TOKEN = (process.env.BOOTSTRAP_AUTH_TOKEN || "").trim();
const ANDROID_PACKAGE_NAME = (process.env.ANDROID_PACKAGE_NAME || "com.b2.ultraprocessed").trim();
const DEV_LLM_API_KEY = (process.env.DEV_LLM_API_KEY || "").trim();

const secretClient = new SecretManagerServiceClient();
let cachedSecret = null;
let cachedSecretExpiresAt = 0;
const SECRET_CACHE_TTL_MS = 5 * 60 * 1000;

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: "Too many requests. Try again later." },
  }),
);

const { isAuthorized, isAllowedAndroidClient } = createAuthHelpers({
  bootstrapAuthToken: BOOTSTRAP_AUTH_TOKEN,
  androidPackageName: ANDROID_PACKAGE_NAME,
  nodeEnv: process.env.NODE_ENV,
});

async function readLlmApiKeyFromSecretManager() {
  if (!GCP_PROJECT_ID) {
    throw new Error("GCP_PROJECT_ID is not configured.");
  }

  const now = Date.now();
  if (cachedSecret && now < cachedSecretExpiresAt) {
    return cachedSecret;
  }

  const secretVersionName = `projects/${GCP_PROJECT_ID}/secrets/${LLM_SECRET_NAME}/versions/latest`;
  const [version] = await secretClient.accessSecretVersion({ name: secretVersionName });
  const apiKey = version.payload?.data?.toString("utf8").trim();

  if (!apiKey) {
    throw new Error("Secret Manager returned an empty LLM API key.");
  }

  cachedSecret = apiKey;
  cachedSecretExpiresAt = now + SECRET_CACHE_TTL_MS;
  return apiKey;
}

async function resolveDefaultLlmApiKey() {
  if (DEV_LLM_API_KEY) {
    return DEV_LLM_API_KEY;
  }
  return readLlmApiKeyFromSecretManager();
}

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "zest-bootstrap-api",
  });
});

app.get("/v1/bootstrap/llm-key", async (req, res) => {
  if (!isAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized." });
  }

  if (!isAllowedAndroidClient(req)) {
    return res.status(403).json({ error: "Forbidden client." });
  }

  try {
    const apiKey = await resolveDefaultLlmApiKey();
    return res.json({ apiKey });
  } catch (error) {
    console.error("Failed to resolve default LLM API key:", error.message);
    return res.status(503).json({ error: "Bootstrap key is unavailable." });
  }
});

app.use((_req, res) => {
  res.status(404).json({ error: "Not found." });
});

app.listen(PORT, () => {
  console.log(`zest-bootstrap-api listening on port ${PORT}`);
});
