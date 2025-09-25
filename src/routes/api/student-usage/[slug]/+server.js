import { json } from '@sveltejs/kit';
import { URL_BASE_API } from '$env/static/private';

export async function POST({ cookies, request, params }) {
    const accessToken = cookies.get('access_token');
    const tokenType = cookies.get('token_type');
    const studentId = cookies.get('student_id');


    if (!accessToken) {
        return json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();

    const apiResponse = await fetch(URL_BASE_API + "/api/v1/student-usage/"+params['slug'], {
        method: "POST",
        body: JSON.stringify({
            ...body,
            student_id: studentId,
        }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${tokenType} ${accessToken}`,
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
