<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import Video from "$lib/components/assistir/video.svelte";
    import Lesson from "$lib/components/assistir/lesson.svelte";
    import Notes from "$lib/components/assistir/notes.svelte";
    import Complements from "$lib/components/assistir/complements.svelte";

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
                <div class="flex flex-col gap-2 w-full p-8 bg-slate-100">
                    <div class="flex flex-col gap-2 w-full">
                        <div>Titulo da aula</div>

                        <div class="grid grid-cols-3 bg-slate-800 text-white">
                            <div class="col-span-2">
                                <Video />
                            </div>

                            <div class="col-span-1">
                                {#each module.lessons as lesson}
                                    <Lesson lesson={lesson} />
                                {/each}
                            </div>
                        </div>
                    </div>

                    <Complements />

                    <div class="flex justify-center items-center w-full h-full">
                        Botão de concluir e prosseguir
                    </div>

                    <Notes />
                </div>
            </Tabs.Content>
        {/each}
    </Tabs.Root>
{/if}
