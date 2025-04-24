import { NextResponse } from 'next/server';

export async function GET() {
  // Check environment variables (don't expose full key in production)
  const apiKey = process.env.GEMINI_API_KEY_SERVER;
  
  return NextResponse.json({
    envFound: apiKey ? true : false,
    keyFirstChars: apiKey ? apiKey.substring(0, 5) + '...' : null,
    allEnvKeys: Object.keys(process.env).filter(key => 
      !key.includes('NODE_') && 
      !key.includes('npm_')
    )
  });
} 