<script lang="ts">
  import TopAd from "$lib/components/navbar/top-ad.svelte";
  import TopMenu from "$lib/components/navbar/top-menu.svelte";
    import Footer from "@/components/footer/footer.svelte";

  let { children } = $props();
</script>

<div class="w-screen">
  <TopAd />
  <TopMenu />
  {@render children()}
  <Footer />
</div>
