import { URL_BASE_API } from '$env/static/private';

export async function GET({ cookies }) {
    try {
        let response = await fetch(URL_BASE_API + "/api/v1/ratings", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${cookies.get('token_type')} ${cookies.get('access_token')}`
            }
        }).then(res => res.json());

        return new Response(JSON.stringify(response), { status: 200});
    } catch (error) {
        return new Response(JSON.stringify({ message: 'Failed to fetch evaluations' }), { status: 500 });
    }
}