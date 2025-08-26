export function load({ cookies }) {

    let promise = fetch("http://localhost/api/v1/get-trails", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `${cookies.get('token_type')} ${cookies.get('access_token')}`,
        },
    }).then((res) => res.json());

    return {trails: promise};
}
