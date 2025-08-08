module.exports = async function handler(req, res) {
  console.log("BROWZINE_API_KEY:", process.env.BROWZINE_API_KEY ? 'set' : 'NOT SET');
  const { issn } = req.query;
  const apiKey = process.env.BROWZINE_API_KEY || "0a8115ed-3148-4291-8c79-54466fabdc3e";

  if (!issn) {
    return res.status(400).json({ error: "Missing 'issn' query parameter" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    const url = `https://public-api.thirdiron.com/public/v1/libraries/3820/search?issns=${encodeURIComponent(issn)}`;
    console.log(`Fetching URL: ${url}`);
    console.log('Authorization header:', `Bearer ${apiKey}`);

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error in handler:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
};
