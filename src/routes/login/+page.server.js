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

        if (response.status === 200) {
            let student = await response.json();
            cookies.set('student', student.student, {path:'/'});
            throw redirect(303, '/dashboard');
        }
    }
};