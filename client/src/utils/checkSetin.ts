import { decodeJwt } from "jose";

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = decodeJwt(token); // decoded is JwtPayload (no string type issue)
    if (!decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};
