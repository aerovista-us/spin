# SPIN identity integration

Verified against NXCore AVCC worktree avcc-welcome-finance-acceptance-20261113, commit 1fd73c2, docs/AEROCORE_APP_ADAPTER_V0.md and APP_ADAPTER_SERVICES.md. Package @aerovista-us/app-adapter v0.4.0. Verify current release before installation.

## Deployment
Guest static GitHub Pages remains available. Proposed authenticated origin: https://spin.aerocoreos.com (not provisioned). Register client_id spin and exact approved callback with Account and Identity Gateway. Provide same-origin backend; do not expose service HMAC credentials or directly call AVCC internal APIs from browser.

## Implementation contract
Browser uses auth.beginLogin, beginRegistration, parseCallback, completeLogin, session, logout and identity.me. Server uses auth.exchangeHandoff, resolveSession, revokeSession, identity.describe and identity.can. Follow package's actual signatures; do not infer endpoint URLs. Backend owns account-scoped preferences and nontransferable cosmetic collections. No real-money wagering, purchases of credits, cash redemption, or conversion of spin results into external entitlements. Guest credits remain local and untrusted. Registry/audit service calls require separately approved grants.

## Acceptance gates
- Verify current adapter package distribution and exact API signatures.
- Register client and service admission with least privilege; provision secrets server-side only.
- Test guest mode, login, registration, state mismatch, callback replay, wrong audience, expired/revoked sessions, logout, CSRF and cross-account denial.
- Verify authenticated preferences remain isolated from guest state and other accounts.
- Verify no browser-controlled result grants external value.
- Verify AVCC registry/health evidence and rollback before release.

Status: contract discovery complete; backend, credentials, registration and runtime acceptance pending.
