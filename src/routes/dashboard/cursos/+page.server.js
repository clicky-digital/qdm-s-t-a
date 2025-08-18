export function load({ cookies }) {
    let promise = fetch("http://localhost/api/v1/get-courses", {
        method: 'POST',
        body: JSON.stringify({
            student: cookies.get('student')
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(res => res.json());

    return {courses: promise};
}
