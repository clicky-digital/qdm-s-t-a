<script lang="ts">
	import { goto } from "$app/navigation";

	let selectedTab: string = "assistir";

	const handleTabClick = (tab: string) => {
		selectedTab = tab;
	};
</script>

<div class="bg-slate-900 h-16 flex justify-center items-center">
  <div class="container">
    <div class="flex justify-between">
      <div>
        <a href="/" class="text-yellow-300 text-xl font-bold">
          <img src="/images/logo.png" alt="logo" class="h-10" />
        </a>
      </div>

      <div class="flex items-center gap-4">
      </div>
    </div>
  </div>
</div>
