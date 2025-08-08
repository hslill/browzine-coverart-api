module.exports = async function handler(req, res) {
  const { issn } = req.query;
  const apiKey = process.env.BROWZINE_API_KEY || "0a8115ed-3148-4291-8c79-54466fabdc3e";

  console.log("BROWZINE_API_KEY:", apiKey ? 'set' : 'NOT SET');

  if (!issn) {
    return res.status(400).json({ error: "Missing 'issn' query parameter" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  const apiUrl = `https://public-api.thirdiron.com/public/v1/libraries/3820/search?issns=${encodeURIComponent(issn)}`;
  console.log(`Fetching URL: ${apiUrl}`);
  console.log(`Authorization header: Bearer ${apiKey}`);

  try {
    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API response error:', errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    console.log('API response data:', data);
    res.status(200).json(data);

  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
};
