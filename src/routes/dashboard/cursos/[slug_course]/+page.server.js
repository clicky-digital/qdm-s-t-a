import { redirect } from "@sveltejs/kit";
import { URL_BASE_API } from '$env/static/private';
export const load = async ({ params, url, parent, cookies }) => {
    const slug_course = params.slug_course;
    const parentData = await parent();
    const profile = await parentData.profile;

    const startFirst = url.searchParams.get("start") === "first";

    const isKeepWatchingForThisCourse =
        profile?.keep_watching?.parent?.type === "course" &&
        profile?.keep_watching?.parent?.slug === slug_course;

    if (!startFirst && isKeepWatchingForThisCourse) {
        const continueLessonSlug = profile.keep_watching.slug;

        if (continueLessonSlug) {
            throw redirect(307, `/dashboard/cursos/${slug_course}/${continueLessonSlug}`);
        }
    }

    const response = await fetch(
        `${URL_BASE_API}/api/v1/get-courses/${slug_course}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${cookies.get("token_type")} ${cookies.get("access_token")}`,
            },
        },
    );

    const data = await response.json();

    let firstLessonSlug = null;
    if (data.course && data.course.course_modules) {
        for (const module of data.course.course_modules) {
            if (module.course_lessons && module.course_lessons.length > 0) {
                firstLessonSlug = module.course_lessons[0].slug;
                break; 
            }
        }
    }

    if (firstLessonSlug) {
        throw redirect(307, `/dashboard/cursos/${slug_course}/${firstLessonSlug}`);
    }
};