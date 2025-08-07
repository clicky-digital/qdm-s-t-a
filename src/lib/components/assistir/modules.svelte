<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import Video from "$lib/components/assistir/video.svelte";
    import Lesson from "$lib/components/assistir/lesson.svelte";
    import Notes from "$lib/components/assistir/notes.svelte";
    import Complements from "$lib/components/assistir/complements.svelte";
    import Button from "../ui/button/button.svelte";
    import { ChevronsRightIcon, CircleCheck } from "lucide-svelte";

    let { modules } = $props();
</script>

{#if modules.length === 0}
    <div class="flex justify-center items-center w-full h-full">
        <div class="text-gray-500 text-xl">Nenhuma aula disponível</div>
    </div>
{:else}
    <Tabs.Root value={modules[0].id} class="w-full">
        <Tabs.List>
            {#each modules as module}
                <Tabs.Trigger value={module.id}>{module.name}</Tabs.Trigger>
            {/each}
        </Tabs.List>
        {#each modules as module}
            <Tabs.Content value={module.id}>
                <div class="flex flex-col gap-2 w-full p-8 bg-gray-100 rounded-sm">
                    <div class="flex flex-col gap-2 w-full">
                        <div class="font-bold text-lg mb-2">
                            <span class="bg-slate-800 text-white p-2 rounded">1</span> 
                            Titulo da aula
                        </div>

                        <div 
                            class="grid grid-cols-3 bg-slate-800 text-white rounded h-[500px]"
                        >
                            <div class="col-span-2 bg-gray-900 rounded-l">
                                <Video />
                            </div>

                            <div class="col-span-1 p-4 grid" style="grid-template-rows: 1fr 20px;">
                                <div class="">
                                    {#each module.lessons as lesson}
                                        <Lesson lesson={lesson} />
                                    {/each}
                                </div>

                                <div class="text-sm pt-[7px] font-bold text-white text-end border-t border-slate-600">
                                    Aulas assistidas 1/9
                                </div>
                            </div>
                        </div>
                    </div>

                    <Complements />

                    <div class="flex justify-between items-center w-full h-full">
                        <div>
                            <Button variant="default">
                                <CircleCheck class="w-4 h-4" />
                                Concluir Aula
                            </Button>
                        </div>

                        <div>
                            <Button variant="secondary">
                                Proxima Aula
                                <ChevronsRightIcon class="w-4 h-4" />
                            </Button>
                        </div>

                        <div></div>
                    </div>

                    <Notes />
                </div>
            </Tabs.Content>
        {/each}
    </Tabs.Root>
{/if}
