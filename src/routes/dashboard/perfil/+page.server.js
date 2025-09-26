import { URL_BASE_API } from '$env/static/private';
export function load({ cookies }) {

    let promise = fetch(URL_BASE_API + "/api/v1/profile", {
        method: "POST",
        body: JSON.stringify({
            student_id: cookies.get('student_id')
        }),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    }).then((res) => res.json());

    return {profile: promise};
}

export const actions = {
    updateProfile: async ({ cookies, request }) => {
        const data = await request.formData();
        const avatar = data.get('avatar');
        const name = data.get('name');
        const email = data.get('email');
        const phone = data.get('phone');
        const zip_code = data.get('zip_code');
        const district = data.get('district');
        const uf = data.get('uf');
        const city = data.get('city');
        const address = data.get('address');
        const number = data.get('number');
        const complement = data.get('complement');

        let promise = fetch(URL_BASE_API + "/api/v1/profile/update", {
            method: "POST",
            body: JSON.stringify({
                'student_id': cookies.get('student_id'),
                'avatar': avatar,
                'name': name,
                'email': email,
                'phone': phone,
                'zip_code': zip_code,
                'district': district,
                'uf': uf,
                'city': city,
                'address': address,
                'number': number,
                'complement': complement,
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
            },
        }).then((res) => res.json());

        let message = await promise;

        return { message: message};
    },
    updatePassword: async ({ cookies, request }) => {
        const data = await request.formData();
        const password = data.get('password');
        const confirmPassword = data.get('confirmPassword');

        if(password !== confirmPassword) {
            return {
                passwordMustMatch: 'As senhas não são iguais',
            }
        }

        let promise = fetch(URL_BASE_API + "/api/v1/profile/update-password", {
            method: "POST",
            body: JSON.stringify({
                'student_id': cookies.get('student_id'),
                'password': password,
            }),
            headers: {
                "Content-Type": "application/json",
                "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
            },
        }).then((res) => res.json());

        let message = await promise;

        return { message: message};
    }
};