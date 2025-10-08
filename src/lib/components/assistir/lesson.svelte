<script lang="ts">
    import { CircleCheck, Heart, Play, RotateCw } from "lucide-svelte";
    import { onMount } from "svelte";

    let { lesson, metadata = $bindable(), is_favorite = $bindable() } = $props();
    let metadataObj = $state({});
    let total_time = $state("0");

    function formatTime(seconds: number) {
        if(!seconds){
            return null;
        }
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, "0");
        if (hh > 0) {
            return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss}`;
        }
        if(mm){console.log(mm)}
        if(ss){console.log(ss)}
        return `${mm.toString().padStart(2, "0")}:${ss}`;
    }

    onMount(async () => {
        metadataObj = await metadata;
        total_time = formatTime(metadataObj.total_time);
    });
</script>

<div
    class="grid gap-2 w-full py-2"
    style="grid-template-columns: 35px 1fr 20px;"
>
    <div class="flex items-center justify-center w-full">
        <div
            class={"bg-slate-600 rounded h-full font-bold flex flex-col items-center justify-center gap-1 w-full"}
        >
            <div class="text-xl">{lesson.code}</div>
            <CircleCheck
                class="w-4 h-4 {metadataObj?.completed ? 'text-green-500' : ''}"
            />
        </div>
    </div>
    <div>
        <div class="min-h-12">
            {lesson.name}
        </div>
        <div class="flex gap-2">
            {#if total_time}
                <span class="bg-slate-600 rounded p-1 text-xs">{total_time}</span>
            {/if}
            <span>
                <Heart class="w-4 h-4{is_favorite ? 'text-red-500' : ''}" />
            </span>
        </div>
    </div>
</div>
