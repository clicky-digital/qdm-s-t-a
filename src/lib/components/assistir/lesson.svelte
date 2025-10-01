<script lang="ts">
    import { CircleCheck, Heart, Play, RotateCw } from "lucide-svelte";
    import { onMount } from "svelte";

    let { lesson, metadata = $bindable(), is_favorite = $bindable() } = $props();
    let metadataObj = $state({});
    let total_time = $state("0");

    onMount(async () => {
        metadataObj = await metadata;
        metadataObj.total_time ? total_time = metadataObj.total_time / 60 : total_time = 0;
        total_time = total_time.toFixed(2).replace(".", ":");
    });
</script>

<div
    class="grid gap-2 w-full py-2"
    style="grid-template-columns: 35px 1fr 20px;"
>
    <div class="flex items-center justify-center w-full">
        <div class="bg-slate-600 rounded h-full font-bold flex flex-col items-center justify-center gap-1 w-full">
            <div class="text-xl">{lesson.code}</div>
            <CircleCheck class="w-4 h-4 {lesson.description ? 'text-green-500' : ''}" />
        </div>
    </div>
    <div>
        <div class="min-h-12">
            {lesson.name}
        </div>
        <div class="flex gap-2">
            <span class="bg-slate-600 rounded p-1 text-xs">{total_time} min</span>
            <span>
                <Heart class="w-4 h-4 {is_favorite ? 'text-red-500' : ''}" />
            </span>
        </div>

    </div>
</div>

