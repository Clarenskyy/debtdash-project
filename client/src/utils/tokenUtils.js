import { jwtDecode } from "jwt-decode";

function getTokenInfo() {
  const token = localStorage.getItem("token");
  let userId = localStorage.getItem("userId");

  if (!token) {
    return null;
  } else {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp <= currentTime) {
        localStorage.removeItem("token");
        return null;
      } else {
        userId = decodedToken.id;
        localStorage.setItem("userId", userId);
        return { userId, token };
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      return null;
    }
  }
}

export default getTokenInfo;
