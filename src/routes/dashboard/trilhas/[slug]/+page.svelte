<script lang="ts">
  import { page } from "$app/state";
    import { CornerUpLeft } from "lucide-svelte";
  let { params } = page;
</script>

<div class="container mx-auto flex flex-col my-4">
  <div class="flex items-center text-gray-500">
    <CornerUpLeft class="w-4 h-4" />
    <span class="">Voltar</span>
  </div>

    <div class="title">Nome do Curso</div>
    <div class="text-gray-400 text-sm">Prof. Marcus Ennes</div>

    <div class="flex flex-col gap-4 my-4">
       
    </div>
</div>
