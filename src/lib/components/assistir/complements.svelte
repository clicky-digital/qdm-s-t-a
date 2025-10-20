<script lang="ts">
    import { goto } from "$app/navigation";
    import { BookCheck, Brain, Computer, Download, Heart, Megaphone, Puzzle } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
    import { createEventDispatcher } from "svelte";
    import * as Dialog from "$lib/components/ui/dialog/index.js";

    let { lesson, isFavorited, type, parent_id } = $props();

    const dispatch = createEventDispatcher();

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
            const base64_filename = btoa(sourceFilename);

            const apiUrl = `http://localhost/api/v1/download/${base64_filename}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error request: ${response.statusText}`);
            }

            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = downloadFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("O download falhou:", error);
            alert("O download falhou. Verifique o console para mais detalhes.");
        }
    }

    async function openFileInNewTab(sourceFilename: string) {
        try {
            const base64_filename = btoa(sourceFilename);

            const apiUrl = `http://localhost/api/v1/download/${base64_filename}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error request: ${response.statusText}`);
            }

            const blob = await response.blob();
            const fileUrl = URL.createObjectURL(blob);
            window.open(fileUrl, "_blank");
        } catch (error) {
            console.error("Falha ao abrir o arquivo:", error);
            alert("Falha ao abrir o arquivo. Verifique o console para mais detalhes.");
        }
    }

    function getFilename(lessonName: string, materialType: string, sourceUrl: string): string {
        const cleanName = lessonName.replace(/[^a-zA-Z0-9_\s-]/g, "").replace(/\s+/g, "_");
        const extension = sourceUrl.split(".").pop()?.toLowerCase() || "file";
        return `${materialType}_${cleanName}.${extension}`;
    }

</script>

<div class="flex gap-2 w-full font-normal text-2xl">
    <Button class="cursor-pointer hover:text-slate-600" variant="ghost" on:click={toggleFavorite}>
        <Heart fill={isFavorited ? 'red' : 'none'} />
        {isFavorited ? 'Remover dos Favoritos' : 'Favoritar'}
    </Button>

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
                onclick={() => downloadFile(lesson.podcast_url, getFilename(lesson.name, 'Podcast', lesson.podcast_url))}>
            <Megaphone />
            Podcast
        </Button>
    {/if}

    <Button class="cursor-pointer hover:text-slate-600" variant="ghost">
        <Computer />
        Monitoria
    </Button>

    <Button class="cursor-pointer hover:text-slate-600" variant="ghost">
        <Puzzle />
        Simulado
    </Button>

    {#if lesson.link_resolutions && lesson.link_resolutions.length > 0}
        <Dialog.Root>
            <Dialog.Trigger>
                <Button class="flex gap-1 cursor-pointer hover:text-slate-600" variant="ghost">
                    <Download />
                    Exercícios Resolvidos
                </Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Header>
                    <Dialog.Title>Exercícios Resolvidos - Links</Dialog.Title>
                    <Dialog.Description>
                        <div class="flex flex-col mt-4">
                            {#each lesson.link_resolutions as resolution}
                                <div class="flex flex-col">
                                    <div class="flex items-end mb-4 gap-4">
                                        <p class="text-md text-gray-800">{resolution.name}</p>
                                        <Button
                                            class="ml-auto cursor-pointer"
                                            onclick={() => goto(`/dashboard/video-resolution?url=${encodeURIComponent(resolution.url)}&name=${encodeURIComponent(resolution.name)}`)}
                                        >
                                            Acessar Resolução
                                        </Button>
                                    </div>
                                    {#if lesson.link_resolutions.length > 1}
                                        <p class="border-b border-gray-400 mb-4"></p>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </Dialog.Description>
                </Dialog.Header>
            </Dialog.Content>
        </Dialog.Root>
    {/if}
</div>
