<script lang="ts">
	import "../app.css";

	import Navbar from "$lib/components/navbar/top-menu.svelte";
	import TopAd from "$lib/components/navbar/top-ad.svelte";

	let { children } = $props();
</script>

<div class="w-screen">
	<TopAd />
	<Navbar />
	{@render children()}
</div>
