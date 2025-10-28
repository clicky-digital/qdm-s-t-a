import { URL_BASE_API } from '$env/static/private';
export const load = async ({ cookies, params}) => {
    const slug_course = params.slug_course;
    const slug_lesson = params.slug_lesson;
    const slug_module = params.slug_module;

    let url = `${URL_BASE_API}/api/v1/get-courses/${slug_course}`;

    if (slug_module) {
        url += `/${slug_module}`;
    }
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

    const allCoursesRes = await fetch(URL_BASE_API + "/api/v1/get-all-courses", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get("token_type")} ${cookies.get("access_token")}`,
        },
    });
    const allCoursesData = await allCoursesRes.json();

    const materialsMap = new Map();
    if (allCoursesData.courses) {
        for (const course of allCoursesData.courses) {
            if (course.course_lessons) {
                for (const cl of course.course_lessons) {
                    if (cl.lesson) {
                        materialsMap.set(cl.lesson.id, {
                            handout_url: cl.lesson.handout_url,
                            mind_map_url: cl.lesson.mind_map_url,
                            podcast_url: cl.lesson.podcast_url,
                            link_resolutions: cl.lesson.link_resolutions,
                        });
                    }
                }
            }
        }
    }

    const enrichedModules = courseData.course_modules.map(
        (/** @type {{ lessons: any[]; }} */ module) => {
            const enrichedLessons = module.lessons.map((lesson) => {
                const materials = materialsMap.get(lesson.id) || {};
                return { ...lesson, ...materials };
            });
            return { ...module, lessons: enrichedLessons };
        },
    );

    const enrichedActiveLesson = {
        ...courseData.active_lesson,
        ...(materialsMap.get(courseData.active_lesson.id) || {}),
    };

    return {
        course: courseData.course,
        course_modules: enrichedModules,
        active_lesson: enrichedActiveLesson,
        favorite_lessons_ids: courseData.favorite_lessons_ids,
        frente: courseData.active_lesson.frente,
    };
}