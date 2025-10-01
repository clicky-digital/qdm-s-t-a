<script lang="ts">
    import { CornerUpLeft } from "lucide-svelte";
    import CourseItem from "$lib/components/courses/item.svelte";
    import { goto } from "$app/navigation";

    let { data } = $props();

    function loadThumbnail(item) {
        if (item['thumbnails']) {
            return item['thumbnails']['path'];
        }
        return '/images/imagem_curso.png';
    }
</script>

<div class="container mx-auto flex flex-col my-4">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <button class="cursor-pointer" onclick={()=>{goto('./')}}>Voltar ao Início</button>
    </div>

    <div class="title">Cursos</div>
    <div class="flex flex-col gap-4 my-4">
        {#await data['courses']}
            <p>Carregando cursos...</p>
        {:then courses}
            {#each courses['courses'] as course}
                <CourseItem
                    thumbnail={loadThumbnail(course)}
                    courseName={course['name']}
                    slug={course['slug']}
                />
            {/each}
        {:catch error}
            <p>Algo deu errado: {error.message}</p>
        {/await}
    </div>
</div>
