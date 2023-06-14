export const decodeJWT = (accessToken: string) => {
  return JSON.parse(window.atob(accessToken.split('.')[1]));
};
