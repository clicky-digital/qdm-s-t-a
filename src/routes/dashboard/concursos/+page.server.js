import { redirect } from '@sveltejs/kit';
import { URL_BASE_API } from '$env/static/private';
export const load = async ({ params, url, parent, cookies }) => {
    const response = await fetch(`${URL_BASE_API}/api/v1/get-all-contests`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    });

    if (!response.ok) {
        throw redirect(302, '/dashboard');
    }

    const data = await response.json();

    if(!data.contests) {
        throw redirect(302, '/dashboard');
    }

    return {
        contests: data.contests,
    };
};
