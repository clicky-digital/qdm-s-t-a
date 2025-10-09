import { json } from '@sveltejs/kit';
import { URL_BASE_API } from '$env/static/private';

export async function GET({ cookies }) {
    const accessToken = cookies.get('access_token');
    const tokenType = cookies.get('token_type');


    if (!accessToken) {
        return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const apiResponse = await fetch(URL_BASE_API + "/api/v1/get-all-sell-carrousel", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`,
        },
    });

    if (!apiResponse.ok) {
        const errorData = await apiResponse.text();
        return json({ error: 'API request failed', details: errorData }, { status: apiResponse.status });
    }

    const data = await apiResponse.json();

    const transformedData = data.map(item => ({
        ...item,
        thumbnail: { path: item.thumbnail }
    }));

    return json(transformedData);
}
