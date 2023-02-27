export const getLinkedinURL = (from) => {
  const rootUrl = `https://www.linkedin.com/oauth/v2/authorization`;

  const options = {
    redirect_uri: process.env.REACT_APP_LINKEDIN_CLIENT_REDIRECT_URL,
    client_id: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
    response_type: "code",
    scope: "r_emailaddress r_liteprofile",
    state: "/",
  };

  console.log("OPTIONS: ", options)


  const qs = new URLSearchParams(options);

  return `${rootUrl}?${qs.toString()}`;
};
