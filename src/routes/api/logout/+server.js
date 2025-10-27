import { json } from "@sveltejs/kit";

export async function POST({ cookies, request, params }) {
    cookies.delete('access_token', { path: '/' });
    cookies.delete('token_type', { path: '/' });
    cookies.delete('student_id', { path: '/' });

    return json({'cookies': "Deleted"}, {status: 201});
}
