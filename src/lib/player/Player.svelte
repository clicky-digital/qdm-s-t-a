<script lang="ts">
    import 'vidstack/bundle';
    import 'vidstack/player';
    import 'vidstack/player/layouts/default';
    import 'vidstack/player/ui';
    import { defineCustomElement, MediaPlayerElement, MediaProviderElement } from "vidstack/elements";
    import { onDestroy, onMount } from "svelte";

    defineCustomElement(MediaPlayerElement);
    defineCustomElement(MediaProviderElement);

    let { url, metadata, lesson, type, id } = $props();

    let player = $state(MediaPlayerElement);
    // let player: MediaPlayerElement;
    let interval: NodeJS.Timer;

    onMount(async () => {
        if (player) {
            interval = setInterval(async () => {
                if(!player.paused){
                    let usageable_type = null;
                    let usageable_id = null;
                    if(type && id){
                        usageable_id = id
                        if(type == 'course'){
                            usageable_type = 'App\\Models\\CourseLesson';
                        } else if (type == 'trail'){
                            usageable_type = 'App\\Models\\TrailLesson';
                        }
                    }

                    try {
                        let promise = await fetch('/api/student-usage/set', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({usageable_type: usageable_type, usageable_id: usageable_id, lesson_id: lesson.id, type: 'lesson', 'metadata': { time: player.currentTime} })
                        }).then(res => res.json());
                    } catch (error) {
                        console.error('Failed to update student usage:', error);
                    }
                }
            }, 5000);
        }
    });

    onDestroy(() => {
        if (interval) clearInterval(interval);
    });
</script>

{#key metadata}
    <media-player
        bind:this={player}
        viewType="video"
        streamType="on-demand"
        logLevel="warn"
        crossOrigin
        src={ url }
        class="h-full"
        current-time={metadata.time}
    >
        <media-provider>
            <media-poster class="vds-poster"></media-poster>
            <source src={ url } />
        </media-provider>
        <media-video-layout></media-video-layout>
    </media-player>
{/key}

<style>
    media-player{
        aspect-ratio: auto;
    }
</style>