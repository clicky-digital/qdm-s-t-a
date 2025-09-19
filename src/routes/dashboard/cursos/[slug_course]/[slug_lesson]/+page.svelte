<script lang="ts">
    import { CornerUpLeft } from "lucide-svelte";
    import Module from "@/components/assistir/modules.svelte";
    import { goto } from "$app/navigation";
    let { data } = $props();

</script>

<div class="container mx-auto flex flex-col my-4">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <button class="cursor-pointer" onclick={()=>{goto('../')}}>Voltar ao Início</button>
    </div>

    <div class="flex flex-col gap-4 my-4">
        {#await data['course']}
            <p>Carregando Curso...</p>
        {:then course}
            <div class="title">{course['course']['name']}</div>
            <div class="text-gray-400 text-sm">Prof. Marcus Ennes</div>
            <div class="flex flex-col gap-4 my-4">
                <Module modules={course['course_modules']} activeLesson={course['active_lesson']} type="course" id={course['course']['id']} />
            </div>
        {:catch error}
            <p>Algo deu errado: {error.message}</p>
        {/await}
    </div>
</div>