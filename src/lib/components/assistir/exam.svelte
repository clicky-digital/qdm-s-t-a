<script lang="ts">
import * as Tabs from "$lib/components/ui/tabs";
import Video from "$lib/components/assistir/video.svelte";
import Lesson from "$lib/components/assistir/lesson.svelte";
import Notes from "$lib/components/assistir/notes.svelte";
import Complements from "$lib/components/assistir/complements.svelte";
import * as Select from "$lib/components/ui/select/index.js";
import Button from "../ui/button/button.svelte";
import {
    BookCheck,
    ChevronsRightIcon,
    CircleCheck,
    CircleMinus,
    Download,
    Heart,
    Play,
    RotateCw,
    SidebarCloseIcon,
    Star
} from "lucide-svelte";
import { goto } from "$app/navigation";
import ExamPlayer from "@/player/ExamPlayer.svelte";
import { PUBLIC_URL_BASE_STORAGE } from "$env/static/public";

let {contests, activeContest, activeExam, default_exam} = $props();

let url = $state(default_exam.link);

async function downloadFile(sourceFilename: string, downloadFilename: string) {
    window.open(`${PUBLIC_URL_BASE_STORAGE}/${sourceFilename}`, '_blank');
}
function formatTime(seconds: number) {
    if (!seconds) {
        return null;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh > 0) {
        return `${hh.toString().padStart(2, "0")}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm.toString().padStart(2, "0")}:${ss}`;
}


let valueSelected = $state("");
let initialTabName = $derived(contests.find(c => c.slug === activeContest)?.name ?? contests[0]?.name);
let nameConcursoSelected = $derived(contests.find(c => c.id === valueSelected)?.name ?? contests[0]?.name);
let valueSelectTrigger = $derived(valueSelected ? nameConcursoSelected : initialTabName);


</script>
<Tabs.Root value={activeContest}>
    <Tabs.List class="w-full max-w-[800px] hidden lg:max-w-full p-2 h-full md:flex justify-start overflow-x-auto">
        <div class="flex gap-2">
            {#each contests as contest}
                <Tabs.Trigger
                    class="cursor-pointer hover:bg-gray-200 px-4 py-2 border-b-2 border-transparent data-[state=active]:font-bold text-gray-700"
                    onclick={() => {
                        activeContest = contest.slug;
                        activeExam = contest.contest_exams[0].exam.slug;
                        url = contest.contest_exams[0].exam.link;
                        const newUrl = `/dashboard/concursos/${activeContest}/${activeExam}`;
                        goto(newUrl);
                    }}
                    value={activeContest}>{contest.name}
                </Tabs.Trigger>
            {/each}
        </div>
    </Tabs.List>

    <div class="flex items-end justify-end gap-2 md:hidden">
        <span class="text-lg font-bold">Concursos:</span>
        <Select.Root type="single" bind:value={valueSelected}>
            <Select.Trigger class="w-[180px] text-md">{valueSelectTrigger}</Select.Trigger>
            <Select.Content class="overflow-y-auto max-h-[200px]">
                {#each contests as contest}
                    <Select.Item onclick={() => {
                        activeContest = contest.slug;
                        activeExam = contest.contest_exams[0].exam.slug;
                        url = contest.contest_exams[0].exam.link;
                        const newUrl = `/dashboard/concursos/${activeContest}/${activeExam}`;
                        goto(newUrl);
                    }} value={contest.id} class="text-md">{contest.name}</Select.Item>
                {/each}
            </Select.Content>
        </Select.Root>
    </div>

    {#if !contests}
        <div class="flex justify-center items-center w-full h-full mt-8">
            <div class="text-gray-500 text-xl">Nenhuma prova resolvida</div>
        </div>
    {:else}
        {#each contests as contest}
            <Tabs.Content value={contest.slug}>
                {#if contest.contest_exams.length > 0}
                    {#if activeExam}
                        <div class="flex flex-col gap-2 w-full p-8 bg-gray-100 rounded-sm relative">
                            <div class="flex flex-col gap-2 w-full">
                                <div class="flex justify-between items-center font-bold text-lg mb-2">
                                    <div class="flex items-center justify-between w-full">
                                        <div class="flex items-center gap-2">
                                            <span class="bg-slate-800 text-white p-2 rounded">
                                                {default_exam.code}
                                            </span>
                                            {default_exam.name ?? contest.contest_exams[0].exam.name}
                                        </div>
                                    </div>
                                </div>

                                <div class="grid grid-cols-1 z-0 md:grid-cols-3 bg-slate-800 text-white rounded h-[400px] lg:h-[600px]">
                                    <div class="col-span-2 bg-gray-900 rounded-l h-[400px]">
                                        <ExamPlayer url={url} />
                                    </div>


                                    <div class="absolute z-10 top-135 right-0 md:relative md:z-0 md:top-0 md:left-0 bg-slate-800 text-white rounded w-full h-[400px] lg:h-[600px]">
                                        <div class="p-4 grid overflow-y-auto" style="grid-template-rows: 1fr 20px;">
                                            <div class="w-full overflow-y-auto max-h-[350px] lg:max-h-[550px]">
                                                {#each contest.contest_exams as contest_exam, key}
                                                    <div class="flex items-end border-b border-gray-300">
                                                        <div
                                                            class="grid gap-2 w-full py-2"
                                                            style="grid-template-columns: 35px 1fr 20px;"
                                                        >
                                                            <div class="flex items-center justify-center w-full">
                                                                <div class={"bg-slate-600 rounded h-full font-bold flex flex-col items-center justify-center gap-1 w-full"}>
                                                                    <div class="text-xl">{contest_exam.exam.code}</div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div class="flex justify-between items-center">
                                                                    <div class="min-h-12">
                                                                        {contest_exam.exam.name}
                                                                    </div>
                                                                </div>
                                                                <div class="flex gap-2">
                                                                    {#if contest_exam.exam.metadata.total_time}
                                                                        <span class="bg-slate-600 rounded p-1 text-xs">{formatTime(contest_exam.exam.metadata.total_time)}</span>
                                                                    {/if}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div class="flex">
                                                            {#if contest_exam.exam.resolutions}
                                                                <Button class="cursor-pointer hover:text-slate-600" variant="ghost"
                                                                    onclick={() => downloadFile(contest_exam.exam.resolutions.path, contest_exam.exam.name)}>
                                                                    <Download />
                                                                    PDF
                                                                </Button>
                                                            {/if}
                                                            <button class="cursor-pointer">
                                                                <Play class="w-4 h-4"
                                                                    onclick={() => {
                                                                        activeExam = contest_exam.exam.slug;
                                                                        url = contest_exam.exam.link;
                                                                        const newUrl = `/dashboard/concursos/${activeContest}/${activeExam}`;
                                                                        goto(newUrl);
                                                                    }}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                {/each}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                {:else}
                    <div class="flex justify-center items-center w-full h-full">
                        <div class="text-gray-500 text-xl">Nenhuma prova resolvida ainda</div>
                    </div>
                {/if}
            </Tabs.Content>
        {/each}
    {/if}
</Tabs.Root>
