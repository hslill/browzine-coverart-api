module.exports = async function handler(req, res) {
  console.log("BROWZINE_API_KEY:", process.env.BROWZINE_API_KEY ? 'set' : 'NOT SET');
  const { issn } = req.query;
  const apiKey = "0a8115ed-3148-4291-8c79-54466fabdc3e";

  if (!issn) {
    return res.status(400).json({ error: "Missing 'issn' query parameter" });
  }
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured" });
  }

  try {
    console.log(`Fetching URL: https://public-api.thirdiron.com/public/v1/libraries/3820/search?issns=${encodeURIComponent(issn)}`);
console.log('Authorization header:', `Bearer ${process.env.BROWZINE_API_KEY}`);

const response = await fetch(
  `https://public-api.thirdiron.com/public/v1/libraries/3820/search?issns=${encodeURIComponent(issn)}`,
  {
    headers: { Authorization: `Bearer ${apiKey}` }
  }
);

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Unknown error" });
  }
};
