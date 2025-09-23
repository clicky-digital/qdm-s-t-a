import { redirect } from "@sveltejs/kit";
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
            throw redirect(
                307,
                `/dashboard/cursos/${slug_course}/${continueLessonSlug}`,
            );
        }
    }

    const response = await fetch(
        `http://localhost/api/v1/get-courses/${slug_course}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${cookies.get("token_type")} ${cookies.get("access_token")}`,
            },
        },
    );

    if (!response.ok) {
        throw redirect(302, "/dashboard/cursos");
    }

    const data = await response.json();
    const firstLessonSlug =
        data.course?.course_modules?.[0]?.course_lessons?.[0]?.slug;

    if (firstLessonSlug) {
        throw redirect(307, `/dashboard/cursos/${slug_course}/${firstLessonSlug}`);
    } else {
        throw redirect(302, "/dashboard/cursos");
    }
};