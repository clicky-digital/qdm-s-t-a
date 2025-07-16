<script>
    import { BookCheck, Brain, Computer, Download, Megaphone, Puzzle } from "lucide-svelte";
    import Button from "../ui/button/button.svelte";
</script>

<div class="flex gap-2 w-full font-normal text-2xl">
    <Button variant="ghost">
        <BookCheck /> 
        Apostilas
    </Button>

    <Button variant="ghost">
        <Brain /> 
        Mapa Mental
    </Button>
    
    <Button variant="ghost">
        <Megaphone />
        Podcast
    </Button>

    <Button variant="ghost">
        <Computer />
        Monitoria
    </Button>

    <Button variant="ghost">
        <Puzzle />
        Simulado
    </Button>

    <Button variant="ghost">
        <Download />
        Exercícios Resolvidos
    </Button>
</div>
