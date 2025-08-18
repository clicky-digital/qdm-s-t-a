<script>
    import { CornerUpLeft } from "lucide-svelte";
    import TrailItem from "$lib/components/trails/item.svelte"
    import CourseItem from "@/components/courses/item.svelte";

    let promise = fetch("http://localhost/api/v1/get-trails")
        .then(res => res.json());
</script>

<div class="container mx-auto flex flex-col my-4">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <span class="">Voltar ao Início</span>
    </div>

    <div class="title">Trilhas</div>
    <div class="flex flex-col gap-4 my-4">
        {#await promise}
            <p>Carregando trilhas...</p>
        {:then trails}
            {#each trails['trails'] as trail}
                <TrailItem
                    trailName={trail['name']}
                    slug={trail['slug']}
                />
            {/each}
        {:catch error}
            <p>Algo deu errado: {error.message}</p>
        {/await}
    </div>
</div>
