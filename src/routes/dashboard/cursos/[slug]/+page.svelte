<script lang="ts">
  import { CornerUpLeft } from "lucide-svelte";
  import CourseItem from "@/components/courses/item.svelte";

  let { data } = $props()

</script>

<div class="container mx-auto flex flex-col my-4">
    <div class="flex items-center text-gray-500">
        <CornerUpLeft class="w-4 h-4" />
        <span class="">Voltar ao Início</span>
    </div>

    <div class="title">Cursos</div>
    <div class="flex flex-col gap-4 my-4">
        {#await data['course']}
            <p>Carregando curso...</p>
        {:then course}
            <h1>Curso {course['course'][0]['name']}</h1>

            <p>{course['course'][0]['description']}</p>
        {:catch error}
            <p>Algo deu errado: {error.message}</p>
        {/await}
    </div>
</div>



