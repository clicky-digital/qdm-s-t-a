import { URL_BASE_API } from '$env/static/private';

export async function load({ cookies, parent }) {
    const parentData = await parent();
    const profile = await parentData.profile;

    let response = await fetch(URL_BASE_API + "/api/v1/get-trails", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    }).then((res) => res.json());

    return { 
        trails: response,
        keep_watching: profile?.keep_watching
    };
}
