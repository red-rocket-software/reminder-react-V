export const getGithubURL = (from) => {
  const rootUrl = `https://github.com/login/oauth/authorize`;

  const options = {
    redirect_uri: process.env.REACT_APP_GITHUB_CLIENT_REDIRECT_URL,
    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
    scope: "user:email",
    state: "/",
  };

  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
