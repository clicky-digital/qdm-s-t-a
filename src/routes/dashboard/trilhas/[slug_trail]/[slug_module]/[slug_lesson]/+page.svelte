<script lang="ts">
    import { page } from "$app/state";
    import { CornerUpLeft } from "lucide-svelte";
    import Module from "$lib/components/assistir/modules.svelte";
    import { goto } from "$app/navigation";

    let { data } = $props();
    let { trail, trail_modules, favorite_lessons_ids, frente } = data;
    let active_lesson = $derived(trail_modules.flatMap(module => module.lessons).find(lesson => lesson.slug === page.params.slug_lesson));
</script>

<div class="container mx-auto flex flex-col my-4 px-8 lg:px-0">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <button class="cursor-pointer" onclick={()=>{goto('/dashboard/trilhas')}}>Voltar ao Início</button>
    </div>

    <div class="flex flex-col gap-4 my-4">
        <div class="title">{trail.name}</div>
        <div class="text-gray-400 text-sm">Prof. Marcus Ennes</div>
        <div class="flex flex-col gap-4 my-4">
            <Module
                modules={trail_modules}
                activeLesson={active_lesson}
                type="trail"
                id={trail.id}
                favorites={favorite_lessons_ids}
                frente={frente}
            />
        </div>
    </div>
</div>
