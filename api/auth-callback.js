// import axios from "axios/dist/node/axios.cjs";

// export default async (req, res) => {
//   const { query } = req;
//   const code = query.code;

//   if (!code) {
//     console.error("No code provided in query params");
//     return res.status(400).send("No code provided");
//   }

//   const APP_ID = process.env.APP_ID;
//   const APP_SECRET = process.env.APP_SECRET;
//   const REDIRECT_URI =
//     "https://threads-backend-nine.vercel.app/api/auth-callback";
//   const GRAPH_API_VERSION = "v1.0";

//   try {
//     const tokenUrl = `https://graph.threads.net/${GRAPH_API_VERSION}/oauth/access_token`;
//     const data = new URLSearchParams({
//       client_id: APP_ID,
//       client_secret: APP_SECRET,
//       redirect_uri: REDIRECT_URI,
//       code: code,
//       grant_type: "authorization_code",
//     }).toString();

//     const tokenResponse = await axios.post(tokenUrl, data, {
//       headers: { "Content-Type": "application/x-www-form-urlencoded" },
//     });

//     const { access_token } = tokenResponse.data;

//     if (!access_token) {
//       console.error("No access token returned:", tokenResponse.data);
//       return res.status(500).send("Failed to retrieve access token");
//     }

//     console.log("Access Token:", access_token);

//     const APP_SCHEME = "myapp://redirect";
//     return res.redirect(
//       `${APP_SCHEME}?token=${encodeURIComponent(access_token)}`
//     );
//   } catch (error) {
//     console.error(
//       "Error exchanging code for token:",
//       error.response?.data || error.message
//     );
//     return res.status(500).send("Failed to exchange code for token");
//   }
// };

import axios from "axios/dist/node/axios.cjs";

export default async (req, res) => {
  console.log("Received a request on auth-callback endpoint");
  const { query } = req;
  const code = query.code;

  // Log incoming query parameters
  console.log("Query Parameters:", query);

  if (!code) {
    console.error("No code provided in query params");
    return res.status(400).send("No code provided");
  }

  const APP_ID = process.env.APP_ID;
  const APP_SECRET = process.env.APP_SECRET;
  const REDIRECT_URI =
    "https://threads-backend-nine.vercel.app/api/auth-callback";
  const GRAPH_API_VERSION = "v1.0";

  // Log environment variables (mask sensitive data)
  console.log("Environment Variables:");
  console.log("APP_ID:", APP_ID);
  console.log("APP_SECRET:", APP_SECRET ? "***HIDDEN***" : "NOT SET");
  console.log("REDIRECT_URI:", REDIRECT_URI);

  try {
    // Log token exchange URL and payload
    const tokenUrl = `https://graph.threads.net/${GRAPH_API_VERSION}/oauth/access_token`;
    console.log("Token URL:", tokenUrl);

    const data = new URLSearchParams({
      client_id: APP_ID,
      client_secret: APP_SECRET,
      redirect_uri: REDIRECT_URI,
      code: code,
      grant_type: "authorization_code",
    }).toString();

    console.log("Token exchange payload:", data);

    const tokenResponse = await axios.post(tokenUrl, data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Log the full response from the token exchange
    console.log("Token Response Data:", tokenResponse.data);

    const { access_token } = tokenResponse.data;

    if (!access_token) {
      console.error("No access token returned:", tokenResponse.data);
      return res.status(500).send("Failed to retrieve access token");
    }

    // Log the retrieved access token
    console.log("Access Token:", access_token);

    // Log the redirect URL
    const APP_SCHEME = "myapp://redirect";
    const redirectUrl = `${APP_SCHEME}?token=${encodeURIComponent(
      access_token
    )}`;
    console.log("Redirecting to:", redirectUrl);

    return res.redirect(redirectUrl);
  } catch (error) {
    // Log the error in detail
    console.error(
      "Error exchanging code for token:",
      error.response?.data || error.message
    );
    if (error.response) {
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    }
    return res.status(500).send("Failed to exchange code for token");
  }
};
