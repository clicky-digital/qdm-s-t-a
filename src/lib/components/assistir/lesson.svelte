<script lang="ts">
    import { CircleCheck, Play, RotateCw } from "lucide-svelte";
    import { onMount } from "svelte";

    let { lesson, count, metadata = $bindable() } = $props();
    let metadataObj = $state();
    let total_time = $state('0');

    onMount(async()=>{
        metadataObj = await metadata
        total_time = metadataObj.total_time / 60;
    })
</script>

<div 
    class="grid gap-2 w-full py-2"
    style="grid-template-columns: 35px 1fr 20px;"
>
    <div class="flex items-center justify-center w-full">
        <div class="bg-slate-600 rounded h-full font-bold flex flex-col items-center justify-center gap-1 w-full">
            <div class="text-xl">{count}</div>
            <CircleCheck class="w-4 h-4 {lesson.description ? 'text-green-500' : ''}" />
        </div>
    </div>
    <div>
        <div class="min-h-12">
            {lesson.name}
        </div>
        <div>
            <span class="bg-slate-600 rounded p-1 text-xs">{total_time > 0 ? total_time.toFixed(2).replace('.', ':') : total_time} min</span>
        </div>
    </div>
</div>

