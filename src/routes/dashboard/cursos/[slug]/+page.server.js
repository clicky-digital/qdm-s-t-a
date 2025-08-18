export const load = async ({params}) => {

    let promise = fetch("http://localhost/api/v1/get-courses/"+params['slug'])
        .then(res => res.json());

    return {course: promise};
}
