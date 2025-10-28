<script lang="ts">
    import { PUBLIC_URL_BASE_STORAGE } from "$env/static/public";
    import * as Accordion from "$lib/components/ui/accordion/index.js";
    import { goto } from "$app/navigation";
    import Button from "@/components/ui/button/button.svelte";

    export let data;

    let trailName = data.trail.name;
    let trail = data.trail;
    let modules = trail.trail_modules;
</script>

<div class="container mx-auto p-4">
    <h1 class="text-3xl font-bold mb-6">{trailName}</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {#each modules as module}
            <div class="bg-white shadow-lg rounded-lg p-6">
                <div class="w-full h-50 bg-gray-600 rounded-lg mb-4">
                    {#if module.thumbnails.path}
                        <img
                            class="w-full h-full object-cover"
                            src={`${PUBLIC_URL_BASE_STORAGE}/${module.thumbnails.path}`}
                            alt={module.name}
                        />
                    {:else}
                        <img
                            class="w-full h-full object-cover"
                            src="/images/imagem_curso.png"
                            alt="Imagem padrão do curso"
                        />
                    {/if}
                </div>
                <h2 class="text-xl font-semibold mb-2">{module.name}</h2>
                {#if module.trail_lessons && module.trail_lessons.length > 0}
                <Accordion.Root type="single" class="w-full">
                    <Accordion.Item>
                        <Accordion.Trigger class="text-md cursor-pointer">
                            Ver Aulas
                        </Accordion.Trigger>
                        <Accordion.Content class="flex flex-col gap-4 text-balance w-full">
                                {#each module.trail_lessons as lesson}
                                    {#if lesson.lesson}
                                        <div class="flex justify-between text-md items-center p-2 border-b">
                                            <div class="text-gray-500 ">
                                                {lesson.lesson.name}
                                            </div>
                                            <Button onclick={() => goto(`/dashboard/trilhas/${trail.slug}/${module.slug}/${lesson.lesson.slug}`)} variant="link" class="text-blue-500 underline text-sm cursor-pointer">
                                                Assistir Aula
                                            </Button>
                                        </div>
                                    {/if}
                                {/each}
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion.Root>
                {:else}
                <div class="flex flex-col p-4 text-balance w-full h-full justify-center items-center">
                    <div class="text-gray-500">Nenhuma aula disponível.</div>
                </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
