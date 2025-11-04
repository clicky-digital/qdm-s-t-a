<script lang="ts">
    import Button from "@/components/ui/button/button.svelte";
    import { LogIn, Pin, Play } from "lucide-svelte";
    import { goto } from '$app/navigation';
    import { PUBLIC_URL_BASE_STORAGE } from '$env/static/public';

    let { trailName, professor, slug, thumbnail, has_existing_lesson } = $props();

</script>

<div class="h-60 w-full bg-gray-100 rounded relative flex gap-6 items-center p-4">
    <div class="w-80 h-full rounded-lg flex items-center aspect-16/9">
        {#if thumbnail}
            <img 
                class="object-cover rounded-2xl"
                src={`${PUBLIC_URL_BASE_STORAGE}/${thumbnail}`}
                alt={trailName}
            />
        {:else}
            <img 
                class="object-cover rounded-2xl"
                src="/images/imagem_curso.png" 
                alt="Imagem padrão da trilha"
            />
        {/if}
    </div>

    <div class="flex flex-col gap-1">
        <div class="text-slate-900 text-lg font-bold">
            {trailName}
        </div>

        <div class="text-gray-500 text-sm">
            { professor }
        </div>

        <div>
            {#if has_existing_lesson}
                <Button onclick={() => goto(`/dashboard/trilhas/${slug}?action=continue`)} variant="default" class="cursor-pointer">
                    <Play class="w-4 h-4" />
                    Continuar
                </Button>

                <Button onclick={() => goto(`/dashboard/trilhas/${slug}`)} variant="default" class="cursor-pointer bg-yellow-500 hover:bg-yellow-600">
                    <LogIn class="w-4 h-4" />
                    Acessar
                </Button>
            {/if}
        </div>
    </div>

    <div class="absolute top-0 right-0 p-4 hover:text-slate-600 cursor-pointer">
        <Pin class="w-4 h-4" />
    </div>
</div>
