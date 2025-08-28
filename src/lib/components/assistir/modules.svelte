<script lang="ts">
    import * as Tabs from "$lib/components/ui/tabs";
    import Video from "$lib/components/assistir/video.svelte";
    import Lesson from "$lib/components/assistir/lesson.svelte";
    import Notes from "$lib/components/assistir/notes.svelte";
    import Complements from "$lib/components/assistir/complements.svelte";
    import Button from "../ui/button/button.svelte";
    import { ChevronsRightIcon, CircleCheck, Play, RotateCw } from "lucide-svelte";
    import { onMount } from "svelte";
    import { isEmptyObject } from "tailwind-variants/dist/utils";
    let { modules } = $props();

    let lessonKey = $state('');
    let lesson = $state({});
    let metadata = $state({});


    onMount(async()=>{
        if(isEmptyObject(lesson)){
            lesson = modules[0].lessons[0];
        }
        setLesson(lesson, 0)
        metadata = await getLesson(lesson)
    })
    async function getLesson(lesson) {
        try {
            let promise = await fetch('/api/student-usage/get', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lesson_id: lesson.id, type: 'lesson'})
            }).then(res => res.json());
            let response = await promise
            metadata = response.metadata
            return response.metadata
        } catch (error) {
            console.error('Failed to get student usage:', error);
        }
    }
    async function setLesson(lesson, key, metadata = null) {
        lessonKey = key + 1;

        try {
            let promise = await fetch('/api/student-usage/set', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ lesson_id: lesson.id, type: 'lesson', 'metadata': metadata })
            }).then(res => res.json());
        } catch (error) {
            console.error('Failed to update student usage:', error);
        }
    }
</script>

{#if modules.length === 0}
    <div class="flex justify-center items-center w-full h-full">
        <div class="text-gray-500 text-xl">Nenhuma aula disponível</div>
    </div>
{:else}
    <Tabs.Root value={modules[0].id} class="w-full">
        <Tabs.List>
            {#each modules as module}
                <Tabs.Trigger onclick={() => {lessonKey = null; lesson=module.lessons[0]; getLesson(module.lessons[0]); setLesson(module.lessons[0], 0)}}
                              value={module.id}>{module.name}</Tabs.Trigger>
            {/each}
        </Tabs.List>
        {#each modules as module}
            <Tabs.Content value={module.id}>
                {#if module.lessons.length > 0}

                <div class="flex flex-col gap-2 w-full p-8 bg-gray-100 rounded-sm">
                    <div class="flex flex-col gap-2 w-full">
                        <div class="font-bold text-lg mb-2">
                            <span class="bg-slate-800 text-white p-2 rounded">{lessonKey ?? 1}</span>
                            {lesson.name ?? module.lessons[0].name}
                        </div>

                        <div
                            class="grid grid-cols-3 bg-slate-800 text-white rounded h-[500px]"
                        >
                            <div class="col-span-2 bg-gray-900 rounded-l">
                                <Video bind:metadata={metadata} bind:lesson={lesson} url={lesson.link ?? module.lessons[0].link}/>
                            </div>

                            <div class="col-span-1 p-4 grid" style="grid-template-rows: 1fr 20px;">
                                <div class="">
                                    {#each module.lessons as lessonCard, key}
                                        <div onload={() => {lesson = lessonCard}} class="flex items-end border-b border-gray-300">
                                            <Lesson lesson={lessonCard} count={key+1} metadata="{getLesson(lessonCard)}"/>
                                            <button class="cursor-pointer pb-3" >
                                                {#if lesson.description}
                                                    <RotateCw class="w-4 h-4" />
                                                {:else}
                                                    <Play class="w-4 h-4" onclick={() => {getLesson(lessonCard);setLesson(lessonCard, key); lesson=lessonCard}} />
                                                {/if}

                                            </button>
                                        </div>
                                    {/each}
                                </div>

                                <div class="text-sm pt-[7px] font-bold text-white text-end border-t border-slate-600">
                                    Aulas assistidas 0/{module.lessons.length}
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

                {:else}
                    <div class="flex justify-center items-center w-full h-full">
                        <div class="text-gray-500 text-xl">Nenhuma aula disponível</div>
                    </div>
                {/if}

            </Tabs.Content>
        {/each}
    </Tabs.Root>
{/if}