import {redirect} from "@sveltejs/kit";
import { URL_BASE_API } from '$env/static/private';
export const load = async ({cookies}) => {
    if(cookies.get('access_token')) {
        let promise = fetch(URL_BASE_API + "/api/v1/profile", {
            method: "POST",
            body: JSON.stringify({
               'student_id': cookies.get('student_id')
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
            },
        }).then((res) => res.json());

        return {profile: promise};
    } else {
        redirect(301 ,'/login')
    }
}