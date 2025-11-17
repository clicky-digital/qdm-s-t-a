<script lang="ts"> import { goto } from "$app/navigation";
import { BookCheck, Brain, Computer, DivideCircle, DivideIcon, Download, Heart, Megaphone, Puzzle, X } from "lucide-svelte";
import Button from "../ui/button/button.svelte";
import { createEventDispatcher, onMount } from "svelte";
import * as Dialog from "$lib/components/ui/dialog/index.js";
import { PUBLIC_URL_BASE_STORAGE } from "$env/static/public";
import Video from "@/components/assistir/video.svelte";
import { Content } from "../ui/accordion";

let { lesson, isFavorited, type, parent_id } = $props();
let monitor_phone = $state({});

let listDialogOpen = $state(false);
let videoDialogOpen = $state(false);
let activeResolution: { name: string, url: string } | null = $state(null);
const dispatch = createEventDispatcher();

onMount(async () => {
    try {
        let promise = await fetch("/api/configuration/monitor_phone", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
            }),
        }).then((res) => res.json());

        monitor_phone = await promise;
    } catch (error) {
        console.error("Failed to retrieve configuration:", error);
    }
});

function openVideo(resolution: { name: string, url: string }) {
    activeResolution = resolution;
    videoDialogOpen = true;
}

async function toggleFavorite() {
    try {
        const response = await fetch("/api/student-usage/favorite", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                lesson_id: lesson.id,
                parent_type: type,
                parent_id: parent_id
            })
        });

        if (response.ok) {
            dispatch("favorited", { lessonId: lesson.id, status: !isFavorited });
        } else {
            console.error("Failed to toggle favorite status");
        }
    } catch (error) {
        console.error("Error toggling favorite status:", error);
    }
}

async function downloadFile(sourceFilename: string, downloadFilename: string) {
    try {
        window.open(`${PUBLIC_URL_BASE_STORAGE}/${sourceFilename}`, '_blank');
        //     const response = await fetch(`/api/files`, {
        //         method: "POST",
        //         body: JSON.stringify({
        //             url: PUBLIC_URL_BASE_STORAGE + '/' + sourceFilename
        //         }),
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     });
        //
        //     if (!response.ok) {
        //         throw new Error(`Error request: ${response.statusText}`);
        //     }
        //
        //     const blob = await response.blob();
        //     const link = document.createElement('a');
        //     link.href = URL.createObjectURL(blob);
        //     link.download = downloadFilename;
        //     document.body.appendChild(link);
        //     link.click();
        //     document.body.removeChild(link);
        //     URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Error downloading file:", error);
        alert('Erro ao baixar o arquivo. Acesse seu perfil, e entre em contato com a nossa equipe.');
    }
}

async function openFileInNewTab(sourceFilename: string) {
    try {
        window.open(`${PUBLIC_URL_BASE_STORAGE}/${sourceFilename}`, '_blank');
    } catch (error) {
        console.error("Error opening file in new tab:", error);
        alert('Erro ao abrir o arquivo. Acesse seu perfil, e entre em contato com a nossa equipe.');
    }
}

function getFilename(lessonName: string, materialType: string, sourceUrl: string): string {
    const cleanName = lessonName.replace(/[^a-zA-Z0-9_\s-]/g, "").replace(/\s+/g, "_");
    const extension = sourceUrl.split(".").pop()?.toLowerCase() || "file";
    return `${materialType}_${cleanName}.${extension}`;
}
</script>
<div class="flex items-center py-4 gap-2 w-full font-normal text-2xl z-50">

    {#if lesson.handout_url}
        <Button class="cursor-pointer hover:text-slate-600" variant="ghost"
            onclick={() => openFileInNewTab(lesson.handout_url)}>
            <BookCheck />
            Apostila
        </Button>
    {/if}

    {#if lesson.mind_map_url}
        <Button class="cursor-pointer hover:text-slate-600" variant="ghost"
            onclick={() => openFileInNewTab(lesson.mind_map_url)}>
            <Brain />
            Mapa Mental
        </Button>
    {/if}

    {#if lesson.podcast_url}
        <Button class="cursor-pointer hover:text-slate-600" variant="ghost"
            onclick={() => openFileInNewTab(lesson.podcast_url)}>
            <Megaphone />
            Podcast
        </Button>
    {/if}

    {#await monitor_phone}
        <Button class="hover:text-slate-600" variant="ghost">
            <Computer />
            Monitoria
        </Button>
        {:then obj}
        <a href="https://wa.me/{obj.monitor_phone}" target="_blank">
            <Button class="cursor-pointer hover:text-slate-600" variant="ghost">
                <Computer />
                Monitoria
            </Button>
        </a>
    {/await}

    <!--    <Button class="cursor-pointer hover:text-slate-600" variant="ghost">-->
    <!--        <Puzzle />-->
    <!--        Simulado-->
    <!--    </Button>-->

    {#if lesson.link_resolutions && lesson.link_resolutions.length > 0}
        <div>
            <div>
                <Button onclick={() => listDialogOpen = true} class="flex gap-1 cursor-pointer hover:text-slate-600" variant="ghost">
                    <Download />
                    Exercícios Resolvidos
                </Button>
            </div>

            {#if listDialogOpen}
                <div class="fixed inset-0 bg-black/40 flex justify-center items-center">
                    <div class="bg-white p-8 rounded-lg shadow-lg z-40 w-2/3 lg:w-1/3">
                        <div class="flex justify-between gap-4 my-4">
                            <span>Exercícios Resolvidos - Links</span>
                            <button onclick={() => listDialogOpen = false }><X /></button>
                        </div>
                        <div class="h-full max-h-[500px] overflow-y-auto">
                            <div class="flex flex-col mt-4 gap-2">
                                {#each lesson.link_resolutions as resolution}
                                    <div class="flex items-center justify-between">
                                        <p class="text-md text-gray-800">{resolution.name}</p>
                                        <Button class="flex gap-1 p-5 cursor-pointer bg-gray-800 text-gray-50 hover:bg-slate-600 hover:text-white hover:transform duration-150 "
                                            variant="ghost"
                                            onclick={() => openVideo(resolution)}>
                                            Acessar Resolução
                                        </Button>
                                    </div>
                                {/each}
                            </div>
                        </div>
                    </div>
                </div>
            {/if}

            {#if videoDialogOpen}
                <div class="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    {#if activeResolution}
                        <div class="max-w-screen-lg max-h-[620px] bg-white p-8 rounded-lg shadow-lg w-[700px] lg:w-[1200px] z-60">
                            <div class="flex flex-col gap-4 my-4">
                                <div class="flex justify-between items-center font-bold text-lg mb-2">
                                    <span>{activeResolution.name}</span>
                                    <button onclick={() => videoDialogOpen = false }><X /></button>
                                </div>
                                <div class="w-full h-full flex items-center justify-center mb-28 lg:mb-48">
                                    <Video url={activeResolution.url} />
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    {/if}
</div>
