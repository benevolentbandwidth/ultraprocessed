function createAuthHelpers(config) {
  const bootstrapAuthToken = (config.bootstrapAuthToken || "").trim();
  const androidPackageName = (config.androidPackageName || "").trim();
  const nodeEnv = config.nodeEnv || "development";

  function isAuthorized(req) {
    if (!bootstrapAuthToken) {
      return nodeEnv !== "production";
    }

    const authHeader = (req.get("authorization") || "").trim();
    const bearerToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length).trim()
      : "";
    const headerToken = (req.get("x-bootstrap-token") || "").trim();
    const token = bearerToken || headerToken;

    return token.length > 0 && token === bootstrapAuthToken;
  }

  function isAllowedAndroidClient(req) {
    const packageName = (req.get("x-android-package") || "").trim();
    if (!packageName) {
      return true;
    }
    return packageName === androidPackageName;
  }

  return { isAuthorized, isAllowedAndroidClient };
}

module.exports = { createAuthHelpers };
