<script lang="ts">
    import { PUBLIC_URL_BASE_STORAGE } from "$env/static/public";
    import * as Accordion from "@/components/ui/accordion";
    import { goto } from "$app/navigation";
    import Button from "../../../lib/components/ui/button/button.svelte";
    import { CornerUpLeft } from "lucide-svelte";

    export let data;

    let contests = data.contests;
</script>

<div class="container mx-auto flex flex-col my-4 px-8 lg:px-0">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <button class="cursor-pointer" onclick={()=>{goto('./')}}>Voltar ao Início</button>
    </div>
    <h1 class="text-3xl font-bold mb-8 text-slate-900">Concursos</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {#each contests as contest}
            <div class="bg-white shadow-lg rounded-lg p-6">
                <div class="w-full bg-gray-600 rounded-lg mb-4">
                    {#if contest.thumbnail}
                        <img
                            class="w-full h-full object-cover aspect-video"
                            src={`${PUBLIC_URL_BASE_STORAGE}/${contest.thumbnails.path}`}
                            alt={contest.name}
                        />
                    {:else}
                        <img
                            class="w-full h-full object-cover aspect-video"
                            src="/images/imagem_curso.png"
                            alt="Imagem padrão do curso"
                        />
                    {/if}
                </div>

                {#if contest.contest_exams.length > 0}
                    <Button
                        onclick={() => goto(`/dashboard/concursos/${contest.slug}/${contest.contest_exams[0].exam.slug}`)}
                        variant="link"
                        class="text-xl font-semibold mb-2 cursor-pointer"
                    >
                        {contest.name}
                    </Button>
                    <Accordion.Root type="single" class="w-full">
                        <Accordion.Item>
                            <Accordion.Trigger class="text-md cursor-pointer">
                                Ver Aulas
                            </Accordion.Trigger>
                            <Accordion.Content class="flex flex-col gap-4 text-balance w-full">
                                    {#each contest.contest_exams as contest_exams}
                                        {#if contest_exams.exam}
                                            <div class="flex justify-between text-md items-center p-2 border-b">
                                                <div class="text-gray-500">
                                                    {contest_exams.exam.name}
                                                </div>
                                                <Button
                                                    onclick={() => goto(`/dashboard/concursos/${contest.slug}/${contest_exams.exam.slug}`)}
                                                    variant="link"
                                                    class="text-blue-500 underline text-sm cursor-pointer"
                                                >
                                                    Assistir Aula
                                                </Button>
                                            </div>
                                        {/if}
                                    {/each}
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion.Root>
                {:else}
                    <h2 class="text-xl font-semibold mb-2">{contest.name}</h2>
                    <div class="flex flex-col p-4 text-balance w-full h-full justify-center items-center">
                        <div class="text-gray-500">Nenhuma prova disponível.</div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
