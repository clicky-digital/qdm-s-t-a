import { json } from '@sveltejs/kit';
import { URL_BASE_API } from '$env/static/private';

export async function POST({ cookies, request, params }) {
    const accessToken = cookies.get('access_token');
    const tokenType = cookies.get('token_type');

    if (!accessToken) {
        return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    const apiResponse = await fetch(URL_BASE_API + `/api/v1/download/${body.filename}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    const responseText = await apiResponse.text();

    if (!apiResponse.ok) {
        return json({ error: 'API request failed', details: responseText }, { status: apiResponse.status });
    }

    try {
        return json(JSON.parse(responseText));
    } catch (e) {
        return new Response(responseText);
    }
}
