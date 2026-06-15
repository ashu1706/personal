# Security Specification for Anniversary Invitation Builder

## 1. Data Invariants
1. **RSVP Invariant**: Any RSVP submitted must have `name` and `attending` marked, with an optional short note.
2. **Guestbook Invariant**: Guestbook entries must contain a `name`, `message` under 1000 characters, a valid `avatar` emoji, and a matching stamp.
3. **Moments Invariant**: Moments are the photo stream. Modifying moments requires authentication or special system settings.
4. **Settings Invariant**: Global invitation titles and locations require authentication, preventing random users from altering the coordinates of the restaurant.

---

## 2. The "Dirty Dozen" Payloads (Vulnerability Scenarios)
1. **Malicious RSVP (No Name)**: Creating an anonymous RSVP with an empty name.
2. **Spam RSVP (Huge Note)**: Creating an RSVP with a 2MB script/text payload.
3. **Modified RSVP Timestamp**: Setting `createdAt` to a future date instead of the server time.
4. **Malicious Guestbook (Junk Stamp)**: Posting with an invalid stamp state.
5. **Guestbook SQL/XSS Message**: Posting a malicious script content inside the `message` field.
6. **Guestbook Too Large**: Post text with a length over 2000 characters to saturate memory.
7. **Moment Hijacking (No Auth)**: Creating or deleting a central photo moment without being authenticated.
8. **Malicious Image URLs**: Submitting non-HTTPS urls or giant 1MB strings in place of photo URLs.
9. **Global Settings Poisoning**: Editing restaurant address to malicious redirects or junk.
10. **Target ID Escape**: Submitting a document ID with recursive character nesting `../` or exceeding 128 chars.
11. **Anonymously Deleting Guestbook Entries**: Attempting to clear the romantic guestbook board.
12. **Unauthenticated Admin Claim**: Attempting to bypass the settings locks.

---

## 3. Test Cases (TDD Blueprint)
We provide mock validation conditions inside our security rules.
Let's write a rules definition file!
