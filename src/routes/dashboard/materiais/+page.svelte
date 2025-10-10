<script lang="ts">
    import InputIcon from '@/components/ui/input-icon/input-icon.svelte';
    import { FileText, BrainCircuit, Mic } from 'lucide-svelte';

    export let data;

    let searchTerm = '';

	$: filteredCourses =
		data.courses
			?.map((course) => ({
				...course,
				lessons: course.lessons.filter((lesson) =>
					lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
				)
			}))
			.filter((course) => course.lessons.length > 0) || [];

	$: filteredTrails =
		data.trails
			?.map((trail) => ({
				...trail,
				lessons: trail.lessons.filter((lesson) =>
					lesson.name.toLowerCase().includes(searchTerm.toLowerCase())
				)
			}))
			.filter((trail) => trail.lessons.length > 0) || [];

    async function downloadFile(sourceFilename: string, downloadFilename: string) {
        try {
            const base64_filename = btoa(sourceFilename);

            const apiUrl = `http://localhost/api/v1/download/${base64_filename}`;

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error request: ${response.statusText}`);
            }

            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = downloadFilename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('O download falhou:', error);
            alert('O download falhou. Verifique o console para mais detalhes.');
        }
    }

    function getFilename(lessonName: string, materialType: string, sourceUrl: string): string {
        const cleanName = lessonName.replace(/[^a-zA-Z0-9_\s-]/g, '').replace(/\s+/g, '_');
        const extension = sourceUrl.split('.').pop()?.toLowerCase() || 'file';
        return `${materialType}_${cleanName}.${extension}`;
    }
</script>

<div class="p-4 md:p-8 w-full">
    <h1 class="text-2xl md:text-3xl font-bold mb-8">Materiais de Apoio</h1>

    
	<div class="mb-8">
		<InputIcon
			bind:value={searchTerm}
			class="bg-none w-60 md:w-1/2 lg:w-1/4 border-gray-400 border-1"
			placeholder="Pesquisar aula..."
		/>
	</div>
    {#if filteredCourses.length > 0}
        <div class="mb-12">
            <div class="flex justify-between items-center mb-6 border-b">
                <h2 class="text-xl md:text-2xl font-semibold pb-2">Cursos</h2>
            </div>
            {#each filteredCourses as course}
                <div class="mb-8">
                    <h3 class="text-lg md:text-xl font-bold mb-3 text-gray-700">{course.name}</h3>
                    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table class="min-w-full text-sm text-left">
                            <thead class="bg-slate-800 text-white">
                                <tr>
                                    <th class="p-3 font-semibold">Aula</th>
                                    <th class="p-3 font-semibold text-center w-36">Apostila</th>
                                    <th class="p-3 font-semibold text-center w-36">Mapa Mental</th>
                                    <th class="p-3 font-semibold text-center w-36">Podcast</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each course.lessons as lesson}
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="p-3 font-medium text-gray-800">{lesson.name}</td>
                                        <td class="p-3 text-center">
                                            {#if lesson.apostila_url}
                                                <button on:click={() => downloadFile(lesson.apostila_url, getFilename(lesson.name, 'Apostila', lesson.apostila_url))} title="Baixar Apostila" class="cursor-pointer inline-flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                                                    <FileText class="w-5 h-5" />
                                                </button>
                                            {:else}
                                                <span class="text-gray-400 text-xs">Não disponível</span>
                                            {/if}
                                        </td>
                                        <td class="p-3 text-center">
                                            {#if lesson.mapa_mental_url}
                                                <button on:click={() => downloadFile(lesson.mapa_mental_url, getFilename(lesson.name, 'Mapa_Mental', lesson.mapa_mental_url))} title="Baixar Mapa Mental" class="cursor-pointer inline-flex items-center justify-center p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors">
                                                    <BrainCircuit class="w-5 h-5" />
                                                </button>
                                            {:else}
                                                <span class="text-gray-400 text-xs">Não disponível</span>
                                            {/if}
                                        </td>
                                        <td class="p-3 text-center">
                                            {#if lesson.podcast_url}
                                                <button on:click={() => downloadFile(lesson.podcast_url, getFilename(lesson.name, 'Podcast', lesson.podcast_url))} title="Baixar Podcast" class="cursor-pointer inline-flex items-center justify-center p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors">
                                                    <Mic class="w-5 h-5" />
                                                </button>
                                            {:else}
                                                <span class="text-gray-400 text-xs">Não disponível</span>
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    {#if filteredTrails.length > 0}
        <div class="mb-12">
			<div class="flex justify-between items-center mb-6 border-b">
				<h2 class="text-xl md:text-2xl font-semibold pb-2">Trilhas</h2>
			</div>
            {#each filteredTrails as trail}
                <div class="mb-8">
                    <h3 class="text-lg md:text-xl font-bold mb-3 text-gray-700">{trail.name}</h3>
                    <div class="overflow-x-auto bg-white rounded-lg shadow-md">
                        <table class="min-w-full text-sm text-left">
                            <thead class="bg-slate-800 text-white">
                                <tr>
                                    <th class="p-3 font-semibold">Aula</th>
                                    <th class="p-3 font-semibold text-center w-36">Apostila</th>
                                    <th class="p-3 font-semibold text-center w-36">Mapa Mental</th>
                                    <th class="p-3 font-semibold text-center w-36">Podcast</th>
                                </tr>
                            </thead>
                            <tbody>
                                {#each trail.lessons as lesson}
                                    <tr class="border-b hover:bg-gray-50">
                                        <td class="p-3 font-medium text-gray-800">{lesson.name}</td>
                                        <td class="p-3 text-center">
                                            {#if lesson.apostila_url}
                                                <button on:click={() => downloadFile(lesson.apostila_url, getFilename(lesson.name, 'Apostila', lesson.apostila_url))} title="Baixar Apostila" class="inline-flex items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors">
                                                    <FileText class="w-5 h-5" />
                                                </button>
                                            {:else}
                                                <span class="text-gray-400 text-xs">Não disponível</span>
                                            {/if}
                                        </td>
                                        <td class="p-3 text-center">
                                            {#if lesson.mapa_mental_url}
                                                <button on:click={() => downloadFile(lesson.mapa_mental_url, getFilename(lesson.name, 'Mapa_Mental', lesson.mapa_mental_url))} title="Baixar Mapa Mental" class="inline-flex items-center justify-center p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200 transition-colors">
                                                    <BrainCircuit class="w-5 h-5" />
                                                </button>
                                            {:else}
                                                <span class="text-gray-400 text-xs">Não disponível</span>
                                            {/if}
                                        </td>
                                        <td class="p-3 text-center">
                                            {#if lesson.podcast_url}
                                                <button on:click={() => downloadFile(lesson.podcast_url, getFilename(lesson.name, 'Podcast', lesson.podcast_url))} title="Baixar Podcast" class="inline-flex items-center justify-center p-2 bg-orange-100 text-orange-600 rounded-full hover:bg-orange-200 transition-colors">
                                                    <Mic class="w-5 h-5" />
                                                </button>
                                            {:else}
                                                <span class="text-gray-400 text-xs">Não disponível</span>
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>
            {/each}
        </div>
    {/if}

    {#if filteredCourses.length === 0 && filteredTrails.length === 0}
        <div class="flex justify-center items-center h-64">
            <p class="text-gray-500 text-lg">
                {#if searchTerm.length > 0}
                    Nenhum material encontrado para "{searchTerm}".
                {:else}
                    Nenhum material de apoio disponível.
                {/if}
            </p>
        </div>
    {/if}
</div>
