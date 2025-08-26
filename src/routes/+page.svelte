<script>
    import {redirect} from "@sveltejs/kit";
    import {onMount} from "svelte";
    import { goto } from "$app/navigation";

    onMount(()=>{
        goto('/login');
    })
</script>
