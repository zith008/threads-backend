import axios from "axios/dist/node/axios.cjs";

export default async (req, res) => {
  const { query } = req;
  const code = query.code;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;
  const REDIRECT_URI =
    "https://threads-backend-nine.vercel.app/api/auth-callback"; // Redirect URI registered with Threads API
  const GRAPH_API_VERSION = "v17.0";

  try {
    // Exchange code for access_token
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
      return res.status(500).send("No access token returned from Threads API");
    }

    // Redirect directly to the app with the custom scheme
    const APP_SCHEME = "myapp://redirect"; // Replace 'threadsapp' with your app's custom URI scheme
    const redirectUrl = `${APP_SCHEME}?token=${encodeURIComponent(
      access_token
    )}`;
    return res.redirect(redirectUrl);
  } catch (error) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    return res.status(500).send("Failed to exchange code for token");
  }
};
