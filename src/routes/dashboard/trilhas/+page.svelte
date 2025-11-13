<script>
    import { CornerUpLeft } from "lucide-svelte";
    import TrailItem from "$lib/components/trails/item.svelte"
    import { goto } from "$app/navigation";

    let { data } = $props();

    function loadThumbnail(item) {
        if (item['thumbnails']) {
            return item['thumbnails']['path'];
        }
        return '/images/imagem_curso.png';
    }
</script>

<div class="container mx-auto flex flex-col my-4 px-8 lg:px-0">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <button
            class="cursor-pointer"
            onclick={()=>{goto('./')}}
        >
            Voltar ao Início
        </button>
    </div>

    <div class="text-2xl font-bold text-slate-900">Trilhas</div>
    <div class="flex flex-col gap-4 my-4">
        {#await data['trails']}
            <p>Carregando trilhas...</p>
        {:then trails}
            {#each trails['trails'] as trail}
                <TrailItem
                    thumbnail={loadThumbnail(trail)}
                    trailName={trail['name']}
                    slug={trail['slug']}
                    has_existing_lesson={trail['has_existing_lesson']}
                    trail_modules={trail['trail_modules']}
                    trail_lessons={trail['trail_lessons']}
                />
            {/each}
        {:catch error}
            <p>Algo deu errado: {error.message}</p>
        {/await}
    </div>
</div>
