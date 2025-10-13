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

    return {
        trail: trailData.trail,
        trail_modules: trailData.trail_modules,
        active_lesson: trailData.active_lesson,
        favorite_lessons_ids: trailData.favorite_lessons_ids,
        frente: trailData.active_lesson.frente,
    }
}
