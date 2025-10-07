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
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

    let { modules, type, id, activeLesson = null, favorites } = $props();

    let lessonKey = $state("");
    let lesson = $state({});
    let metadata = $state({});
    onMount(async () => {
        if (isEmptyObject(lesson)) {
            lesson = activeLesson || modules[0].lessons[0];
        }
        setLesson(lesson, 0);
        let lessonData = await getLesson(lesson);
        metadata = lessonData.metadata;
    });

    async function getLesson(lesson) {
        if (lesson) {
            try {
                let promise = await fetch("/api/student-usage/get", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ lesson_id: lesson.id, type: "lesson", parent_type: type, parent_id: id })
                }).then(res => res.json());
                let response = await promise;
                metadata = response.metadata;

                return { metadata: response.metadata };
            } catch (error) {
                console.error("Failed to get student usage:", error);
            }
        }
    }

    async function setLesson(lesson, key, metadata = null) {
        lessonKey = key + 1;
        if (lesson) {
            try {
                let promise = await fetch("/api/student-usage/set", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        lesson_id: lesson.id,
                        type: "lesson",
                        "metadata": metadata,
                        parent_type: type,
                        parent_id: id
                    })
                }).then(res => res.json());
            } catch (error) {
                console.error("Failed to update student usage:", error);
            }
        }
    }

    function handleFavorited(event) {
        const { lessonId, status } = event.detail;
        if (status) {
            favorites = [...favorites, lessonId];
        } else {
            favorites = favorites.filter(id => id !== lessonId);
        }
    }

    function findNextLesson() {
        let currentModuleIndex = -1;
        let currentLessonIndex = -1;

        for (let i = 0; i < modules.length; i++) {
            const lessonIndex = modules[i].lessons.findIndex(l => l.id === lesson.id);
            if (lessonIndex !== -1) {
                currentModuleIndex = i;
                currentLessonIndex = lessonIndex;
                break;
            }
        }

        if (currentModuleIndex === -1) {
            return null;
        }

        const currentModule = modules[currentModuleIndex];

        if (currentLessonIndex < currentModule.lessons.length - 1) {
            return currentModule.lessons[currentLessonIndex + 1];
        }

        if (currentModuleIndex < modules.length - 1) {
            const nextModule = modules[currentModuleIndex + 1];
            if (nextModule.lessons && nextModule.lessons.length > 0) {
                return nextModule.lessons[0];
            }
        }

        return null;
    }

    async function markComplete() {
        if (lesson && lesson.id) {
            try {
                const finalMetadata = { ...metadata };
                finalMetadata.completed = true;
                finalMetadata.time = finalMetadata.total_time;

                metadata = finalMetadata;

                await setLesson(lesson, lessonKey, finalMetadata);

                const nextLesson = findNextLesson();

                if (nextLesson && nextLesson.slug) {
                    const courseSlug = $page.params.slug_course;

                    const newUrl = `/dashboard/cursos/${courseSlug}/${nextLesson.slug}`;

                    await goto(newUrl);
                } else {
                    console.log("No next lesson found.");
                }
            } catch (error) {
                console.error('Failed to mark lesson as complete:', error);
            }
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
                <Tabs.Trigger
                    onclick={() => {lessonKey = null; lesson=module.lessons[0]; getLesson(module.lessons[0]); setLesson(module.lessons[0], 0)}}
                    value={module.id}>{module.name}</Tabs.Trigger>
            {/each}
        </Tabs.List>
        {#each modules as module}
            <Tabs.Content value={module.id}>
                {#if module.lessons.length > 0}
                    {#if lesson}

                        <div class="flex flex-col gap-2 w-full p-8 bg-gray-100 rounded-sm">
                            <div class="flex flex-col gap-2 w-full">
                                <div class="font-bold text-lg mb-2">
                                    <span
                                        class="bg-slate-800 text-white p-2 rounded">{lesson.code ?? module.lessons[0].code}</span>
                                    {lesson.name ?? module.lessons[0].name}
                                </div>

                                <div
                                    class="grid grid-cols-3 bg-slate-800 text-white rounded h-[500px]"
                                >
                                    <div class="col-span-2 bg-gray-900 rounded-l">
                                        <Video bind:metadata={metadata} bind:lesson={lesson} bind:type={type}
                                               bind:id={id} url={lesson.link ?? module.lessons[0].link} />
                                    </div>

                                    <div class="col-span-1 p-4 grid" style="grid-template-rows: 1fr 20px;">
                                        <div class="">
                                            {#each module.lessons as lessonCard, key}
                                                <div class="flex items-end border-b border-gray-300">
                                                    <Lesson lesson={lessonCard} metadata={getLesson(lessonCard)}
                                                            is_favorite={favorites.includes(lessonCard.id)} on:favorited={handleFavorited} />
                                                    <button class="cursor-pointer pb-3">
                                                        {#if lesson.description}
                                                            <RotateCw class="w-4 h-4" />
                                                        {:else}
                                                            <Play class="w-4 h-4"
                                                                  onclick={() => {getLesson(lessonCard);setLesson(lessonCard, key); lesson=lessonCard}} />
                                                        {/if}
                                                    </button>
                                                </div>
                                            {/each}
                                        </div>

                                        <div
                                            class="text-sm pt-[7px] font-bold text-white text-end border-t border-slate-600">
                                            Aulas assistidas 0/{module.lessons.length}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Complements lesson={lesson} courseId={id} type={type} parent_id={id} isFavorited={favorites.includes(lesson.id)}
                                         on:favorited={handleFavorited} />


                            <div class="flex justify-between items-center w-full h-full">
                                <div>
                                    <Button variant="default" class={metadata?.completed ? 'bg-green-500 hover:bg-green-600' : ''} onclick={markComplete}>
                                        <CircleCheck class="w-4 h-4" />
                                        {#if metadata?.completed}
                                            Aula Concluída
                                        {:else}
                                            Concluir Aula
                                        {/if}
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
                    {/if}

                {:else}
                    <div class="flex justify-center items-center w-full h-full">
                        <div class="text-gray-500 text-xl">Nenhuma aula disponível</div>
                    </div>
                {/if}

            </Tabs.Content>
        {/each}
    </Tabs.Root>
{/if}