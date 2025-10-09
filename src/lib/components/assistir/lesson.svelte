<script lang="ts">
    import { CircleCheck, Heart } from "lucide-svelte";
    import { createEventDispatcher } from "svelte";


    let { lesson, metadata = {}, is_favorite = false, type, parent_id } = $props();
    
    const dispatch = createEventDispatcher();

    async function toggleFavorite() {
        try {
            const response = await fetch("/api/student-usage/favorite", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    lesson_id: lesson.id,
                    parent_type: type,
                    parent_id: parent_id
                })
            });

            if (response.ok) {
                dispatch("favorited", { lessonId: lesson.id, status: !is_favorite });
                console.log("Successfully " + parent_id + " " + lesson.id)
            } else {
                console.error("Failed to toggle favorite status");
                console.log("Failed " + parent_id )
            }
        } catch (error) {
            console.error("Error toggling favorite status:", error);
        }
    }
    
    function formatTime(seconds: number) {
        if (!seconds) {
            return null;
        }
        const date = new Date(seconds * 1000);
        const hh = date.getUTCHours();
        const mm = date.getUTCMinutes();
        const ss = date.getUTCSeconds().toString().padStart(2, "0");
        if (hh > 0) {
            return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss}`;
        }
        if (mm) {
            console.log(mm);
        }
        if (ss) {
            console.log(ss);
        }
        return `${mm.toString().padStart(2, "0")}:${ss}`;
    }
    let total_time = $derived(formatTime(metadata?.total_time));
</script>

<div
    class="grid gap-2 w-full py-2"
    style="grid-template-columns: 35px 1fr 20px;"
>
    <div class="flex items-center justify-center w-full">
        <div class={"bg-slate-600 rounded h-full font-bold flex flex-col items-center justify-center gap-1 w-full"}>
            <div class="text-xl">{lesson.code}</div>
            <CircleCheck class="w-4 h-4 {metadata?.completed ? 'text-green-500' : ''}" />
        </div>
    </div>
    <div>
        <div class="min-h-12">
            {lesson.name}
        </div>
        <div class="flex gap-2">
            <button onclick={toggleFavorite}>
                <Heart
                    fill={is_favorite ? "red" : "none"}
                    class="w-4 h-4 cursor-pointer hover:text-red-600 {is_favorite ? 'text-red-600' : ''}"
                />
            </button>
            {#if total_time}
                <span class="bg-slate-600 rounded p-1 text-xs">{total_time}</span>
            {/if}
        </div>
    </div>
</div>
