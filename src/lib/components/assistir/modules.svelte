<script lang="ts">
import * as Tabs from "$lib/components/ui/tabs";
import Video from "$lib/components/assistir/video.svelte";
import Lesson from "$lib/components/assistir/lesson.svelte";
import Notes from "$lib/components/assistir/notes.svelte";
import Complements from "$lib/components/assistir/complements.svelte";
import Button from "../ui/button/button.svelte";
import { ChevronsRightIcon, CircleCheck, CircleMinus, Play, RotateCw, Star } from "lucide-svelte";
import { onMount } from "svelte";
import { isEmptyObject } from "tailwind-variants/dist/utils";
import { goto } from "$app/navigation";
import { page } from "$app/stores";
import EvaluationModal from "$lib/components/assistir/evaluation-modal.svelte";

let { modules, type, id, activeLesson = null, favorites, frente } = $props();

let lessonKey = $state("");
let lesson = $state({});
let metadata = $state({});
let showEvaluationModal = $state(false);
let userRatings = $state([]);
let average_rating = $state("");
let lessonsMetadata = $state({});

async function fetchUserRatings() {
    try {
        let promisse = await fetch(`/api/lessons/all/evaluation`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        let response = await promisse.json();
        userRatings = response.ratings;
    } catch (error) {
        console.error("Failed to GET ratings:", error);
    }
}

async function fecthAverageRating() {
    try {
        let promisse = await fetch(`/api/lessons/${lesson.id}/average`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        let response = await promisse.json();
        average_rating = response.average_rating;
    } catch (error) {
        console.error("Failed to GET average rating:", error);
    }
}

onMount(async () => {
    if (isEmptyObject(lesson)) {
        lesson = activeLesson || modules[0].lessons[0];
    }
    setLesson(lesson, 0);
    let lessonData = await getLesson(lesson);
    metadata = lessonData.metadata;

    await fetchUserRatings();
    await fecthAverageRating();

});

$effect(() => {
    if (activeLesson) {
        (async () => {
            lesson = activeLesson;

            const allLessons = modules.flatMap(module => module.lessons);
            const metadataPromises = allLessons.map(lesson => getLesson(lesson));
            const metadataResults = await Promise.all(metadataPromises);

            const newLessonsMetadata = {};
            for (let i = 0; i < allLessons.length; i++) {
                newLessonsMetadata[allLessons[i].id] = metadataResults[i]?.metadata;
            }
            lessonsMetadata = newLessonsMetadata;

            metadata = lessonsMetadata[lesson.id];

            const moduleOfCurrentLesson = modules.find(module => module.lessons.some(l => l.id === lesson.id));
            if (moduleOfCurrentLesson) {
                currentActiveTabId = moduleOfCurrentLesson.id;
                const currentLessonIndex = moduleOfCurrentLesson.lessons.findIndex(l => l.id === lesson.id);
                setLesson(lesson, currentLessonIndex);
            }
        })();
    }
});

let currentLessonRating = $derived(userRatings.find(r => r.lesson_id === lesson.id));

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

async function handleSaveEvaluation(event) {
    const { lesson_id, rating, comment, parent_type, parent_id } = event.detail;
    try {
        await fetch(`/api/lessons/${lesson_id}/evaluation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ rating, comment, parent_type, parent_id })
        });
        showEvaluationModal = false;
        await fetchUserRatings();
        await fecthAverageRating();
    } catch (error) {
        console.error("Failed to save evaluation:", error);
    }
}
function findNextLesson() {
    let currentModuleIndex = -1;
    let currentLessonIndex = -1;

    for (let i = 0; i < modules.length; i++) {
        const lessonIndex = modules[i].lessons.findIndex(lessonFind => lessonFind.id === lesson.id);
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

            if (finalMetadata.completed) {
                finalMetadata.completed = false;
                finalMetadata.time = finalMetadata.time;

                metadata = finalMetadata;
                lessonsMetadata[lesson.id] = finalMetadata;

                await setLesson(lesson, lessonKey, finalMetadata);
                return;
            }

            finalMetadata.completed = true;
            finalMetadata.time = finalMetadata.total_time;

            metadata = finalMetadata;
            lessonsMetadata[lesson.id] = finalMetadata;

            await setLesson(lesson, lessonKey, finalMetadata);

            const nextLesson = findNextLesson();

            if (nextLesson && nextLesson.slug) {
                const nextModule = modules.find(m => m.lessons.some(l => l.id === nextLesson.id));
                const courseSlug = $page.params.slug_course;
                const trailSlug = $page.params.slug_trail;

                if($page.params.slug_course){
                    const newUrl = `/dashboard/cursos/${courseSlug}/${nextModule.slug}/${nextLesson.slug}`;
                    await goto(newUrl);
                    return;
                }
                if($page.params.slug_trail){
                    const newUrl = `/dashboard/trilhas/${trailSlug}/${nextModule.slug}/${nextLesson.slug}`;
                    await goto(newUrl);
                    return;
                }
            } else {
                console.log("No next lesson found.");
            }
        } catch (error) {
            console.error('Failed to mark lesson as complete:', error);
        }
    }
}

async function handleNextLesson() {
    if (lesson && lesson.id) {
        try {
            await setLesson(lesson, lessonKey);

            const nextLesson = findNextLesson();

            if (nextLesson && nextLesson.slug) {
                const nextModule = modules.find(m => m.lessons.some(l => l.id === nextLesson.id));
                const courseSlug = $page.params.slug_course;
                const trailSlug = $page.params.slug_trail;

                if($page.params.slug_course){
                    const newUrl = `/dashboard/cursos/${courseSlug}/${nextModule.slug}/${nextLesson.slug}`;
                    await goto(newUrl);
                    return;
                }
                if($page.params.slug_trail){
                    const newUrl = `/dashboard/trilhas/${trailSlug}/${nextModule.slug}/${nextLesson.slug}`;
                    await goto(newUrl);
                    return;
                }
            } else {
                console.log("No next lesson found.");
            }
        } catch (error) {
        }
    }
}

let initialTab = $derived(modules.find(m => m.slug === frente)?.id ?? modules[0]?.id);
let currentActiveTabId = $state(initialTab);

function getCurrentLessonIndex(module, lesson) {
    return module.lessons.findIndex(l => l.id === lesson.id);
}
</script>

{#if modules.length === 0}
    <div class="flex justify-center items-center w-full h-full">
        <div class="text-gray-500 text-xl">Nenhuma aula disponível</div>
    </div>
{:else}
    <Tabs.Root value={currentActiveTabId}>
        <Tabs.List class="w-full h-full flex justify-start">
            <div class="flex overflow-x-auto">
                {#each modules as module}
                    <Tabs.Trigger
                        class="cursor-pointer hover:bg-gray-200 px-4 py-2 border-b-2 border-transparent data-[state=active]:font-bold text-gray-700"
                        onclick={() => {
                            lessonKey = null;
                            const firstLesson = module.lessons[0];
                            lesson = firstLesson;
                            getLesson(firstLesson);
                            setLesson(firstLesson, 0);

                            const type = $page.params.slug_course ? 'cursos' : 'trilhas';
                            const parentSlug = $page.params.slug_course || $page.params.slug_trail;
                            const newUrl = `/dashboard/${type}/${parentSlug}/${module.slug}/${firstLesson.slug}`;
                            goto(newUrl);
                        }}
                        value={module.id}>{module.name}</Tabs.Trigger>
                {/each}
            </div>
        </Tabs.List>
        {#each modules as module, moduleIndex}
            <Tabs.Content value={module.id}>
                {#if module.lessons.length > 0}
                    {#if lesson}
                        <div class="flex flex-col gap-2 w-full p-8 bg-gray-100 rounded-sm relative">
                            <div class="flex flex-col gap-2 w-full">
                                <div class="flex justify-between items-center font-bold text-lg mb-2">
                                    <div>
                                        <span class="bg-slate-800 text-white p-2 rounded">
                                            {activeLesson.code}
                                        </span>
                                        {lesson.name ?? module.lessons[0].name}
                                    </div>
                                    {#if average_rating}
                                        <div class="flex items-center text-md">
                                            Avaliação da aula: {average_rating}
                                            <Star class="w-4 h-4 ml-1 text-yellow-400 fill-yellow-400" />
                                        </div>
                                    {/if}
                                </div>

                                <div class="grid grid-cols-1 z-0 md:grid-cols-3 bg-slate-800 text-white rounded h-[400px] lg:h-[500px]">
                                    <div class="col-span-2 bg-gray-900 h-[400px] rounded-l">
                                        <Video bind:metadata={metadata} bind:lesson={lesson} bind:type={type}
                                            bind:id={id} url={lesson.link ?? module.lessons[0].link} />
                                    </div>

                                    <div class="absolute z-10 top-155 right-0 md:relative md:z-0 md:top-0 md:left-0 bg-slate-800 text-white rounded w-full h-[400px] lg:h-[500px]">
                                        <div class="p-4 grid overflow-y-auto" style="grid-template-rows: 1fr 20px;">
                                            <div class="w-full">
                                                {#each module.lessons as lessonCard, key}
                                                    <div class="flex items-end border-b border-gray-300">
                                                        <Lesson lesson={lessonCard} metadata={lessonsMetadata[lessonCard.id]}
                                                            is_favorite={favorites.includes(lessonCard.id)} on:favorited={handleFavorited}
                                                            type={type} parent_id={id} />

                                                        <button class="cursor-pointer pb-3">
                                                            {#if lesson.description}
                                                                <RotateCw class="w-4 h-4" />
                                                            {:else}
                                                                <Play class="w-4 h-4"
                                                                    onclick={() => {
                                                                        getLesson(lessonCard);
                                                                        setLesson(lessonCard, key);
                                                                        lesson = lessonCard;

                                                                        const type = $page.params.slug_course ? 'cursos' : 'trilhas';
                                                                        const parentSlug = $page.params.slug_course || $page.params.slug_trail;
                                                                        const newUrl = `/dashboard/${type}/${parentSlug}/${module.slug}/${lessonCard.slug}`;
                                                                        goto(newUrl);
                                                                    }} />
                                                            {/if}
                                                        </button>
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                        <div
                                            class="text-sm pt-[7px] mr-4 font-bold text-white text-end border-t border-slate-600">
                                            Aulas assistidas {module.lessons.filter((lesson) => lessonsMetadata[lesson.id]?.completed).length}/{module.lessons.length}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Complements lesson={lesson} courseId={id} type={type} parent_id={id} isFavorited={favorites.includes(lesson.id)}
                                on:favorited={handleFavorited} />


                            <div class="flex justify-between items-center w-full h-full">
                                <div>
                                    <Button variant="default" class={"cursor-pointer " + (!metadata?.completed ? 'bg-green-500 hover:bg-green-600' : 'bg-red-600 hover:bg-red-500')} onclick={markComplete}>
                                        {#if !metadata?.completed}
                                            <CircleCheck class="w-4 h-4" />
                                            Concluir Aula
                                        {:else}
                                            <CircleMinus class="w-4 h-4" />
                                            Remover Conclusão
                                        {/if}
                                    </Button>
                                </div>
                                <div>
                                    {#if currentLessonRating}
                                        <div class="flex items-center gap-2">
                                            <span class="font-semibold text-sm">Sua Avaliação:</span>
                                            <div class="flex">
                                                {#each { length: 5 } as _, i}
                                                    {#if i < currentLessonRating.rating}
                                                        <Star class="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                                    {:else}
                                                        <Star class="w-5 h-5 text-gray-300" />
                                                    {/if}
                                                {/each}
                                            </div>
                                        </div>
                                    {:else}
                                        <Button variant="secondary" class="cursor-pointer" onclick={() => showEvaluationModal = true}>
                                            <Star class="w-4 h-4" />
                                            Avaliar Aula
                                        </Button>
                                    {/if}
                                </div>
                                <div>
                                    {#if findNextLesson()}
                                        <Button variant="secondary" class="cursor-pointer hover:text-slate-600" onclick={handleNextLesson}>
                                            Próxima Aula
                                            <ChevronsRightIcon class="w-4 h-4" />
                                        </Button>
                                    {/if}
                                </div>
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
    <EvaluationModal bind:showModal={showEvaluationModal} lesson={lesson} type={type} id={id} onSave={handleSaveEvaluation} />
{/if}
