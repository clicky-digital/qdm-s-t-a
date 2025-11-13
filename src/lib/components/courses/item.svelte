<script lang="ts">
    import Button from "@/components/ui/button/button.svelte";
    import { LogIn, Pin, Play } from "lucide-svelte";
    import { goto } from '$app/navigation';
    import { PUBLIC_URL_BASE_STORAGE } from '$env/static/public'

    let { courseName, professor, slug, thumbnail, isFavorited, courseId, has_existing_lesson } = $props();

    function toggleFavorite() {
        fetch("/api/student-usage/favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                lesson_id: courseId,
                type: 'course',
                parent_type: 'course',
                parent_id: courseId
            }),
        }).then(res => res.json()).then(() => {
            isFavorited = !isFavorited;
        });
    }
</script>

<div class="h-60 w-full bg-gray-100 rounded relative flex gap-6 items-center p-4">
    <div class="w-80 h-full rounded-lg flex items-center aspect-16/9">
        {#if thumbnail}
            <img
                class="object-cover rounded-2xl"
                src={`${PUBLIC_URL_BASE_STORAGE}/${thumbnail}`}
                alt={courseName}
            />
        {:else}
            <img
                class="object-cover rounded-2xl"
                src="/images/imagem_curso.png"
                alt="Imagem padrão do curso"
            />
        {/if}
    </div>

    <div class="flex flex-col gap-1">
        <div class="text-slate-900 text-lg font-bold">
            {courseName}
        </div>

        <div class="text-gray-500 text-sm">
            { professor }
        </div>

        <div>
            {#if has_existing_lesson}
                <Button onclick={() => goto(`/dashboard/cursos/${slug}`)} variant="default" class="cursor-pointer sm:mb-2 md:mb-0">
                    <Play class="w-4 h-4" />
                    Continuar
               </Button>

                <Button onclick={() => goto(`/dashboard/cursos/${slug}?start=first`)} variant="default" class="bg-yellow-500 hover:bg-yellow-600 cursor-pointer">
                    <LogIn class="w-4 h-4" />
                    Acessar
                </Button>
            {/if}
        </div>
    </div>

    <div class="absolute top-0 right-0 p-4">
        <Pin class="w-4 h-4 hover:text-slate-600 cursor-pointer" />
    </div>
</div>
