import { redirect } from "@sveltejs/kit";
import { URL_BASE_API } from '$env/static/private';
export const load = async ({cookies, fetch}) => {
    if(cookies.get('access_token')) {
        const profileResponse = await fetch(URL_BASE_API + "/api/v1/profile", {
            method: "POST",
            body: JSON.stringify({
               'student_id': cookies.get('student_id')
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
            },
        });

        if (!profileResponse.ok) {
            throw redirect(301, '/login');
        }

        const profile = await profileResponse.json();

        const trailSlugsToFetch = new Set();
        if (profile.last_lessons) {
            for (const lesson of profile.last_lessons) {
                if (lesson.parent?.type === 'trail') {
                    trailSlugsToFetch.add(lesson.parent.slug);
                }
            }
        }

        const trailDataPromises = Array.from(trailSlugsToFetch).map(async (slug) => {
            const trailRes = await fetch(`${URL_BASE_API}/api/v1/get-trails/${slug}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
                },
            });
            if (trailRes.ok) {
                return trailRes.json();
            }
            return null;
        });

        const fetchedTrails = (await Promise.all(trailDataPromises)).filter(Boolean);

        const trailLessonModuleMap = {};
        for (const fetchedTrailWrapper of fetchedTrails) {
            const trail = fetchedTrailWrapper.trail;
            if (trail?.trail_modules) {
                trailLessonModuleMap[trail.slug] = {};
                for (const module of trail.trail_modules) {
                    if (module.trail_lessons) {
                        for (const lesson of module.trail_lessons) {
                            trailLessonModuleMap[trail.slug][lesson.slug] = module.slug;
                        }
                    }
                }
            }
        }

        if (profile.last_lessons) {
            for (const lesson of profile.last_lessons) {
                if (lesson.parent?.type === 'trail' && trailLessonModuleMap[lesson.parent.slug]) {
                    const moduleSlug = trailLessonModuleMap[lesson.parent.slug][lesson.slug];
                    if (moduleSlug) {
                        lesson.module_slug = moduleSlug;
                    }
                }
            }
        }

        return {profile: profile};
    } else {
        throw redirect(301 ,'/login');
    }
}
