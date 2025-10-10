<script lang="ts">
    import { Play } from 'lucide-svelte';
    import { goto } from "$app/navigation";
    import { PUBLIC_URL_BASE_STORAGE } from "$env/static/public";
    import * as Carousel from "$lib/components/ui/carousel/index.js";
    import Autoplay from "embla-carousel-autoplay";
    import CarouselNext from '@/components/ui/carousel/carousel-next.svelte';
    import CarouselPrevious from '@/components/ui/carousel/carousel-previous.svelte';

    let { data, thumbnails } = $props();
    let lastWatched  = $state(true);
</script>

<div class="container mx-auto flex flex-col gap-6 my-4">
    <div class="text-2xl font-bold text-slate-900">Continuar Assistindo</div>
	
    <div class="grid grid-cols-3 gap-4">

        {#await data['profile']}
            <p>Carregando Último Assistido...</p>
        {:then profile}
            <div class="col-span-2 h-120 {!profile.keep_watching ? 'border-gray-200 border rounded-2xl' : ''} flex justify-center">
                {#if (profile.keep_watching)}
                    <div class="relative flex justify-end items-center">
                        {#if profile.keep_watching.thumbnails}
                            <img class="max-h-120 rounded-2xl" src="{PUBLIC_URL_BASE_STORAGE + '/' + profile.keep_watching.thumbnails.path}" alt="">
                        {:else}
                            <img class="max-h-120 rounded-2xl" src="/images/imagem_curso.png" alt="Imagem padrão do curso">
                        {/if}
                        <div class="flex absolute w-full self-end p-2 justify-between">
                            <h2 class="text-white font-bold text-xl self-center mx-3 mb-4">{profile.keep_watching.name}</h2>
                            <button class="hover:text-slate-600 min-w-55 flex mb-10 items-center gap-2 rounded-full self-end cursor-pointer bg-yellow-300 px-5 py-2" onclick={() => {
                                const type = profile.keep_watching.parent.type === 'course' ? 'cursos' : 'trilhas';
                                goto('/dashboard/' + type + '/' + profile.keep_watching.parent.slug + '/' + profile.keep_watching.slug);
                            }}>
                                <Play class="w-6 h-6" />
                                Continuar Assistindo
                            </button>
                        </div>
                    </div>
                {:else}
                    <div class="self-center text-center">
                        <div class="text-2xl">Você ainda não assistiu nenhuma aula</div>
                        <button class="text-blue-500 underline text-sm cursor-pointer" onclick={()=>{goto('/dashboard/cursos')}}>Navegar por cursos</button>
                    </div>
                {/if}

            </div>
        {/await}

        <div class="h-120 rounded-2xl flex flex-col gap-2 border-gray-200 border">
            <div class="w-full bg-slate-900 text-yellow-400 text-xl font-bold rounded-t-2xl text-center p-2">Últimas aulas assistidas</div>
            {#await data['profile']}
                <p>Carregando Últimas Aulas...</p>
            {:then profile}
                <div class="h-full overflow-y-auto rounded-b-2xl flex flex-col gap-2 p-2">
                    {#if (profile.last_lessons)}
                        {#each profile.last_lessons as lesson}
                             <button onclick={() => { 
                                const type = lesson.parent.type === 'course' ? "cursos" : "trilhas";
                                goto('/dashboard/' + type + '/' + lesson.parent.slug + '/' + lesson.slug);
                            }}>
                                <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-200">
                                    <div class="relative flex justify-center items-center w-1/3">
                                        {#if lesson.thumbnails}
                                            <img class="max-h-16" src="{PUBLIC_URL_BASE_STORAGE + '/' + lesson.thumbnails.path}" alt="">
                                        {:else}
                                            <img class="max-h-16" src="/images/imagem_curso.png" alt="Imagem padrão do curso">
                                        {/if}

                                        <Play class="w-8 h-8 absolute text-white" />
                                    </div>
                                    <div class="flex flex-col text-left w-2/3">
                                        <p class="text-md text-gray-700 font-bold">{lesson.name}</p>
                                        <p class="text-sm text-gray-500">Assistido por ultimo em:
                                            {lesson.parent.type === 'course' ?
                                            "Cursos - " + lesson.parent.name :
                                            "Trilhas - " + lesson.parent.name}
                                        </p>
                                    </div>

                                </div>
                            </button>
                            <hr>
                        {/each}
                    {:else}
                        <div class="flex flex-col h-full w-full justify-center text-center">
                            <p>Você ainda não assistiu nenhuma aula</p>
                            <button class="text-blue-500 underline text-sm cursor-pointer" onclick={()=>{goto('/dashboard/cursos')}}>Navegar por cursos</button>
                        </div>
                    {/if}
                </div>
            {/await}
        </div>
    </div>

    <div class="text-2xl font-bold text-slate-900">Dashboard</div>
    <div class="flex gap-4">
        <div class="h-60 w-full flex justify-center rounded-2xl">
            <img class="border-gray-400 rounded-2xl border-2" src="/images/dashboard-1.png"  alt="Dashboard">
        </div>
        <div class="h-60 w-full flex justify-center rounded-2xl">
            <img class="border-gray-400 rounded-2xl border-2" src="/images/dashboard-2.png"  alt="Dashboard">
        </div>
        <div class="h-60 w-full flex justify-center rounded-2xl">
            <img class="border-gray-400 rounded-2xl border-2" src="/images/dashboard-3.png"  alt="Dashboard">
        </div>
    </div>

    <div class="flex gap-4">
        <div class="bg-slate-900 rounded-l-2xl text-yellow-400 w-35 h-60 text-right p-4 font-bold">
            <div class="flex justify-end w-full">
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    class="w-4 h-4 fill-yellow-400"
                    ><title>YouTube</title><path
                        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
                    /></svg
                >
            </div>
            <span class="text-gray-50">VEJA AS</span>
            LIVES MAIS RECENTES
        </div>

        <div class="grid grid-cols-3 gap-4 w-full h-60">
            <div class="h-60 w-full bg-gray-100"></div>
            <div class="h-60 w-full bg-gray-100"></div>
            <div class="h-60 w-full bg-gray-100"></div>
        </div>
    </div>
    <div class="flex gap-4">
{#await data.carrousels}
    <div class="h-60 w-full flex justify-center items-center">
        <p>Carregando carrossel...</p>
    </div>
{:then carrousels}
    {#if carrousels && carrousels.length > 0}
        <Carousel.Root 
            plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
            opts={{
                align: "start",
                loop: true,
                skipSnaps: true,
            }}
            class="w-full"
        >
            <Carousel.Content class="h-60">
                {#each carrousels as carrousel}
                    <Carousel.Item class="md:basis-1/2 lg:basis-1/3">
                        <a href="{carrousel.link}" target="_blank">
                            <img 
                                class="h-full w-full object-rescale"
                                src="{PUBLIC_URL_BASE_STORAGE + '/' + carrousel.thumbnails.path}"
                                alt="{carrousel.name}"
                            >
                        </a>
                    </Carousel.Item>
                {/each}
            </Carousel.Content>
            <CarouselPrevious class="cursor-pointer" />
            <CarouselNext class="cursor-pointer" />
        </Carousel.Root>
    {:else}
        <div class="h-60 w-full flex justify-center items-center">
            <p>Nenhum item de carrossel encontrado.</p>
        </div>
    {/if}
{:catch error}
    <div class="h-60 w-full flex justify-center items-center bg-red-100 text-red-700 p-4 rounded-lg">
        <p>Ocorreu um erro ao carregar o carrossel: {error.message}</p>
    </div>
{/await}
    </div>
</div>
