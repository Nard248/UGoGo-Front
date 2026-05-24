# uGoGo — Backend Issues (for the API team)

Found during a full Playwright test pass on 2026-05-24 (local frontend → Azure backend `ugogo-backend.blackflower-e8d746fa.eastus.azurecontainerapps.io`). For each item the **frontend is already correct** — these require server-side changes.

> **Verification re-run 2026-05-24 14:33 UTC:** ✅ **BE-1, BE-2, BE-3, BE-6 are now FIXED** on the deployed backend and verified end-to-end in the UI (profile save 200, ensure-thread 200, offer notes returned, token includes `is_email_verified`). ⚠️ **BE-4** (category `icon_path`) and **BE-5** (`/users/me` 301) are **still open**, but both are already mitigated on the frontend (MUI category icons; `/users/me/` with slash), so they don't block the app. A new **frontend** bug surfaced once chat was unblocked — see ISSUES.md **C4** (sent message doesn't render until reload).

---

## 🔴 BE-1 — Profile update blocked by CORS (PUT not allowed)  [Critical]

- **Endpoint:** `PUT /users/profile/edit/`
- **Repro:** Log in → My Account → Edit Profile → change a field → Save.
- **Observed:** Browser preflight fails →
  `Access to XMLHttpRequest … blocked by CORS policy: Method PUT is not allowed by Access-Control-Allow-Methods in preflight response.` → `net::ERR_FAILED`. The request never reaches the view.
- **Why it matters:** Frontend (SWA) and backend (Container Apps) are different origins, so this fails in **production** too. This is the user-reported "Fails to update any personal information."
- **Suggested fix:** Add `PUT` (and `PATCH`) to `CORS_ALLOW_METHODS` (django-cors-headers) and confirm the view/router permits `PUT`. Verify `OPTIONS /users/profile/edit/` returns `Access-Control-Allow-Methods` including `PUT`.

## 🔴 BE-2 — Start-chat endpoint returns 500  [Critical]

- **Endpoint:** `POST /api/chat/dm/ensure-thread/`  body `{"other_user_id": 143}`
- **Repro:** Log in as user 144 → Messages → "start new chat" → pick a traveler (user 143).
- **Observed:** **500 Internal Server Error** (generic Django HTML error page). No thread created; UI shows "Failed to create conversation."
- **Why it matters:** Blocks **all** new conversations. Real-time messaging cannot be used at all.
- **Suggested fix:** Check server logs for the traceback. Likely an unhandled exception in thread lookup/creation (e.g., user1/user2 ordering, self/null user, or a missing migration). Should return the existing/created `DirectThread` with 200/201.

## 🔴 BE-3 — Offer `notes` never returned by offer endpoints  [High]

- **Endpoints:** `GET /offers/offers/{id}/`, `GET /offers/my_offers/`
- **Repro:** Create an offer with Notes ("TESTNOTE-12345"), then fetch it back.
- **Observed:** Response omits `notes` entirely (also no `flight_details`). Verified against my offer id=18 created *with* notes — field absent. Returned keys: `id, user_flight, courier_id, status, price, available_weight, available_space, available_dimensions, has_user_request`.
- **Why it matters:** User-reported "notes I wrote … I cannot see." Notes are invisible to everyone, including the owner. Frontend already renders `offerData.notes` when present.
- **Suggested fix:** Add `notes` (and `flight_details`) to the offer retrieve/list serializer.

## 🔴 BE-4 — Category `icon_path` values are not resolvable URLs  [High]

- **Endpoint:** `GET /items/get_all_categories/`
- **Observed:** `icon_path` are bare filenames: `default_icon.svg`, `documents_icon.svg`, `gifts_icon.svg`, `electronics_icon.svg`, `health_icon.svg`, `other_icon.svg`. They don't resolve to any served asset → `<img>` fails → frontend falls back to a single (shirt-like) icon. User-reported "All have shirt icons."
- **Suggested fix:** Return absolute URLs to actual served icon assets (e.g., blob storage like the airport images), or drop `icon_path` and let the frontend map icons (frontend mitigation added in parallel).
- **Minor:** category name typo `"electronic devies"` → `"electronic devices"`.

## 🟡 BE-5 — `/users/me` 301 redirect drops Authorization  [Medium]

- **Endpoint:** `GET /users/me` → 301 → `/users/me/` (Django `APPEND_SLASH`). The followed redirect was observed **without** the `Authorization` header.
- **Why it matters:** Contributed to the frontend failing to persist `user_id` on cold login (frontend now calls `/users/me/` directly and also derives `user_id` from the JWT, so this is de-risked client-side).
- **Suggested fix:** Optional — ensure clients hit `/users/me/`; consider not requiring the trailing-slash redirect for API routes.

## 🟡 BE-6 — `/users/token/` response omits email-verification flag (and shape looks inconsistent)  [Medium]

- **Endpoint:** `POST /users/token/`
- **Observed:** Response is `{ refresh, access, user: { id, email, first_name, last_name, full_name, profile_picture_url } }` — **no `isEmailVerified`/`is_email_verified` field**. The same credentials sometimes appeared to route to `/` and sometimes to `/email-verification` across the session, suggesting **different Azure replicas return different response shapes** (deployment drift).
- **Why it matters:** The frontend used to gate on `data.isEmailVerified` (absent) → verified users were sent to email verification. Frontend now uses `/users/me`'s `is_email_verified` instead, but the token response should be consistent.
- **Suggested fix:** Include `is_email_verified` in the token response (or document that clients must read it from `/users/me`), and ensure all replicas run the same build.

## Minor / data
- City `city_name: "Paris_"` (trailing underscore) and `city_code: "PRS_"` appear in airport data → renders as "Paris_, France" in the UI.
