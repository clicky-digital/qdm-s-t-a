<script>
    import Video from "$lib/components/assistir/video.svelte";
    import { CornerUpLeft } from "lucide-svelte";
    import { goto } from "$app/navigation";

    let { data } = $props();

    function goBack() {
        history.back();
    }
</script>

{#key data.videoUrl}
    <div class="w-full flex flex-col">
        <div class="flex items-center text-gray-500 ml-30 mt-8">
            <CornerUpLeft class="w-4 h-4" />
            <button class="cursor-pointer" onclick={()=>{goBack()}}>Voltar para aula</button>
        </div>
        <div class="flex flex-col items-center justify-center w-full">
            <p class="text-slate-800 text-2xl mb-6">Aula - Resolução: {data.videoName}</p>
            <div class="flex-1 flex items-center justify-center w-full">
                {#if data.videoUrl}
                    <div class="w-full max-w-6xl h-auto aspect-video">
                        <Video url={data.videoUrl} />
                    </div>
                {:else}
                    <p class="text-white">Aula não encontrada.</p>
                {/if}
            </div>
        </div>
    </div>
{/key}