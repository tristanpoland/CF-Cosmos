import { dev } from '$app/environment';
import { redirect } from '@sveltejs/kit';

const PUBLIC_PATHS = ['/login', '/forgot-password'];

export async function handle({ event, resolve }) {
    const sessionToken = event.cookies.get('cf_token');
    const path = event.url.pathname;

    // Allow public paths and API routes
    if (PUBLIC_PATHS.includes(path) || path.startsWith('/api')) {
        return await resolve(event);
    }

    // Skip auth check in dev mode
    if (dev) {
        return await resolve(event);
    }

    // Check authentication
    if (!sessionToken) {
        throw redirect(303, '/login');
    }

    try {
        // Verify token with CF API
        const response = await fetch(`${CF_API_URL}/v3/profile`, {
            headers: {
                'Authorization': `Bearer ${sessionToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Invalid token');
        }

        const user = await response.json();
        event.locals.user = user;
    } catch (error) {
        // Clear invalid token
        event.cookies.delete('cf_token');
        throw redirect(303, '/login');
    }

    return await resolve(event);
}

// Handle errors gracefully
export function handleError({ error, event }) {
    return {
        message: error.message ?? 'An unexpected error occurred',
        code: error?.code ?? 'UNKNOWN'
    };
}