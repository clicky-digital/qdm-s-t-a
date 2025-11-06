import { URL_BASE_API } from '$env/static/private';
import { redirect } from "@sveltejs/kit";
export const load = async ({ cookies, params }) => {
    const slug = params.slug;
    const slug_exam = params.slug_exam;

    const response = await fetch(`${URL_BASE_API}/api/v1/get-all-contests/${slug_exam}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    });

    if (!response.ok) {
        throw redirect(302, '/dashboard');
    }

    const data = await response.json();

    if(!data.contests) {
        throw redirect(302, '/dashboard');
    }

    return {
        exam: data.exam,
        contests: data.contests,
        activeContest: slug,
        activeExam: slug_exam,
    };
}
