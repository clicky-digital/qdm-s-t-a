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
        <div class="title">{data['course']['name']}</div>
        <div class="text-gray-400 text-sm">Prof. Marcus Ennes</div>
        <div class="flex flex-col gap-4 my-4">
            <Module modules={data['course_modules']} activeLesson={data['active_lesson']} type="course" id={data['course']['id']} favorites={data['favorite_lessons_ids']}/>
        </div>
    </div>
</div>