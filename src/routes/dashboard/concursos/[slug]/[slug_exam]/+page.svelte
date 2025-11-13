<script lang="ts">
    import { page } from "$app/state";
    import { CornerUpLeft } from "lucide-svelte";
    import Exam from "@/components/assistir/exam.svelte";
    import { goto } from "$app/navigation";

    let { data } = $props();

</script>

<div class="container mx-auto flex flex-col my-4 px-8 lg:px-0">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <button class="cursor-pointer" onclick={()=>{goto('/dashboard/concursos')}}>Voltar ao Início</button>
    </div>

    <div class="flex flex-col gap-4 my-4">
        <div class="text-3xl font-bold">Concursos</div>
        <div class="text-gray-400 text-sm">Prof. Marcus Ennes</div>
        <div class="flex flex-col gap-4 my-4">
            <Exam
                contests={data.contests}
                activeContest={data.activeContest}
                activeExam={data.activeExam}
                default_exam={data.exam}
            />
        </div>
    </div>
</div>
