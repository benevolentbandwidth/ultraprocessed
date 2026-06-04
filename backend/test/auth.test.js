const test = require("node:test");
const assert = require("node:assert/strict");
const { createAuthHelpers } = require("../src/auth");

function mockRequest(headers = {}) {
  return {
    get(name) {
      return headers[name.toLowerCase()] ?? headers[name] ?? undefined;
    },
  };
}

test("allows bearer token when configured", () => {
  const { isAuthorized } = createAuthHelpers({
    bootstrapAuthToken: "secret-token",
    androidPackageName: "com.b2.ultraprocessed",
    nodeEnv: "production",
  });

  assert.equal(
    isAuthorized(mockRequest({ authorization: "Bearer secret-token" })),
    true,
  );
  assert.equal(isAuthorized(mockRequest({ authorization: "Bearer wrong" })), false);
});

test("allows missing package header", () => {
  const { isAllowedAndroidClient } = createAuthHelpers({
    bootstrapAuthToken: "secret-token",
    androidPackageName: "com.b2.ultraprocessed",
    nodeEnv: "production",
  });

  assert.equal(isAllowedAndroidClient(mockRequest()), true);
});

test("rejects mismatched package header", () => {
  const { isAllowedAndroidClient } = createAuthHelpers({
    bootstrapAuthToken: "secret-token",
    androidPackageName: "com.b2.ultraprocessed",
    nodeEnv: "production",
  });

  assert.equal(
    isAllowedAndroidClient(mockRequest({ "x-android-package": "com.example.app" })),
    false,
  );
});
