<script lang="ts">
    import { CircleCheck, Heart, Play, RotateCw, Star } from "lucide-svelte";
    import { onMount } from "svelte";

    let { lesson, metadata = $bindable(), is_favorite = $bindable(), codeLesson } = $props();
    let metadataObj = $state({});
    let total_time = $state("0");
    let average_rating = $state("");

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
        await fecthAverageRating();
    });

    async function fecthAverageRating() {
        try {
            let promisse = await fetch(`/api/lessons/${lesson.id}/average`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });
            let response = await promisse.json();
            average_rating = response.average_rating;
            console.log(response.average_rating);
        } catch (error) {
            console.error("Failed to GET average rating:", error);
        }
    }
</script>

<div
    class="grid gap-2 w-full py-2"
    style="grid-template-columns: 35px 1fr 20px;"
>
    <div class="flex items-center justify-center w-full">
        <div
            class={"bg-slate-600 rounded h-full font-bold flex flex-col items-center justify-center gap-1 w-full"}
        >
            <div class="text-xl">{codeLesson}</div>
            <CircleCheck
                class="w-4 h-4 {metadataObj?.completed ? 'text-green-500' : ''}"
            />
        </div>
    </div>
    <div>
        <div class="flex justify-between items-center">
            <div class="min-h-12">
                {lesson.name}
            </div>
            {#if average_rating > 0}
                <div class="flex items-center text-md">
                    {average_rating}
                    <Star class="w-4 h-4 ml-1 text-yellow-400 fill-yellow-400" />
                </div>
            {/if}
        </div>
        <div class="flex gap-2">
            {#if total_time}
                <span class="bg-slate-600 rounded p-1 text-xs">{total_time}</span>
            {/if}
            <span>
                <Heart class="w-4 h-4 {is_favorite ? 'text-red-500' : ''}" />
            </span>
        </div>
    </div>
</div>
