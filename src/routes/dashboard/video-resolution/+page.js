export function load({ url }) {
    const videoUrl = url.searchParams.get('url');
    const videoName = url.searchParams.get('name');
    return {
        videoUrl,
        videoName
    };
}