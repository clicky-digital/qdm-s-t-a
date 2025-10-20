import { URL_BASE_API } from '$env/static/private';
export const load = async ({ cookies, params }) => {
    const slug_trail = params.slug_trail; 
    const slug_lesson = params.slug_lesson;

    let url = `${URL_BASE_API}/api/v1/get-trails/${slug_trail}`;
    if (slug_lesson) { 
        url += `/${slug_lesson}`;
    }

    let response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    });

    const trailData = await response.json();

    const allTrailsRes = await fetch(URL_BASE_API + "/api/v1/get-all-trails", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get("token_type")} ${cookies.get("access_token")}`,
        },
    });
    const allTrailsData = await allTrailsRes.json();

    const materialsMap = new Map();
    if (allTrailsData.trails) {
        for (const trail of allTrailsData.trails) {
            if (trail.trail_lessons) {
                for (const tl of trail.trail_lessons) {
                    if (tl.lesson) {
                        materialsMap.set(tl.lesson.id, {
                            handout_url: tl.lesson.handout_url,
                            mind_map_url: tl.lesson.mind_map_url,
                            podcast_url: tl.lesson.podcast_url,
                            link_resolutions: tl.lesson.link_resolutions,
                        });
                    }
                }
            }
        }
    }

    const enrichedModules = trailData.trail_modules.map(
        (/** @type {{ lessons: any[]; }} */ module) => {
            const enrichedLessons = module.lessons.map((lesson) => {
                const materials = materialsMap.get(lesson.id) || {};
                return { ...lesson, ...materials };
            });
            return { ...module, lessons: enrichedLessons };
        },
    );

    const enrichedActiveLesson = {
        ...trailData.active_lesson,
        ...(materialsMap.get(trailData.active_lesson.id) || {}),
    };

    return {
        trail: trailData.trail,
        trail_modules: enrichedModules,
        active_lesson: enrichedActiveLesson,
        favorite_lessons_ids: trailData.favorite_lessons_ids,
        frente: trailData.active_lesson.frente,
    }
}
