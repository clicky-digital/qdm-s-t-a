<script>
    import Player from "@/player/Player.svelte";

    let { url, metadata = $bindable(), lesson = $bindable(), type = $bindable(), id = $bindable() } = $props();
</script>
<div class="h-full w-full">
    <Player url={url} bind:metadata={metadata} bind:lesson={lesson} bind:type={type} bind:id={id} />
</div>
