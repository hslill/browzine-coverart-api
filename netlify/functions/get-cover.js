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
  const url = `https://public-api.thirdiron.com/public/v1/libraries/3820/journals/issn/${issn}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    });

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
