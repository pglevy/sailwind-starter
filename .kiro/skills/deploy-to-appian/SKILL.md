---
name: deploy-to-appian
description: >
  Deploy a generated Appian app package to a target environment using the Appian Deployment REST API (v2).
  Handles the full lifecycle: inspect, deploy (with DDL), and poll for results. Use this skill when the
  user says "deploy to Appian", "push this to my Appian environment", "import the app", or "run the
  deployment". Prerequisite: run `generate-appian-app` first.
---

# Deploy to Appian

## Inputs

| Name | Type | Required | Description |
|---|---|---|---|
| `appian_domain` | string | Yes | The Appian environment domain (e.g., `mysite.appiancloud.com`). No protocol prefix. |
| `api_key` | string | Yes | API key linked to a service account with deployment permissions. Created in Admin Console > API Keys. |
| `data_source` | string | No | Name or UUID of the data source for DDL execution. Defaults to `jdbc/Appian`. |
| `package_dir` | string | No | Path to the generated app directory. Defaults to `appian-output/<app-name>/`. |
| `ddl_path` | string | No | Path to the DDL file. Defaults to `appian-output/ddl.sql`. |

## Prerequisites the User Must Complete

Before running this skill, the user needs to set up their Appian environment:

1. **Create a Service Account** in Admin Console > Service Accounts
   - This account will own the deployed objects and be used for API authentication
2. **Create an API Key** in Admin Console > API Keys
   - Link it to the service account created above
   - This key is used for both the deployment API and (optionally) for calling the generated web APIs
3. **Enable the Deployment API** in Admin Console > Infrastructure
   - Ensure "Allow incoming deployments" is enabled
4. **Ensure a data source exists** (e.g., `jdbc/Appian`)
   - The DDL scripts will run against this data source

## Instructions

### Step 1 — Locate and ZIP the package

1. Find the generated app directory at `<package_dir>` (e.g., `appian-output/Task Dashboard/`).
2. ZIP the directory contents into a single `.zip` file. The ZIP should contain the top-level folders (`META-INF/`, `application/`, `recordType/`, `webApi/`, `group/`) directly — not nested inside another folder.
3. Locate the DDL file at `<ddl_path>`.

Use a command like:
```bash
cd appian-output/<app-name> && zip -r ../package.zip . && cd ../..
```

### Step 2 — Inspect the package (recommended)

Before deploying, inspect the package to catch errors early.

```bash
curl --location --request \
POST 'https://<appian_domain>/suite/deployment-management/v2/inspections' \
--header 'Appian-API-Key: <api_key>' \
--form 'json="{
  \"packageFileName\": \"package.zip\"
}"' \
--form 'zipFile=@"appian-output/package.zip"'
```

This returns an inspection UUID. Poll for results:

```bash
curl --location --request \
GET 'https://<appian_domain>/suite/deployment-management/v2/inspections/<inspection_uuid>/' \
--header 'Appian-API-Key: <api_key>'
```

Poll every 5 seconds until `status` is no longer `IN_PROGRESS`.

**If inspection finds errors:** Present them to the user and stop. Do not proceed to deployment.

**If inspection passes (or only warnings):** Proceed to Step 3.

### Step 3 — Deploy the package with DDL

Execute the deployment with the package ZIP and DDL script in a single call:

```bash
curl --location --request \
POST 'https://<appian_domain>/suite/deployment-management/v2/deployments' \
--header 'Appian-API-Key: <api_key>' \
--header 'Action-Type: import' \
--form 'json="{
  \"name\": \"<app_name> - Prototype Deployment\",
  \"description\": \"Generated from Sailwind prototype\",
  \"packageFileName\": \"package.zip\",
  \"dataSource\": \"<data_source>\",
  \"databaseScripts\": [
    {\"fileName\": \"ddl.sql\", \"orderId\": \"1\"}
  ]
}"' \
--form 'packageFileName=@"appian-output/package.zip"' \
--form 'databaseScript1=@"appian-output/ddl.sql"'
```

This returns a deployment UUID.

### Step 4 — Poll for deployment results

```bash
curl --location --request \
GET 'https://<appian_domain>/suite/deployment-management/v2/deployments/<deployment_uuid>/' \
--header 'Appian-API-Key: <api_key>'
```

Poll every 10 seconds until `status` is no longer `IN_PROGRESS`.

**Possible outcomes:**
- `COMPLETED` — everything deployed successfully
- `COMPLETED_WITH_ERRORS` — some objects failed; present the summary
- `FAILED` — deployment failed; present the error details
- `PENDING_REVIEW` — deployment requires manual approval in Appian Designer

### Step 5 — Present results

**On success (`COMPLETED`):**
```
═══════════════════════════════════════════════════════
  Deployment Complete: <app_name>
═══════════════════════════════════════════════════════

  Environment:  <appian_domain>
  Status:       COMPLETED
  Objects:      <imported>/<total> imported
  DB Scripts:   <count> executed

  The app is now live. Next steps:
    1. Open Appian Designer and find the "<app_name>" application
    2. Sync the record types (Designer > Record Types > Sync)
    3. Test the web APIs at:
       https://<appian_domain>/suite/webapi/<alias>
    4. Update VITE_API_BASE in .env and run "connect to Appian"

  Service account note:
    The API key you used for deployment can also be used
    for web API authentication (api_key auth tier).
═══════════════════════════════════════════════════════
```

**On failure:** Present the error details and suggest checking the deployment log:
```bash
curl --location --request \
GET 'https://<appian_domain>/suite/deployment-management/v2/deployments/<uuid>/log/' \
--header 'Appian-API-Key: <api_key>'
```

## Service Account Reuse

The service account created for the deployment API serves double duty:

1. **Deployment:** Authenticates the deployment API calls (this skill)
2. **Web API access:** The same API key can authenticate calls to the generated web APIs when using `api_key` auth tier

This means the user creates one service account and one API key for the entire workflow. The `connect-to-appian` skill can use this same key by setting `VITE_APPIAN_API_KEY` in `.env`.

## Error Handling

| Scenario | Action |
|---|---|
| Package directory not found | Stop; tell user to run `generate-appian-app` first |
| DDL file not found | Warn; deploy without DDL (user can run DDL manually) |
| Inspection finds errors | Stop; present errors; do not deploy |
| Deployment returns `FAILED` | Present error; suggest checking deployment log |
| Deployment returns `PENDING_REVIEW` | Inform user they need to approve in Appian Designer |
| Network/auth error (401, 403) | Check API key and service account permissions |
| Polling timeout (>5 minutes) | Stop polling; provide the deployment UUID for manual checking |

## Reference files

#[[file:gitignore/deployment-api-docs/Deploy_Package_API.md]]
#[[file:gitignore/deployment-api-docs/Inspect_Package_API.md]]
#[[file:gitignore/deployment-api-docs/Get_Deployment_Results_API.md]]
#[[file:gitignore/deployment-api-docs/Deployment_Rest_API.md]]
