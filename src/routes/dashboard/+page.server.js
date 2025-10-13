import { URL_BASE_API } from '$env/static/private';
export function load({ fetch }) {

    const promise = fetch("/api/carrousel").then((res) => res.json());

    return { carrousels: promise };
}