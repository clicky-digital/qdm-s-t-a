<script>
    let { showModal = $bindable(), header, children } = $props();

    let dialog = $state();

    $effect(() => {
        if (showModal) dialog.showModal();
    });
</script>

<dialog
    bind:this={dialog}
    class="m-auto border-0 p-0 w-full overflow-hidden"
    onclose={() => (showModal = false)}
    onclick={(e) => { if (e.target === dialog) dialog.close(); }}
>
    <div class="flex flex-col gap-2">
        {@render header?.()}
        <hr />
        <div class="overflow-y-scroll max-h-96">
            {@render children?.()}
        </div>
        <hr />
        <button class="bg-yellow-300 p-2 rounded-xl cursor-pointer" onclick={() => dialog.close()}>Fechar Termos e condições</button>
    </div>
</dialog>

<style>
    dialog::backdrop {
        background: rgba(0, 0, 0, 0.3);
    }
    dialog > div {
        padding: 1em;
    }
    dialog[open] {
        animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    @keyframes zoom {
        from {
            transform: scale(0.95);
        }
        to {
            transform: scale(1);
        }
    }
    dialog[open]::backdrop {
        animation: fade 0.2s ease-out;
    }
    @keyframes fade {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
    button {
        display: block;
    }
</style>
