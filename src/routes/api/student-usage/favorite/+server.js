import { URL_BASE_API } from '$env/static/private';

export async function POST({ request, cookies }) {
    const { lesson_id, type } = await request.json();

    try {
        const backendPayload = {
            favoritable_id: lesson_id,
            favoritable_type: type
        };

        let response = await fetch(URL_BASE_API + "/api/v1/favorites/toggle", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${cookies.get('token_type')} ${cookies.get('access_token')}`
            },
            body: JSON.stringify(backendPayload)
        }).then(res => res.json());

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to toggle favorite' }), { status   : 500 });
    }
}
