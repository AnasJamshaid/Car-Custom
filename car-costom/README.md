# CARcustom - 3D Car Configurator

A modern, interactive 3D car configurator that lets users customize and view a 3D car model in real-time.

## Features

- Interactive 3D car model visualization
- Real-time color customization
- Performance statistics
- Wheel and body kit options
- Multiple environment settings
- Camera controls
- Google Gemini AI chatbot assistant

## Gemini AI Chatbot Setup

The project includes a Google Gemini AI chatbot that helps users with car customization. To set it up:

1. **Get a Google Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/) and sign in
   - Create a new API key for the Gemini API
   - Copy your API key

2. **Configure Environment:**
   - Create a `.env.local` file in the project root
   - Add: `NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here`
   - Replace with your actual API key

3. **Restart Development Server:**
   - Run `npm run dev` to load the new environment variables

See `README_GEMINI_SETUP.md` for more detailed setup instructions.

## Troubleshooting 3D Model Loading

If you encounter issues with the 3D model loading, here are some steps to resolve them:

### Error: "Error loading model"

This error typically occurs when the application can't load the 3D model file. The app has a built-in fallback system that will:

1. First try to load the primary model (`/models/generic_car.glb`)
2. If that fails, it will try a backup model (`/models/backup/duck.glb`)
3. If both fail, it will display a geometric fallback car

### Solutions:

1. **Check model files:**
   - Ensure `public/models/generic_car.glb` exists and is not corrupted
   - Ensure the backup model `public/models/backup/duck.glb` exists

2. **Check model format:**
   - The GLB file should be a valid GLTF binary format
   - You can validate the model using the [Khronos GLTF Validator](https://github.khronos.org/glTF-Validator/)

3. **Use a different model:**
   - You can replace `generic_car.glb` with any other GLTF/GLB model
   - Update the `modelPath` in `components/car-configurator-3d.tsx`

4. **Debugging:**
   - Check the browser console for more detailed error messages
   - Enable performance stats in the UI to get more information

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## File Structure

- `/components` - React components
- `/public/models` - 3D model files
- `/app` - Next.js app pages
- `/hooks` - Custom React hooks 