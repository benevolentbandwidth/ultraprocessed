# Zest Bootstrap API

Small Cloud Run service that returns the default Gemini API key from GCP Secret Manager. The Android app calls this on first launch when the user has not saved their own LLM key.

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Health check for Cloud Run |
| `GET` | `/v1/bootstrap/llm-key` | Returns `{ "apiKey": "..." }` |

### Bootstrap request headers

- `Authorization: Bearer <BOOTSTRAP_AUTH_TOKEN>` or `X-Bootstrap-Token: <BOOTSTRAP_AUTH_TOKEN>`
- Optional: `X-Android-Package: com.b2.ultraprocessed`

## Environment variables

| Variable | Required | Description |
| --- | --- | --- |
| `GCP_PROJECT_ID` | Yes (prod) | GCP project that owns the secret |
| `LLM_SECRET_NAME` | No | Secret Manager name (default: `zest-gemini-default-api-key`) |
| `BOOTSTRAP_AUTH_TOKEN` | Yes (prod) | Shared token the Android app sends on bootstrap requests |
| `ANDROID_PACKAGE_NAME` | No | Expected Android package (default: `com.b2.ultraprocessed`) |
| `DEV_LLM_API_KEY` | Local only | Bypass Secret Manager during local development |
| `PORT` | No | HTTP port (default: `8080`) |

## GCP setup

1. Create the secret:

```bash
gcloud secrets create zest-gemini-default-api-key \
  --replication-policy=automatic

echo -n "AIzaYOUR_KEY" | gcloud secrets versions add zest-gemini-default-api-key --data-file=-
```

2. Deploy to Cloud Run and grant Secret Manager access to the service account:

```bash
gcloud run deploy zest-bootstrap-api \
  --source backend \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars GCP_PROJECT_ID=YOUR_PROJECT_ID,LLM_SECRET_NAME=zest-gemini-default-api-key,BOOTSTRAP_AUTH_TOKEN=YOUR_LONG_RANDOM_TOKEN,ANDROID_PACKAGE_NAME=com.b2.ultraprocessed

gcloud run services describe zest-bootstrap-api --region us-central1 --format='value(spec.template.spec.serviceAccountName)'

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:SERVICE_ACCOUNT_EMAIL" \
  --role="roles/secretmanager.secretAccessor"
```

3. Restrict the Gemini API key in Google AI Studio / GCP Console:
   - Android app restriction
   - Generative Language API only
   - Usage quotas

## Local development

```bash
cd backend
npm install
cp .env.example .env
# Set DEV_LLM_API_KEY for local testing, or use Application Default Credentials for Secret Manager
npm run dev
```

Test:

```bash
curl http://localhost:8080/health
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8080/v1/bootstrap/llm-key
```

Run unit tests:

```bash
npm test
```

## Security notes

- The Gemini key is never committed to git or embedded in the Android APK.
- Production requires `BOOTSTRAP_AUTH_TOKEN`; requests without it are rejected.
- Responses are rate-limited (30 requests/minute per client IP).
- Secret values are cached in memory for 5 minutes to reduce Secret Manager reads.
- Play Integrity can be added later as an additional gate before returning the key.

## Android integration

The app is wired to:

1. Call `GET /v1/bootstrap/llm-key` on cold start when no user LLM key and no cached default exist.
2. Cache the returned key in encrypted storage under `LLM_DEFAULT_API_KEY`.
3. Prefer the user key from Settings (`LLM_API_KEY`) when present.

Add to `local.properties` (gitignored):

```properties
ZEST_LLM_BOOTSTRAP_URL=https://zest-bootstrap-api-XXXX.run.app/v1/bootstrap/llm-key
ZEST_LLM_BOOTSTRAP_AUTH_TOKEN=your-bootstrap-auth-token
```

CI/release builds can inject the same values through environment variables `ZEST_LLM_BOOTSTRAP_URL` and `ZEST_LLM_BOOTSTRAP_AUTH_TOKEN`.

Only the bootstrap URL and auth token are compiled into `BuildConfig`. The Gemini API key itself is never embedded in the APK.
