// api/auth-callback.js
import axios from "axios";

export default async (req, res) => {
  const { query } = req;
  const code = query.code;

  if (!code) {
    return res.status(400).send("No code provided");
  }

  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;
  const REDIRECT_URI = "https://threadly-one.vercel.app/api/auth-callback"; // your custom scheme redirect
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

    // Return HTML that deep-links back into your app
    const html = `<!DOCTYPE html> <html> <head><title>Redirecting...</title></head> <body> <p>Redirecting back to the app, please wait...</p> <script> window.location = "myapp://redirect?token=${encodeURIComponent(
      access_token
    )}"; </script> </body> </html>`;
    res.setHeader("Content-Type", "text/html; charset=UTF-8");
    return res.status(200).send(html);
  } catch (error) {
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    return res.status(500).send("Failed to exchange code for token");
  }
};
