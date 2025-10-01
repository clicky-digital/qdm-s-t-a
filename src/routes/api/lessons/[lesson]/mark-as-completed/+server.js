import {json} from '@sveltejs/kit';
import { URL_BASE_API } from '$env/static/private';

export async function POST({ cookies, request, params }) {
    const accessToken = cookies.get('access_token');
    const tokenType = cookies.get('token_type');

    if (!accessToken) {
        return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const backendUrl = `${URL_BASE_API}/api/v1/lessons/${params.lesson}/mark-as-completed`;

    const apiResponse = await fetch(backendUrl, {
        method: 'POST',
        body: await request.text(),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${tokenType} ${accessToken}`,
        },
    });

    const responseText = await apiResponse.text();
    try {
        return json(JSON.parse(responseText), { status: apiResponse.status });
    } catch (e) {
        return new Response(responseText, { status: apiResponse.status });
    }
}