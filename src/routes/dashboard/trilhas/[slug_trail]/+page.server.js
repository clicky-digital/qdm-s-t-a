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

    if (url.searchParams.get('action') === 'continue') {
        const startFirst = url.searchParams.get('start') === 'first';

        const isKeepWatchingForThisTrail =
            profile?.keep_watching?.parent?.type === 'trail' &&
            profile?.keep_watching?.parent?.slug === slug_trail;

        if (!startFirst && isKeepWatchingForThisTrail) {
                const continueLessonSlug = profile.keep_watching.slug;
                let moduleSlug;
                for (const module of trail.trail_modules) {
                    if (module.trail_lessons) {
                        const lesson = module.trail_lessons.find(
                            (/** @type {{ slug: any; }} */ l) =>
                                l.slug === continueLessonSlug,
                        );
                        if (lesson) {
                            moduleSlug = module.slug;
                            break;
                        }
                    }
                }

                if (moduleSlug) {
                    throw redirect(307, `/dashboard/trilhas/${slug_trail}/${moduleSlug}/${continueLessonSlug}`);
                }
        }

        let firstLessonSlug = null;

        if (trail.trail_modules) {
            for (const module of trail.trail_modules) {
                if (module.trail_lessons && module.trail_lessons.length > 0) {
                    firstLessonSlug = module.trail_lessons[0].slug;
                    const moduleSlug = module.slug;
                    throw redirect(307, `/dashboard/trilhas/${slug_trail}/${moduleSlug}/${firstLessonSlug}`);
                }
            }
        }

        throw redirect(302, '/dashboard/trilhas');
    }

    return {
        trail: trail,
    };
};
