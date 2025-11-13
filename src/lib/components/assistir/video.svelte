<script>
    import Player from "@/player/Player.svelte";

    let { url, metadata = $bindable(null), lesson = $bindable(null), type = $bindable(null), id = $bindable(null) } = $props();
</script>
<div class="h-[300px] w-full">
    <Player url={url} bind:metadata={metadata} bind:lesson={lesson} bind:type={type} bind:id={id} />
</div>
