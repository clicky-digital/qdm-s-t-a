export const load = async ({ cookies, params }) => {
    const slug_course = params.slug_course; 
    const slug_lesson = params.slug_lesson;

    let url = `https://adm.qdm-v3.mitrix.online/api/v1/get-courses/${slug_course}`;
    if (slug_lesson) { 
        url += `/${slug_lesson}`;
    }

    let promise = fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    }).then((res) => res.json());

    return { course: promise };
}
