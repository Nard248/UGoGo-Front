# uGoGo — Issue Tracker

Source: `Docs/UGoGo Feedback.pdf`. Status legend: 🔴 Open · 🟡 Verify (possibly fixed by recent commits) · 🟢 Fixed/verified · ⚪ Suggestion (not a bug).

> Note: commit `ecb0b59` touched password visibility, ForgotPassword/ResetPassword error handling, file upload, ChatInput/ChatPage, Courier→Traveler rename, and profile gender field — so several items below need re-verification, not re-implementation.

## Test-pass summary (2026-05-24, full Playwright sweep, both test users)

**Blockers requiring BACKEND fixes (frontend is correct):**
- **A1** — Profile update: `PUT /users/profile/edit/` blocked by CORS (`Access-Control-Allow-Methods` lacks PUT). Fails in prod too.
- **C1** — Start chat: `POST /api/chat/dm/ensure-thread/` returns **500**. Blocks all new conversations (and C3: live messaging untestable).
- **F1** — Offer notes never returned by `/offers/offers/{id}/` or `/my_offers/` (frontend renders them fine).
- **O1** — Category icons: backend `icon_path` are bare filenames that don't resolve → all fall back to shirt icon.

**Frontend bugs (open):**
- **T1** login has no in-flight loading state (worsened by ~28s cold start) · **T2** "Remember me" is dead UI · **T3** `user_id` not persisted after cold login → `getCurrentUserId()=0` (intermittent; breaks chat/ownership) · **F2** pages open scrolled down (body is the scroller, no reset) · **F3** offer cards misalign on long city names · **F4** burger menu shows on desktop · **I2** no phone validation/country code · **T5/T6** minor (dup React key, logged-out 401 calls).

## ✅ Frontend fixes applied & verified this session (2026-05-24)

| ID | Fix | Files | Verified |
|----|-----|-------|----------|
| T3/T4 | Set `user_id` from the access JWT immediately on login (no longer depends on slow/301-prone `/users/me`); `/users/me` → `/users/me/`; `storeUserDetails` also derives id from token | `auth.ts`, `route.ts`, `Login.tsx` | `user_id=144` set immediately after fresh login, no reload |
| T1 | Login button shows "Logging in…" and disables while the request is in flight | `Login.tsx` | button disabled during submit |
| T2 | "Remember me" now controlled + functional: checked→localStorage, unchecked→sessionStorage; defaults checked | `auth.ts` (`setAuthTokens`/`getAccessToken`/…), `api.ts`, `Login.tsx` | checked→localStorage(`auth_persist=1`); unchecked→sessionStorage |
| T7 (new) | Login no longer mis-routes verified users to `/email-verification`. Token response has no `isEmailVerified` field, so routing now uses authoritative `is_email_verified` from `/users/me`, defaulting to allow | `Login.tsx` | verified sender now lands on `/` |
| F2 | `ScrollToTop` resets `document.body.scrollTop` (the real scroll container) on every route change | `App.tsx` | View & Book opened at scrollTop=0 (was 716) |
| F3 | Offer cards fill row height; route names truncate (ellipsis) instead of wrapping → rows/buttons align | `OfferCard.scss` | all 3 cards aligned; long route ellipsized |
| O1 | Distinct MUI icons per category + neutral box fallback (no more shirt) — works regardless of backend `icon_path` | `categoryIcons.tsx`, `Card.tsx`, both category steps | icons distinct & correct on category step |
| I2 | Wizard gate (`validateStep` case 2) now enforces phone & email **format**, not just presence | `ItemAdd.tsx` | code path verified (compiles; gate calls `isValidPhone`/`isValidEmail`) |
| F4 | **FALSE POSITIVE — no fix needed.** Burger is `display:none` on desktop (verified at 1200px). Earlier flag came from a DOM query that also finds hidden buttons; the orange bar was not the burger. | — | `getComputedStyle(.burger-btn).display === 'none'` at 1200px |

> Backend blockers (A1/C1/F1/O1-data + token-response `isEmailVerified`/shape inconsistency) are written up in `Docs/BACKEND_ISSUES.md`. Note: the token endpoint omits any email-verification flag and Azure replicas appear to return inconsistent shapes — see BE additions.

**Already fixed / verified working (no action):** L1 forgot-password, L2 wrong-password error, I1 delete item photo, A2 verification format hint, A3 remove verification file, C2 chat auto-scroll, S4 mandatory photo, OT1 footer typo, S2 public homepage, post-offer wizard, logout.

## Live test findings (Playwright, local dev → Azure backend)

