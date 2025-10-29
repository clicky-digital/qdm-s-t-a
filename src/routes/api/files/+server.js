import { json } from '@sveltejs/kit';
import { read } from '$app/server';

export async function POST({ cookies, request, params }) {
    const accessToken = cookies.get('access_token');
    const tokenType = cookies.get('token_type');

    if (!accessToken) {
        return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    const fileResponse = await fetch(body.url);

    return fileResponse;
}
