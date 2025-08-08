const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const { issn } = event.queryStringParameters;

  if (!issn) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing ISSN parameter" })
    };
  }

  const apiKey = process.env.BROWZINE_API_KEY;
  const libraryId = process.env.BROWZINE_LIBRARY_ID;

  if (!apiKey || !libraryId) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Missing API key or Library ID in environment variables" })
    };
  }

  const url = `https://public-api.thirdiron.com/public/v1/libraries/${libraryId}/journals/issn/${issn.replace('-', '')}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "API error", details: text })
      };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ coverImageUrl: data.coverImageUrl || null })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error", detail: err.message })
    };
  }
};
