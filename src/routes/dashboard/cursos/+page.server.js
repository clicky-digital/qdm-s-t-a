import { URL_BASE_API } from '$env/static/private';
export function load({ cookies }) {

    let promise = fetch(URL_BASE_API + "/api/v1/get-courses", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    }).then((res) => res.json());

    return {courses: promise};
}