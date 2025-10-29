import { json } from '@sveltejs/kit';
import { read } from '$app/server';
import a from "/images/logo.png"
import { URL_BASE_API } from '$env/static/private';

export async function POST({ cookies, request, params }) {
    const accessToken = cookies.get('access_token');
    const tokenType = cookies.get('token_type');

    if (!accessToken) {
        return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    // const apiResponse = await fetch(URL_BASE_API + `/api/v1/download/${body.filename}`, {
    //     method: "GET",
    //     headers: {
    //         "Content-Type": "application/json",
    //     },
    // });
    //
    // const response = await apiResponse.json();
    //
    // if (!apiResponse.ok) {
    //     return json({ error: 'API request failed', details: response }, { status: apiResponse.status });
    // }

    try {
        // const data = read(response);
        //
        // const responseText = await data.text();
        //

        console.log(a);
        const assetContent = read(a);
        // console.log(assetContent);
        // return assetContent;
        return new Response('response');
    } catch (e) {
        // return new Response(response);
    }
}
