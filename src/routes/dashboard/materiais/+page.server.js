import { error } from "@sveltejs/kit";
import { URL_BASE_API } from "$env/static/private";
/**
 * @param {any[]} rawLessonsContainer
 * @param {string} lessonKey
 */
function transformLessons(rawLessonsContainer, lessonKey) {
    if (!rawLessonsContainer || !Array.isArray(rawLessonsContainer)) {
        return [];
    }
    return rawLessonsContainer
        .map((container) => {
            const lesson = container[lessonKey];
            if (!lesson) return null;

            return {
                id: lesson.id,
                name: lesson.name,

                apostila_url: lesson.handout_url,
                mapa_mental_url: lesson.mind_map_url,
                podcast_url: lesson.podcast_url,
            };
        })
        .filter(Boolean);
}

export async function load({ cookies }) {
    try {
        const coursesRes = await fetch(URL_BASE_API + "/api/v1/get-all-courses", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `${cookies.get("token_type")} ${cookies.get("access_token")}`,
                },
            },
        );

        const trailsRes = await fetch(URL_BASE_API + "/api/v1/get-all-trails", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${cookies.get("token_type")} ${cookies.get("access_token")}`,
            },
        });

        const coursesData = await coursesRes.json();
        const trailsData = await trailsRes.json();

        const courses = (coursesData.courses || []).map(
            (
                /** @type {{ id: any; name: any; course_lessons: any[]; }} */ course,
            ) => ({
                id: course.id,
                name: course.name,
                lessons: transformLessons(course.course_lessons, "lesson"),
            }),
        );

        // @ts-ignore
        const trails = (trailsData.trails || []).map((trail) => ({
            id: trail.id,
            name: trail.name,
            lessons: transformLessons(trail.trail_lessons, "lesson"),
        }));

        return {
            courses,
            trails,
            apiError: null,
        };
    } catch (e) {
        console.error("Erro inesperado ao carregar a página de materiais:", e);
        return {
            courses: [],
            trails: [],
            apiError: {
                source: "catch_block",
                // @ts-ignore
                message: e.message,
            },
        };
    }
}
