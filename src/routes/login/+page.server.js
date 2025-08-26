import { redirect } from '@sveltejs/kit';
export const actions = {
    login: async ({ cookies, request }) => {
        const data = await request.formData();

        const response = await fetch('http://localhost/api/v1/login', {
            method: 'POST',
            body: JSON.stringify({
                "email": data.get('email'),
                "password": data.get('password')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            let student = await response.json();
            cookies.set('student_id', student.student.id, {path:'/'});
            cookies.set('access_token', student.access_token, {path:'/'});
            cookies.set('token_type', student.token_type, {path:'/'});
            throw redirect(303, '/dashboard');
        } else {
            return {
                message: 'E-mail ou senha incorretos',
                email: data.get('email'),
            }
        }
    }
};