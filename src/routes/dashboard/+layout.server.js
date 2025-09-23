import {redirect} from "@sveltejs/kit";

export const load = async ({cookies}) => {
    if(cookies.get('access_token')) {
        let promise = fetch("https://adm.qdm-v3.mitrix.online/api/v1/profile", {
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
