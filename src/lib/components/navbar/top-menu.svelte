<script lang="ts">
import { goto } from "$app/navigation";
import * as Avatar from "$lib/components/ui/avatar/index.js";
import { Bell, Heart, Menu, User } from "lucide-svelte";
import Button from "../ui/button/button.svelte";
import InputIcon from "../ui/input-icon/input-icon.svelte";
import { PUBLIC_URL_BASE_STORAGE } from '$env/static/public';

let selectedTab: string = "assistir";

let { avatar, data } = $props();

let dropdown = $state(false);

const handleTabClick = (tab: string) => {
    selectedTab = tab;
};
</script>

<div class="bg-slate-900 h-16 flex justify-center items-center px-4 lg:px-14">
    <div class="w-full">
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <div class="w-44 mr-14 lg:mr-0">
                    <img src="/images/logo.png" alt="logo" class="h-10 w-44" />
                </div>
                <div class="flex items-center hidden lg:block lg:flex">

                    <button class="cursor-pointer" onclick={()=>{goto('/dashboard')}}>
                        <div class="hover:underline hover:text-yellow-300 w-full p-5 text-lg text-white font-bold">Página Inicial</div>
                    </button>

                    <button class="cursor-pointer" onclick={()=>{goto('/dashboard/cursos')}}>
                        <div class="hover:underline hover:text-yellow-300 w-full p-5 text-lg text-white font-bold">Cursos</div>
                    </button>

                    <button class="cursor-pointer" onclick={()=>{goto('/dashboard/materiais')}}>
                        <div class="hover:underline hover:text-yellow-300 w-full p-5 text-lg text-white font-bold">Materiais</div>
                    </button>

                    <!--                <button class="cursor-pointer" onclick={()=>{goto('/dashboard/simulados')}}>-->
                    <!--                    <div class="hover:underline hover:text-yellow-300 w-full p-5 text-lg text-white font-bold">Simulados</div>-->
                    <!--                </button>-->

                    <button class="cursor-pointer" onclick={()=>{goto('/dashboard/trilhas')}}>
                        <div class="hover:underline hover:text-yellow-300 w-full p-5 text-lg text-white font-bold">Trilhas (Aulas)</div>
                    </button>

                    <button class="cursor-pointer" onclick={()=>{goto('/dashboard/concursos')}}>
                        <div class="hover:underline hover:text-yellow-300 w-full p-5 text-lg text-white font-bold">Provas Resolvidas</div>
                    </button>
                </div>
            </div>

            <div class="flex items-center gap-4">
                <div class="flex items-center gap-4 lg:flex">
                    <InputIcon class="w-80" placeholder="Pesquisar" />
                    <div class="flex items-center gap-1">
                        <Button variant="link" class="text-gray-50 relative cursor-pointer"
                            onclick={()=>{dropdown ? dropdown = false : dropdown = true}}>
                            <Menu />
                            <div class="{!dropdown ? 'hidden' : ''} bg-slate-900 z-10 rounded-b-2xl absolute top-12 w-36 flex flex-col">
                                <button class="cursor-pointer" onclick={()=>{goto('/dashboard')}}>
                                    <div class="hover:bg-slate-800 w-full p-5">Página Inicial</div>
                                </button>
                                <hr class="mx-2">
                                <button class="cursor-pointer" onclick={()=>{goto('/dashboard/cursos')}}>
                                    <div class="hover:bg-slate-800 w-full p-5">Cursos</div>
                                </button>
                                <hr class="mx-2">
                                <button class="cursor-pointer" onclick={()=>{goto('/dashboard/materiais')}}>
                                    <div class="hover:bg-slate-800 w-full p-5">Materiais</div>
                                </button>
                                <hr class="mx-2">
                                <button class="cursor-pointer" onclick={()=>{goto('/dashboard/simulados')}}>
                                    <div class="hover:bg-slate-800 w-full p-5">Simulados</div>
                                </button>
                                <hr class="mx-2">
                                <button class="cursor-pointer" onclick={()=>{goto('/dashboard/trilhas')}}>
                                    <div class="hover:bg-slate-800 w-full p-5 rounded-b-2xl">Trilhas (Aulas)</div>
                                </button>
                                <hr class="mx-2">
                                <button class="cursor-pointer" onclick={()=>{goto('/dashboard/concursos')}}>
                                    <div class="hover:bg-slate-800 w-full p-5 rounded-b-2xl">Provas Resolvidas</div>
                                </button>
                            </div>
                        </Button>

                        <Button variant="link" class="text-gray-50 cursor-pointer" onclick={() => goto('/dashboard/favoritos')}>
                            <Heart />
                        </Button>

                        <!--                        <Button variant="link" class="text-gray-50 cursor-pointer">-->
                        <!--                            <Bell />-->
                        <!--                        </Button>-->
                        <Avatar.Root class="cursor-pointer" onclick={()=>{goto('/dashboard/perfil')}}>
                            <Avatar.Image src={PUBLIC_URL_BASE_STORAGE + '/' + avatar} alt="avatar" />
                            <Avatar.Fallback class="bg-black text-gray-50">
                                <User color="white" />
                            </Avatar.Fallback>
                        </Avatar.Root>
                    </div>
                </div>

            </div>
        </div>
    </div>
</div>
