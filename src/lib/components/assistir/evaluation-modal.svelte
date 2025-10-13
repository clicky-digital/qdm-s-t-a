<script lang="ts">
    import { Star } from "lucide-svelte";
    import Button from "$lib/components/ui/button/button.svelte";

    let { showModal, lesson, type, id, onSave } = $props();

    let rating = $state(0);
    let comment = $state("");

    function setRating(newRating) {
        rating = newRating;
    }

    async function handleSubmit() {
        if (rating > 0) {
            const event = new CustomEvent('save', {
                detail: {
                    lesson_id: lesson.id,
                    rating: rating,
                    comment: comment,
                    parent_type: type,
                    parent_id: id
                }
            });
            onSave(event);
        }
    }
</script>

{#if showModal}
    <div class="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
        <div class="bg-white p-8 rounded-lg shadow-lg w-1/3">
            <h2 class="text-xl font-bold mb-4">Avalie esta aula</h2>
            <div class="flex justify-center mb-4">
                {#each { length: 5 } as _, i}
                    <button onclick={() => setRating(i + 1)}>
                        <Star class={i < rating ? "text-yellow-400" : "text-gray-300"} />
                    </button>
                {/each}
            </div>
            <textarea
                class="w-full p-2 border rounded"
                rows="4"
                placeholder="Deixe seu comentário (opcional)"
                bind:value={comment}
            ></textarea>
            <div class="flex justify-end mt-4">
                <Button variant="secondary" onclick={() => showModal = false}>Cancelar</Button>
                <Button onclick={handleSubmit} disabled={rating === 0}>Enviar Avaliação</Button>
            </div>
        </div>
    </div>
{/if}