<script lang="ts">
    import "vidstack/bundle";
    import "vidstack/player";
    import "vidstack/player/layouts/default";
    import "vidstack/player/ui";
    import {
        defineCustomElement,
        MediaPlayerElement,
        MediaProviderElement,
    } from "vidstack/elements";
    import { onDestroy, onMount } from "svelte";

    defineCustomElement(MediaPlayerElement);
    defineCustomElement(MediaProviderElement);

    let { url } = $props();

    let player = $state(MediaPlayerElement);
    let interval: NodeJS.Timer;
</script>

{#key url}
    <media-player
        bind:this={player}
        viewType="video"
        streamType="on-demand"
        logLevel="warn"
        crossOrigin
        src={url}
        class="h-full"
    >
        <media-provider>
            <media-poster class="vds-poster"></media-poster>
            <source src={url} />
        </media-provider>
        <media-video-layout></media-video-layout>
    </media-player>
{/key}

<style>
    media-player {
        aspect-ratio: auto;
    }
</style>
