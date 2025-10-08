<script lang="ts">
    import Button from "@/components/ui/button/button.svelte";
    import { Brain, Computer, Download, Heart, LogIn, Megaphone, Pin, Play, Puzzle } from "lucide-svelte";
    import { goto } from '$app/navigation';
    import { PUBLIC_URL_BASE_STORAGE } from '$env/static/public'

    let { trailName, professor, slug, thumbnail, trailId, isFavorited } = $props();

    function toggleFavorite() {
        fetch("/api/student-usage/favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lesson_id: trailId,
                type: 'trail',
                parent_type: 'trail',
                parent_id: trailId
            }),
        }).then(res => res.json()).then(() => {
            isFavorited = !isFavorited;
        });
    }
</script>

<div class="h-60 w-full bg-gray-100 rounded relative flex gap-6 items-center p-4">
    <div class="w-72 h-full bg-gray-600 rounded-lg">
        {#if thumbnail}
            <img 
                class="w-full h-full object-cover" 
                src={`${PUBLIC_URL_BASE_STORAGE}/${thumbnail}`}
                alt={trailName}
            />
        {:else}
            <img 
                class="w-full h-full object-cover" 
                src="/images/imagem_curso.png" 
                alt="Imagem padrão do curso"
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
            <Button onclick={() => goto(`/dashboard/trilhas/${slug}`)} variant="default" class="cursor-pointer">
                <Play class="w-4 h-4" />
                Continuar
            </Button>

            <Button onclick={() => goto(`/dashboard/trilhas/${slug}?start=first`)} variant="default" class="bg-yellow-500 hover:bg-yellow-600 cursor-pointer">
                <LogIn class="w-4 h-4" />
                Acessar 
            </Button>
            
<!--            <Button variant="ghost">-->
<!--                <Brain />-->
<!--            </Button>-->
<!--            -->
<!--            <Button variant="ghost">-->
<!--                <Megaphone />-->
<!--            </Button>-->

            <Button class="hover:text-slate-600 cursor-pointer" variant="ghost">
                <Computer />
            </Button>
  
            <Button class="hover:text-slate-600 cursor-pointer" variant="ghost">
                <Puzzle />
            </Button>

            <Button class="hover:text-slate-600 cursor-pointer" variant="ghost">
                <Download />
            </Button>
        </div>
    </div>

    <div class="absolute top-0 right-0 p-4 hover:text-slate-600 cursor-pointer">
        <Pin class="w-4 h-4" />
    </div>
</div>
