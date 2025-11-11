// utils/auth.js
export async function authenticateUID(API_URL, uid) {
  if (!uid || !uid.trim()) {
    return { ok: false, status: 400, body: { message: "UID is required", card: null } };
  }

  const url = `${API_URL}/card/authenticate?UID=${encodeURIComponent(uid)}`;
  const res = await fetch(url);
  const body = await res.json().catch(() => ({}));

  // success only when server returned 200 and "Auth OK"
  if (res.ok && body?.message === "Auth OK") {
    return { ok: true, status: res.status, body };
  }
  return { ok: false, status: res.status, body };
}
