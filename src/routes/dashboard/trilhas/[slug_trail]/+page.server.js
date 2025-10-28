import { redirect } from '@sveltejs/kit';
import { URL_BASE_API } from '$env/static/private';
export const load = async ({ params, url, parent, cookies }) => {
    const slug_trail = params.slug_trail;
    const parentData = await parent();
    const profile = await parentData.profile;

    const response = await fetch(`${URL_BASE_API}/api/v1/get-trails/${slug_trail}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    });

    if (!response.ok) {
        throw redirect(302, '/dashboard/trilhas');
    }

    const data = await response.json();
    const { trail } = data;

    if (!trail) {
        throw redirect(302, '/dashboard/trilhas');
    }

    return {
        trail: trail,
    };
};
