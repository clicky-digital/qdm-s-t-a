export const load = async ({ cookies, params }) => {
    const slug_trail = params.slug_trail; 
    const slug_lesson = params.slug_lesson;

    let url = `https://adm.qdm-v3.mitrix.online/api/v1/get-trails/${slug_trail}`;
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

    return { trail: promise };
}
