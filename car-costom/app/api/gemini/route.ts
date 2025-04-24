import { NextResponse } from 'next/server';

// This API route is no longer needed since the client is making direct API calls to Gemini
// However, we'll keep it for backward compatibility or reference
export async function POST(request) {
  return NextResponse.json(
    { message: "This endpoint is deprecated. The client now makes direct API calls to Gemini." }, 
    { status: 200 }
  );
}
