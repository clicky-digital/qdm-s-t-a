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
        const courseSlugsToFetch = new Set();
        if (profile.last_lessons) {
            for (const lesson of profile.last_lessons) {
                if (lesson.parent?.type === 'trail') {
                    trailSlugsToFetch.add(lesson.parent.slug);
                } else if (lesson.parent?.type === 'course') {
                    courseSlugsToFetch.add(lesson.parent.slug);
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

        const courseDataPromises = Array.from(courseSlugsToFetch).map(async (slug) => {
            const courseRes = await fetch(`${URL_BASE_API}/api/v1/get-courses/${slug}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
                },
            });
            if (courseRes.ok) {
                return courseRes.json();
            }
            return null;
        });

        const fetchedTrails = (await Promise.all(trailDataPromises)).filter(Boolean);
        const fetchedCourses = (await Promise.all(courseDataPromises)).filter(Boolean);

        const trailLessonModuleMap = {};
        for (const fetchedTrailWrapper of fetchedTrails) {
            const trail = fetchedTrailWrapper.trail;
            if (trail?.trail_modules) {
                // @ts-ignore
                trailLessonModuleMap[trail.slug] = {};
                for (const module of trail.trail_modules) {
                    if (module.trail_lessons) {
                        for (const lesson of module.trail_lessons) {
                            // @ts-ignore
                            trailLessonModuleMap[trail.slug][lesson.slug] = module.slug;
                        }
                    }
                }
            }
        }

        const courseLessonModuleMap = {};
        for (const fetchedCourseWrapper of fetchedCourses) {
            const course = fetchedCourseWrapper.course;
            if (course?.course_modules) {
                // @ts-ignore
                courseLessonModuleMap[course.slug] = {};
                for (const module of course.course_modules) {
                    if (module.course_lessons) {
                        for (const lesson of module.course_lessons) {
                            // @ts-ignore
                            courseLessonModuleMap[course.slug][lesson.slug] = module.slug;
                        }
                    }
                }
            }
        }

        if (profile.last_lessons) {
            for (const lesson of profile.last_lessons) {
                // @ts-ignore
                if (lesson.parent?.type === 'trail' && trailLessonModuleMap[lesson.parent.slug]) {
                    // @ts-ignore
                    const moduleSlug = trailLessonModuleMap[lesson.parent.slug][lesson.slug];
                    if (moduleSlug) {
                        lesson.module_slug = moduleSlug;
                    }
                // @ts-ignore
                } else if (lesson.parent?.type === 'course' && courseLessonModuleMap[lesson.parent.slug]) {
                    // @ts-ignore
                    const moduleSlug = courseLessonModuleMap[lesson.parent.slug][lesson.slug];
                    if (moduleSlug) {
                        lesson.module_slug = moduleSlug;
                    }
                }
            }
        }

        if (profile.keep_watching) {
            // @ts-ignore
            if (profile.keep_watching.parent?.type === 'trail' && trailLessonModuleMap[profile.keep_watching.parent.slug]) {
                // @ts-ignore
                const moduleSlug = trailLessonModuleMap[profile.keep_watching.parent.slug][profile.keep_watching.slug];
                if (moduleSlug) {
                    profile.keep_watching.module_slug = moduleSlug;
                }
            // @ts-ignore
            } else if (profile.keep_watching.parent?.type === 'course' && courseLessonModuleMap[profile.keep_watching.parent.slug]) {
                // @ts-ignore
                const moduleSlug = courseLessonModuleMap[profile.keep_watching.parent.slug][profile.keep_watching.slug];
                if (moduleSlug) {
                    profile.keep_watching.module_slug = moduleSlug;
                }
            }
        }

        return {profile: profile};
    } else {
        throw redirect(301 ,'/login');
    }
}
