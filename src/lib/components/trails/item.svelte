<script lang="ts">
    import Button from "@/components/ui/button/button.svelte";
    import { Brain, Computer, Download, LogIn, Megaphone, Pin, Play, Puzzle } from "lucide-svelte";
    import { goto } from '$app/navigation';

    let { trailName, professor, slug, thumbnail } = $props();
</script>

<div class="h-60 w-full bg-gray-100 rounded relative flex gap-6 items-center p-4">
    <div class="w-72 h-full bg-gray-600 rounded-lg">
        <img class="w-full h-full" src={"http://localhost/storage" + "/" + thumbnail} alt="">
    </div>

    <div class="flex flex-col gap-1">
        <div class="text-slate-900 text-lg font-bold">
            {trailName}
        </div>

        <div class="text-gray-500 text-sm">
            { professor }
        </div>

        <div>
            <Button onclick={() => goto(`/dashboard/trilhas/${slug}`)} variant="default" class="cursor-pointer">
                <Play class="w-4 h-4" />
                Continuar
            </Button>

            <Button onclick={() => goto(`/dashboard/trilhas/${slug}?start=first`)} variant="default" class="bg-yellow-500 hover:bg-yellow-600 cursor-pointer">
                <LogIn class="w-4 h-4" />
                Acessar 
            </Button>
            
            <Button variant="ghost">
                <Brain />
            </Button>
            
            <Button variant="ghost">
                <Megaphone />
            </Button>

            <Button variant="ghost">
                <Computer />
            </Button>
  
            <Button variant="ghost">
                <Puzzle />
            </Button>

            <Button variant="ghost">
                <Download />
            </Button>
        </div>
    </div>

    <div class="absolute top-0 right-0 p-4">
        <Pin class="w-4 h-4" />
    </div>
</div>
