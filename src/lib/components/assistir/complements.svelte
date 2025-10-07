<script lang="ts">
    import { BookCheck, Brain, Computer, Download, Heart, Megaphone, Puzzle } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
    import { createEventDispatcher } from "svelte";

    let { lesson, courseId, isFavorited, type } = $props();

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
                    type: "lesson",
                    parent_type: type,
                    parent_id: courseId
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
</script>

<div class="flex gap-2 w-full font-normal text-2xl">
    <Button variant="ghost" onclick={toggleFavorite}>
        <Heart fill={isFavorited ? 'red' : 'none'} />
        {isFavorited ? 'Remover dos Favoritos' : 'Favoritar'}
    </Button>

    <Button variant="ghost">
        <BookCheck />
        Apostilas
    </Button>

    <Button variant="ghost">
        <Brain />
        Mapa Mental
    </Button>

    <Button variant="ghost">
        <Megaphone />
        Podcast
    </Button>

    <Button variant="ghost">
        <Computer />
        Monitoria
    </Button>

    <Button variant="ghost">
        <Puzzle />
        Simulado
    </Button>

    <Button variant="ghost">
        <Download />
        Exercícios Resolvidos
    </Button>
</div>
