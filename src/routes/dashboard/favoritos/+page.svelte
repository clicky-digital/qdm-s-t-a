<script>
    import { CornerUpLeft } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import Button from "$lib/components/ui/button/button.svelte";

    let { data } = $props();

    function goToLesson(parentType, parentSlug, lessonSlug) {
        goto(`/dashboard/${parentType}/${parentSlug}/${lessonSlug}`);
    }
</script>

<div class="container p-6 mx-auto flex flex-col my-4">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <button class="cursor-pointer" onclick={()=>{goto('./')}}>Voltar ao Início</button>
    </div>

    <div class="title">Favoritos</div>
    <div class="flex flex-col gap-4 my-4">
        {#await data['favorites']}
            <p>Carregando favoritos...</p>
        {:then favorites}
            {#if (favorites['courses'] && favorites['courses'].length > 0) || (favorites['trails'] && favorites['trails'].length > 0)}
                {#if favorites['courses'] && favorites['courses'].length > 0}
                    <div class="title">Cursos com Aulas Favoritas</div>
                    {#each favorites['courses'] as course}
                        <div class="bg-gray-100 rounded-lg shadow-md p-4 mb-4">
                            <h3 class="text-xl font-bold text-slate-900 mb-3">{course['name']}</h3>
                            <div class="flex flex-col gap-2">
                                {#each course['lessons'] as lesson}
                                    <div class="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                                        <span class="text-lg">{lesson['name']}</span>
                                        <Button variant="default" onclick={() => goToLesson('cursos', course['slug'], lesson['slug'])}>
                                            Assistir Novamente
                                        </Button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/each}
                {/if}

                {#if favorites['trails'] && favorites['trails'].length > 0}
                    <div class="title">Trilhas com Aulas Favoritas</div>
                    {#each favorites['trails'] as trail}
                        <div class="bg-gray-100 rounded-lg shadow-md p-4 mb-4">
                            <h3 class="text-xl font-bold text-slate-900 mb-3">{trail['name']}</h3>
                            <div class="flex flex-col gap-2">
                                {#each trail['lessons'] as lesson}
                                    <div class="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
                                        <span class="text-lg">{lesson['name']}</span>
                                        <Button variant="default" onclick={() => goToLesson('trilhas', trail['slug'], lesson['slug'])}>
                                            Assistir Novamente
                                        </Button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    {/each}
                {/if}
            {:else}
                <p>Nenhuma aula favoritada ainda.</p>
            {/if}
        {:catch error}
            <p>Algo deu errado: {error.message}</p>
        {/await}
    </div>
</div>
