<script lang="ts">
    import { CircleCheck, Play } from "lucide-svelte";

    let { lesson } = $props();
</script>

<div 
    class="grid gap-2 w-full border-b border-gray-300 py-2"
    style="grid-template-columns: 35px 1fr 20px;"
>
    <div class="flex items-center justify-center w-full">
        <div class="bg-slate-600 rounded h-full font-bold flex flex-col items-center justify-center gap-1 w-full">
            <div class="text-xl">1</div>
            <CircleCheck class="w-4 h-4 text-green-500" />
        </div>
    </div>
    <div>
        <div class="min-h-12">
            {lesson.name}
        </div>
        <div>
            <span class="bg-slate-600 rounded p-1 text-xs">{lesson.time}min</span>
        </div>
    </div>
    <div class="flex items-end">
        <Play class="w-4 h-4" />
    </div>
</div>

