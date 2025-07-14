<script lang="ts">
  import { goto } from "$app/navigation";
  import * as Avatar from "$lib/components/ui/avatar/index.js";
  import { Bell, Heart, Menu } from "lucide-svelte";
  import Button from "../ui/button/button.svelte";
  import InputIcon from "../ui/input-icon/input-icon.svelte";

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
        <div class="flex gap-1">
          <InputIcon class="w-80" placeholder="Pesquisar" />

          <Button variant="link" class="text-gray-50">
            <Menu />
          </Button>
          
          <Button variant="link" class="text-gray-50">
            <Heart />
          </Button>

          <Button variant="link" class="text-gray-50">
            <Bell />
          </Button>
        </div>

        <Avatar.Root>
          <Avatar.Image src="/images/avatar.png" alt="avatar" />
          <Avatar.Fallback class="bg-black text-gray-50">PJ</Avatar.Fallback>
        </Avatar.Root>
      </div>
    </div>
  </div>
</div>
