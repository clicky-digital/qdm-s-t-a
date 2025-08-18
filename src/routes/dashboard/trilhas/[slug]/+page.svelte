<script lang="ts">
  import { page } from "$app/state";
  import { CornerUpLeft } from "lucide-svelte";

  import Module from "$lib/components/assistir/modules.svelte";

  let { params } = page;
  let promise = fetch("http://localhost/api/v1/get-trails/"+params.slug)
      .then(res => res.json());

  let items = [
    {
      "id": 1,
      "name": "Semana 1",
      "lessons": [
        {
          "name": "Aula 1",
          "description": "Aula de prática",
          "video": "",
          "time": "10:00",
          "watched": true,
          "handout": "",
          "mind_map": "",
          "podcast": "",
          "mock_test": "",
          "solved": [
            "",
          ],
        },
        {
          "name": "Aula 2",
          "description": "Aula de prática",
          "video": "",
          "time": "12:00",
          "watched": false,
          "handout": "",
          "mind_map": "",
          "podcast": "",
          "mock_test": "",
          "solved": [
            "",
          ],
        },
      ],
    },
    {
      "id": 2,
      "name": "Semana 2",
      "lessons": [
        {
          "name": "Aula 3",
          "description": "Aula de prática",
          "video": "",
          "time": "10:00",
          "watched": false,
          "handout": "",
          "mind_map": "",
          "podcast": "",
          "mock_test": "",
          "solved": [
            "",
          ],
        },
        {
          "name": "Aula 4",
          "description": "Aula de prática",
          "video": "",
          "time": "12:00",
          "watched": false,
          "handout": "",
          "mind_map": "",
          "podcast": "",
          "mock_test": "",
          "solved": [
            "",
          ],
        },
      ],
    },
    {
      "id": 3,
      "name": "Semana 3",
      "lessons": [
        {
          "name": "Aula 5",
          "description": "Aula de prática",
          "video": "",
          "time": "10:00",
          "watched": false,
          "handout": "",
          "mind_map": "",
          "podcast": "",
          "mock_test": "",
          "solved": [
            "",
          ],
        },
        {
          "name": "Aula 6",
          "description": "Aula de prática",
          "video": "",
          "time": "12:00",
          "watched": false,
          "handout": "",
          "mind_map": "",
          "podcast": "",
          "mock_test": "",
          "solved": [
            "",
          ],
        },
      ],
    }
  ];
</script>

<div class="container mx-auto flex flex-col my-4">
  <div class="flex items-center text-gray-500">
    <CornerUpLeft class="w-4 h-4" />
    <span class="">Voltar</span>
  </div>

    <div class="title">Nome do Curso</div>
    <div class="text-gray-400 text-sm">Prof. Marcus Ennes</div>

    {#await promise}
        <p>Carregando trilhas...</p>
    {:then trail}
        {trail['trail'][0]['name']}
    {:catch error}
        <p>Algo deu errado: {error.message}</p>
    {/await}
    <div class="flex flex-col gap-4 my-4">
      <Module modules={items} />
    </div>
</div>
