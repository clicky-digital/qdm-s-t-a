import { redirect } from '@sveltejs/kit';
export const actions = {
    register: async ({ cookies, request }) => {
        const data = await request.formData();

        const response = await fetch('http://localhost/api/v1/register', {
            method: 'POST',
            body: JSON.stringify({
                "name": data.get('name'),
                "email": data.get('email'),
                "password": data.get('password')
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 201) {
            throw redirect(303, '/login');
        } else {
            return {
                message: 'Erro ao realizar cadastro',
            }
        }
    }
};