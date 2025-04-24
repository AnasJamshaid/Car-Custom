export async function POST(request) {
  const { userInput } = await request.json();

  const apiKey = 'AIzaSyBhrqKD-4T6HbOS4i8lW7jbX5wCxQ__Zh4'; // Replace with your real Gemini API key

  if (!apiKey) {
    return new Response(JSON.stringify({ message: 'API key is missing.' }), { status: 500 });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: userInput }]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
            topK: 40,
            topP: 0.95
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ message: errorText }), { status: response.status });
    }

    const data = await response.json();

    const outputText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response text received';

    return new Response(JSON.stringify({
      candidates: [
        {
          output: outputText
        }
      ]
    }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error contacting Gemini API', error }), { status: 500 });
  }
}
