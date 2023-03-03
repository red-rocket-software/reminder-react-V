export const getGoogleURL = (from) => {
  const rootUrl = `https://accounts.google.com/o/oauth2/v2/auth`;

  const options = {
    redirect_uri: process.env.REACT_APP_GOOGLE_CLIENT_REDIRECT_URL,
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" "),
    access_type: "offline",
    response_type: "code",
    prompt: "consent",
    state: "/",
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
