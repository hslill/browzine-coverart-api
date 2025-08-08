module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { issn } = req.query;
  const apiKey = process.env.BROWZINE_API_KEY || "0a8115ed-3148-4291-8c79-54466fabdc3e";

  if (!issn) {
    return res.status(400).json({ error: "Missing 'issn' query parameter" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  // Remove dashes from ISSN
  const cleanIssn = issn.replace(/-/g, '');

  try {
const url = `https://public-api.thirdiron.com/public/v1/libraries/3820/search?issns=${encodeURIComponent(issn)},${encodeURIComponent(cleanIssn)}`;

    console.log(`Fetching URL: ${url}`);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API error ${response.status}: ${errorText}`);
      // Return error text in json so client sees it
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log('API response data:', JSON.stringify(data));
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
};
