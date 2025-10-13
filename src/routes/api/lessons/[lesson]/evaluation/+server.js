import { URL_BASE_API } from '$env/static/private';

export async function POST({ request, cookies, params }) {
    const { rating, comment, parent_type, parent_id } = await request.json();
    const { lesson } = params;

    try {
        const backendPayload = {
            lesson_id: lesson,
            rating: rating,
            comment: comment,
            parent_type: parent_type,
            parent_id: parent_id,
        };

        let response = await fetch(URL_BASE_API + "/api/v1/rating/create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `${cookies.get("token_type")} ${cookies.get("access_token")}`,
            },
            body: JSON.stringify(backendPayload),
        }).then((res) => res.json());

        return new Response(JSON.stringify(response), { status: 200 });
    } catch (error) {
        return new Response(
            JSON.stringify({ message: "Failed to save evaluation" }),
            { status: 500 },
        );
    }
}