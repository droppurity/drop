import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Get the refresh token from cookies
    const refresh_token = cookies().get('refresh_token')?.value;

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'No refresh token found in cookies' },
        { status: 401 }
      );
    }

    // Exchange refresh token for new access token
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams(
        Object.entries({
          client_id: process.env.GOOGLE_CLIENT_ID || '',
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          grant_type: 'refresh_token',
          refresh_token: refresh_token,
        })
      ).toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to refresh token' },
        { status: response.status }
      );
    }

    // Update cookies with new tokens
    const { access_token, refresh_token: new_refresh_token } = data;
    
    if (new_refresh_token) {
      cookies().set('refresh_token', new_refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    }

    return NextResponse.json({
      access_token,
      refresh_token: new_refresh_token,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
