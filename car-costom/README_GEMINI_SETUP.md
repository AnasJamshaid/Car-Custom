# Setting up Google Gemini Chatbot

This project includes a Google Gemini AI chatbot integration. Follow these steps to set it up properly:

## 1. Get a Google Gemini API Key

1. Visit the [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account
2. Navigate to the API keys section (typically found in settings or developer section)
3. Create a new API key for the Gemini API
4. Copy your API key to use in the next step

## 2. Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following content:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

Replace `your_gemini_api_key_here` with the actual API key you obtained in step 1.

## 3. Restart Your Development Server

If your development server is already running, restart it to load the new environment variables:

```
npm run dev
```

## 4. Customize the Chatbot (Optional)

If you want to customize the chatbot's appearance or behavior, you can modify the `components/GeminiChatbot.tsx` file. Some ideas:

- Change the initial greeting message
- Adjust the UI colors to match your brand
- Add context about your specific car customization options
- Implement chat history persistence

## Troubleshooting

If you encounter issues with the chatbot:

1. Check that your API key is correctly set in the `.env.local` file
2. Ensure your API key has the correct permissions
3. Check the browser console for any error messages
4. Verify that you're not hitting API rate limits

## Security Considerations

- Never commit your `.env.local` file to version control
- Consider implementing rate limiting for production use
- For a production application, you may want to proxy API requests through your backend instead of making direct client-side API calls 