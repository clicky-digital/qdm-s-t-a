import { redirect } from '@sveltejs/kit';
import { URL_BASE_API } from '$env/static/private';
export const load = async ({ params, url, parent, cookies }) => {
    const slug_trail = params.slug_trail;
    const parentData = await parent();
    const profile = await parentData.profile;

    const startFirst = url.searchParams.get('start') === 'first';

    const isKeepWatchingForThisTrail =
        profile?.keep_watching?.parent?.type === 'trail' &&
        profile?.keep_watching?.parent?.slug === slug_trail;
        
    if (!startFirst && isKeepWatchingForThisTrail) {
        const continueLessonSlug = profile.keep_watching.slug;

        if (continueLessonSlug) {
            throw redirect(307, `/dashboard/trilhas/${slug_trail}/${continueLessonSlug}`);
        }
    }

    const response = await fetch(`${URL_BASE_API}/api/v1/get-trails/${slug_trail}`,
        {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    });

    if (!response.ok) {
        throw redirect(302, '/dashboard/trilhas');
    }

    const data = await response.json();

    let firstLessonSlug = null;

    if (firstLessonSlug) {
        throw redirect(307, `/dashboard/trilhas/${slug_trail}/${firstLessonSlug}`);
    } else {
        throw redirect(302, '/dashboard/trilhas');
    }
};
