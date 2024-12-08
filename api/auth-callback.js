export default async (req, res) => {
  const { query } = req;
  const code = query.code;

  if (!code) {
    console.error("No code provided in query params");
    return res.status(400).send("No code provided");
  }

  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;
  const REDIRECT_URI =
    "https://threads-backend-nine.vercel.app/api/auth-callback";
  const GRAPH_API_VERSION = "v17.0";

  try {
    const tokenUrl = `https://graph.facebook.com/${GRAPH_API_VERSION}/oauth/access_token`;
    const data = new URLSearchParams({
      client_id: APP_ID,
      client_secret: APP_SECRET,
      redirect_uri: REDIRECT_URI,
      code: code,
      grant_type: "authorization_code",
    }).toString();

    const tokenResponse = await axios.post(tokenUrl, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      console.error("No access token returned:", tokenResponse.data);
      return res.status(500).send("Failed to retrieve access token");
    }

    console.log("Access Token:", access_token);

    const APP_SCHEME = "threadsapp://redirect";
    return res.redirect(
      `${APP_SCHEME}?token=${encodeURIComponent(access_token)}`
    );
  } catch (error) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    return res.status(500).send("Failed to exchange code for token");
  }
};
