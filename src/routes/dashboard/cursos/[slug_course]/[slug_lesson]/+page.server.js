import { URL_BASE_API } from '$env/static/private';
export const load = async ({ cookies, params}) => {
    const slug_course = params.slug_course; 
    const slug_lesson = params.slug_lesson;
    let url = `${URL_BASE_API}/api/v1/get-courses/${slug_course}`;
    if (slug_lesson) { 
        url += `/${slug_lesson}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    });
    const courseData = await response.json();

    return { 
        course: courseData.course,
        course_modules: courseData.course_modules,
        active_lesson: courseData.active_lesson,
        favorite_lessons_ids: courseData.favorite_lessons_ids,
        frente: courseData.active_lesson.frente,
    };
}
