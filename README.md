# salesforce-node-for-issue

This project is a minimal sample that embeds a fixed access token into `AuthInfo` from `@salesforce/core`, connects to Salesforce, and fetches up to 2,000 `Account` records. You bypass JWT/certificate setup by writing the token and login URL directly into `STATIC_AUTH_INFO` inside `src/index.js`. The workspace name `salesforce-node-for-issue` was prepared for isolating support cases.

> ⚠️ Hard-coded tokens are extremely risky. Use this setup only for learning or troubleshooting, and switch to environment variables or a secret store for any real workload.

## Requirements
- Node.js 18 or newer
- A Salesforce access token (for an org where the user has REST API permission, e.g., a scratch org)

## Run Locally
1. Create a `.env` file (or copy `.env.example`) and set:

	```
	SF_INSTANCE_URL=https://your-instance.my.salesforce.com
	SF_LOGIN_URL=https://login.salesforce.com
	SF_ACCESS_TOKEN=replace-with-your-token
	```

2. Install dependencies.

	```bash
	npm install
	```

3. Run the script.

	```bash
	npm start
	```

4. On success, the console prints:
   - Instance URL and the first 20 characters of the token
   - User ID / Org ID from the `identity` API response
   - Number of `Account` records retrieved (up to 2,000)

## Run with Docker

The root-level `Dockerfile` builds the app on top of Node.js 18. Ensure the `.env` file with the three variables exists before building; the values are copied into the image at build time, so avoid baking real tokens into distributable images.

```bash
docker build -t salesforce-node-for-issue .
docker run --rm salesforce-node-for-issue
```

Console output matches the local run. Handle tokens carefully and never share prebuilt images that contain secrets.

## Common Errors
- `Must pass a username...`: `STATIC_AUTH_INFO.username` is missing when passed to `AuthInfo.create`. Fix `src/index.js`.
- `INVALID_SESSION_ID`: The token expired. Obtain a new token and rebuild/rerun.
- `REQUEST_LIMIT_EXCEEDED`: The org hit API limits. Retry later or lower the call frequency.
