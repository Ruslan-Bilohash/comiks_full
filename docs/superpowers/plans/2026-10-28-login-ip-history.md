# Login IP history — implementation plan

**Goal:** Show an administrator the recent successful sign-ins for a selected user, including encrypted IP address, date, device/browser and sign-in method.

**Constraints:** Keep the anonymous traffic counter IP-free. Store exact login IP only encrypted at rest, never trust forwarded headers, retain 30 days, keep the view admin-only, and erase the history with the account.

## Task 1 — Specify and test the storage contract

- Add `tools/test-login-history.php` before production code.
- Exercise real helpers against SQLite with a deterministic encryption fixture.
- Verify valid `REMOTE_ADDR` capture, no plaintext in the table, method normalization, decryption for the admin view, invalid-IP rejection, and 30-day cleanup.
- Add static assertions for the migration, session hook, admin card and privacy disclosure.

## Task 2 — Store successful sign-ins

- Bump the schema and create `kl_login_history` plus a user/time index.
- Add helpers to validate `REMOTE_ADDR`, normalize method names, encrypt/decrypt with `secret-box.php`, prune old rows and return recent history.
- Call the recorder from `start_session()` so email, password, magic link, TOTP and Google paths are covered.
- Label Google and admin sign-ins where the caller knows the method.
- Delete the history in `delete_user_all()`.

## Task 3 — Display and document

- Add an “Історія входів” card to `admin.php?p=user&id=…` with IP, method, device/browser and time.
- State that this is successful-login security history, encrypted, admin-only and retained for 30 days.
- Add the same disclosure to all language sections of `privacy.html` without changing anonymous analytics claims.

## Task 4 — Verify

- Run the new PHP test, authentication/Google/admin tests, PHP syntax checks and the complete project test command used by the release workflow.
- Build and inspect the generated `dist` files.