| # | Issue | Severity | Evidence |
|---|-------|----------|----------|
| T1 | Login has **no loading indicator while the request is in flight**; Login button stays active. With Azure cold-start latency (~28s measured on `/users/token/`), the user sees "nothing happens" → likely the true cause of the original "just redirects to same login" report. `setIsLoading(true)` only runs on success path (`Login.tsx:141,147`). | High | 401 took 28163ms; screenshot `test-01-wrong-password.png` taken mid-request showed no feedback |
| T2 | **"Remember me" checkbox is non-functional** — uncontrolled `<input>` at `Login.tsx:243`, not bound to `loginForm.rememberMe`; flag never read. Tokens always persist to localStorage. | Medium | Code review during test |
| L2 (orig) | Wrong-password error message **now displays correctly** ("No active account found with the given credentials") | ✅ Fixed by ecb0b59 | snapshot ref e45 |
| **T3** | **After a fresh login, `user_id` and `user_email` are NOT persisted to localStorage** (only `userDetails` + leftover `email`). Confirmed null right after login; only populated after a manual page reload. `getCurrentUserId()` therefore returns `0`. Breaks `ChatContext` (lines 314/384/409/428/471), `ChatPage:40`, and offer-ownership checks (`SingleProductPage:202`, `SearchResult:114`). **Likely root cause of "chat fails when clicking travelers".** | **Critical** | localStorage dump post-login vs post-reload |
| **T4** | `getUserDetails` calls `/users/me` **without trailing slash** (`route.ts:72`) → backend 301-redirects to `/users/me/`; the followed redirect is sent **without the Authorization header** (req #53). Fragile; contributes to T3. Fix: call `/users/me/`. | High | network reqs 49/52 (301) → 53/54 (200) |
| T1b | Backend cold-start latency: first `/users/token/` took ~28s. Amplifies the T1 "no loading indicator" problem. | Info | req #10 duration 28163ms |
| L1 (orig) | "Forgot password" **now works** — POST `/users/forgot-password/` returns 200, UI shows "Check Your Email" | ✅ Fixed by ecb0b59 | req #9 = 200 |
| T5 | React **duplicate-key warning** on `/offers` ("two children with the same key `1779626111305`") — a ms timestamp is used as a list key and collides. Risk of duplicated/omitted rows. | Low | console on `/offers` after offer create |
| OT1 (orig) | Footer "Truck item" typo **fixed** → now "Track item" | ✅ Fixed | post-offer footer snapshot |
| — | Post-offer wizard (4 steps) works end-to-end; `create_offer` → 201; success toast shown | ✅ Works | req #41 = 201 |
| (data) | Backend category name typo "electronic devies" → "electronic devices" (backend-owned) | Low | get_all_categories body |

## Logging in

| # | Issue | Likely location | Status |
|---|-------|-----------------|--------|
| L1 | "Forgot password" not working | `pages/auth/ForgotPassword.tsx`, `route.ts:24 forgotPassword` | 🟡 |
| L2 | Wrong password silently redirects instead of showing error | `pages/auth/Login.tsx`, `api.ts:27 AUTH_ENDPOINTS` | 🟡 |

## Post an offer

| # | Issue | Likely location | Status |
|---|-------|-----------------|--------|
| O1 | All category icons render as a shirt icon | `postOffer/steps/Step2ItemCategory.tsx`, `components/card/Card.tsx:19` | 🔴 **Confirmed**. Root cause: backend `get_all_categories` returns `icon_path` as bare filenames (`gifts_icon.svg`…) with no URL; they resolve to the SPA's `index.html` (content-type text/html, not an image) → `<img>` decode fails → `onError` fallback to `item.svg`, which is a shirt-like raster. Fix: backend must return absolute icon URLs, OR frontend maps categories to bundled icons + uses a neutral (non-shirt) fallback. |

## Finding an offer

| # | Issue | Likely location | Status |
|---|-------|-----------------|--------|
| F1 | Offer "notes" not visible when viewing from another account | `singleProductPage/SingleProductPage.tsx:325` (frontend OK) + **backend serializer** | 🔴 **Confirmed = BACKEND bug.** Frontend renders `offerData.notes` ("Additional notes from traveler"), but `/offers/offers/{id}/` and `/offers/my_offers/` **omit `notes` entirely** (also no `flight_details`). Verified against my own offer id=18 created with notes "TESTNOTE-12345" → field absent. Fix: backend retrieve/list serializer must include `notes`. |
| F2 | "View & Book" page opens auto-scrolled down | global scroll-reset on route change | 🔴 **Confirmed.** Scroll container is `<body>` (custom overflow), not window. After clicking View & Book, `/offer/1` opened at `body.scrollTop=716`. No scroll reset on navigation. Fix: app-level effect resetting `document.body.scrollTop=0` on route change (must target body, not window). |
| F3 | Offer card formatting inconsistent between cards | `components/offerCard/OfferCard.tsx` + `.scss` | 🔴 **Confirmed.** When city names are long (e.g. "Armenia, Yerevan → USA, New York") the route text wraps to 2 lines, making that card taller, misaligning the plane icon and pushing "View & Book" down vs. single-line cards. Cards don't enforce uniform height. Also data artifact: city "Paris_" (trailing underscore) from backend. |
| F4 | Mobile **burger menu button visible on desktop** width (renders as an empty orange bar) | `layouts/Header` `.burger-btn` CSS | 🔴 New — responsive breakpoint not hiding burger on desktop |

## My items

| # | Issue | Likely location | Status |
|---|-------|-----------------|--------|
| I1 | No way to delete a wrongly uploaded item picture | `itemAdd/steps/Step3ItemImage.tsx:115` | ✅ **Fixed by ecb0b59** — verified live: each uploaded image now has a "Remove image" button that deletes it and revokes the blob URL |
| I2 | No phone-number validation / no country-code indicator | `itemAdd/steps/Step2PickUpPersonDetails.tsx` | 🔴 **Confirmed.** Entered "abcd-not-a-phone-999" → form advanced with no error. No country-code selector (only placeholder hint). |
| S4 (sugg) | Item photo now **mandatory** — `canProceed()` blocks Continue without a picture (`Step3ItemImage.tsx:94`) | ✅ Implemented — but clicking Continue with no photo shows **no error message** (silent no-op); minor UX gap |

## Chat box

| # | Issue | Likely location | Status |
|---|-------|-----------------|--------|
| C1 | Unclear who you can chat with; "fail" when clicking travelers | `api/chat.ts:11`, `stores/ChatContext.tsx:443` (frontend OK) + **backend** | 🔴 **Confirmed = BACKEND bug.** Modal correctly renamed "Select a Traveler" and lists travelers by offer. Clicking one POSTs `{other_user_id:143}` to `/api/chat/dm/ensure-thread/` → **500 Server Error** (Django HTML). Frontend shows toast "Failed to create conversation". Blocks all new conversations. Fix: backend ensure-thread endpoint. |
| C2 | Chat auto-scrolls on send (annoying) | `messages/ChatPage.tsx:176-188` | ✅ **Improved by ecb0b59** — now scrolls only when switching threads or when user is already near bottom (`isNearBottom`), not on every send |
| C3 | Live two-way WebSocket messaging **could not be tested via UI** — blocked by the C1 ensure-thread 500 (no thread can be created) | Blocked | dependent on C1 |
| S6 (sugg) | "Courier" → "Traveler" rename: done in chat modal; verify everywhere else | 🟡 partial | "Select a Traveler" confirmed |

## My account

| # | Issue | Likely location | Status |
|---|-------|-----------------|--------|
| A1 | Fails to update any personal information | `route.ts:173 updateProfile` (PUT) + **backend CORS** | 🔴 **Confirmed = BACKEND CORS bug.** Save → `PUT /users/profile/edit/` blocked at preflight: *"Method PUT is not allowed by Access-Control-Allow-Methods"* → net::ERR_FAILED. Same-origin in prod is false (SWA vs Container Apps) so it fails in production too. Fix: backend must allow PUT in CORS `Access-Control-Allow-Methods` (or accept PATCH/POST & align frontend). Gender dropdown present (ecb0b59). |
| A2 | ID verification: jpeg works, pdf fails (format-specific?) | `profile/ProfileVerification.tsx` | ✅ **Clarified** — UI now explicitly states "JPG, JPEG, PNG LESS THAN 5MB"; pdf intentionally unsupported. (Optional: ensure `<input accept>` blocks pdf selection outright.) |
| A3 | ID verification: no way to remove a wrong file | `profile/ProfileVerification.tsx` (UploadBox) | ✅ **Fixed by ecb0b59** — verified: each upload shows a "Remove file" button that resets the zone |

## Other

| # | Issue | Likely location | Status |
|---|-------|-----------------|--------|
| OT1 | Footer typo: "Truck item" → "Track item" | `layouts/Footer.tsx` | ✅ **Fixed** — footer now reads "Track item" |
| T6 | Logged-out homepage fires **authenticated calls that 401** (`/users/me/` ×2, `/users/profile/picture/`) with no token — console-error noise + wasted requests; on cold backend slows first paint | Low | console on `/` while logged out |
| S2 (sugg) | Homepage before login | ✅ **Addressed** — `/` is public (OpenRoute) and shows hero "Your Journey, Our Delivery" + search + Login/Register |
| — | Logout works — clears all localStorage and redirects to `/login` | ✅ Works | verified |

## Suggestions (not bugs)

| # | Suggestion | Status |
|---|-----------|--------|
| S1 | Password strength indicator / requirements hint | ⚪ |
| S2 | Show homepage/info before forcing login | ⚪ |
| S3 | Show traveler info on "View & Book" to build trust | ⚪ |
| S4 | Make item photo upload mandatory | ⚪ |
| S5 | Pricing too high for heavy items | ⚪ |
| S6 | Stop calling travelers "couriers" everywhere | 🟡 (partially renamed) |
