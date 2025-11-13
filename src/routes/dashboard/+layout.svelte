<script lang="ts">
  import TopAd from "$lib/components/navbar/top-ad.svelte";
  import TopMenu from "$lib/components/navbar/top-menu.svelte";
  import Footer from "@/components/footer/footer.svelte";

  let { data, children } = $props();
</script>

<div class="w-full">
    {#await data['profile']}
        <p>Carregando...</p>
    {:then profile}
        <div class="min-h-[100vh] grid" style="grid-template-rows: 64px 64px 1fr 115px">
            <TopAd />
            <TopMenu avatar={profile.student.avatar}/>
            {@render children()}
            <Footer />
        </div>
    {:catch error}
        <p>Algo deu errado: {error.message}</p>
    {/await}
</div>
