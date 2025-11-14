<script lang="ts"> import { goto } from "$app/navigation";
    import { BookCheck, Brain, Computer, Download, Heart, Megaphone, Puzzle } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
    import { createEventDispatcher, onMount } from "svelte";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { PUBLIC_URL_BASE_STORAGE } from "$env/static/public";
    import Video from "@/components/assistir/video.svelte";

    let { lesson, isFavorited, type, parent_id } = $props();
    let monitor_phone = $state({});

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
<div class="flex gap-2 w-full font-normal text-2xl">

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
        <Dialog.Root>
            <Dialog.Trigger>
                <Button class="flex gap-1 cursor-pointer hover:text-slate-600" variant="ghost">
                    <Download />
                    Exercícios Resolvidos
                </Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header class="">
                    <Dialog.Title>Exercícios Resolvidos - Links</Dialog.Title>
                    <Dialog.Description class="h-full overflow-y-auto">
                        <div class="flex flex-col mt-4 gap-2">
                            {#each lesson.link_resolutions as resolution}
                                <Dialog.Root>
                                    <Dialog.Trigger>
                                        <div class="flex items-center justify-between">
                                            <p class="text-md text-gray-800">{resolution.name}</p>
                                            <Button class="flex gap-1 p-5 cursor-pointer bg-gray-800 text-gray-50 hover:bg-slate-600 hover:text-white hover:transform duration-150 " variant="ghost">
                                                Acessar Resolução
                                            </Button>
                                        </div>
                                    </Dialog.Trigger>
                                    <Dialog.Content class="h-[80vh] lg:h-[70vh]">
                                        <Dialog.Header>
                                            <Dialog.Title>{resolution.name}</Dialog.Title>
                                            <Dialog.Description class="w-full h-full flex items-center justify-center mb-28 lg:mb-48">
                                                <Video url={resolution.url} />
                                            </Dialog.Description>
                                        </Dialog.Header>
                                    </Dialog.Content>
                                </Dialog.Root>
                            {/each}
                        </div>
                    </Dialog.Description>
                </Dialog.Header>
            </Dialog.Content>
        </Dialog.Root>
    {/if}
</div>
