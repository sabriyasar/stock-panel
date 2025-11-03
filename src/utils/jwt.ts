// utils/jwt.ts
export function decodeJWT(token: string | null) {
    if (!token) return null;
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
  
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
          .join("")
      );
  
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Token decode hatası:", e);
      return null;
    }
  }
  