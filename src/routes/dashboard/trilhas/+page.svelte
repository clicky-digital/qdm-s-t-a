<script>
    import { CornerUpLeft } from "lucide-svelte";
    import CourseItem from "$lib/components/courses/item.svelte"
</script>

<div class="container mx-auto flex flex-col my-4">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <span class="">Voltar ao Início</span>
    </div>

    <div class="title">Trilhas</div>
    <div class="flex flex-col gap-4 my-4">
        <CourseItem />
    </div>
</div>
