<script lang="ts">
    import { User, Lock } from "lucide-svelte";
    import { redirect } from "@sveltejs/kit";

    let name: string = "";
    let email: string = "";
    let password: string = "";

    let error: string = "";

    const handleSubmit = async () => {
        let urlBase = 'http://localhost/api/v1/register'


        const response = await fetch(urlBase, {
            method: 'POST',
            body: JSON.stringify({
                "name": `${name}`,
                "email": `${email}`,
                "password": `${password}`
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log(response)
        if(response.status === 201) {
            window.location.href = "/login";
        }
    };
</script>

<div class="bg-slate-900 h-screen flex justify-center items-center">
    <div class="relative">
        <img
            src="/images/logo.png"
            alt="logo"
            class="w-full absolute items-center"
        />

        <div class="w-96">
            <div class="flex items-center justify-center text-yellow-300 text-3xl font-bold">
                Painel do Aluno
            </div>

            <div
                class="bg-slate-800 w-full max-w-md p-6 rounded-2xl border border-gray-500 shadow-sm pt-10 mt-10"
            >
                <form
                    on:submit|preventDefault={handleSubmit}
                    class="w-full flex flex-col gap-3"
                >
                    <div class="flex items-center justify-center w-full border-gray-300 sm:text-sm bg-white p-1 rounded-full">
                        <div class="flex items-center bg-slate-900 rounded-full p-1 text-yellow-300">
                            <User class="w-4 h-4" />
                        </div>

                        <input
                            type="name"
                            name="name"
                            id="name"
                            bind:value={name}
                            class="block w-full sm:text-sm border-0 bg-transparent focus:border-0 focus:ring-0 h-5"
                            placeholder="Name"
                            autocomplete="Name"
                            required
                        />
                    </div>

                    <div class="flex items-center justify-center w-full border-gray-300 sm:text-sm bg-white p-1 rounded-full">
                        <div class="flex items-center bg-slate-900 rounded-full p-1 text-yellow-300">
                            <User class="w-4 h-4" />
                        </div>

                        <input
                            type="email"
                            name="email"
                            id="email"
                            bind:value={email}
                            class="block w-full sm:text-sm border-0 bg-transparent focus:border-0 focus:ring-0 h-5"
                            placeholder="Email"
                            autocomplete="email"
                            required
                        />
                    </div>

                    <div class="flex items-center justify-center w-full border-gray-300 sm:text-sm bg-white p-1 rounded-full">
                        <div class="flex items-center bg-slate-900 rounded-full p-1 text-yellow-300">
                            <Lock class="w-4 h-4" />
                        </div>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            bind:value={password}
                            class="block w-full sm:text-sm border-0 bg-transparent focus:border-0 focus:ring-0 h-5"
                            placeholder="Password"
                            autocomplete="current-password"
                            required
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            class="w-full flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full"
                        >
                            Registrar
                        </button>
                    </div>
                </form>

                <div class="flex items-center justify-end gap-2 pt-6 text-xs">
                    <div class="text-yellow-300 italic">
                        <a href="/login">
                            Logar
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="text-center text-xs text-gray-100 pt-2 absolute bottom-10 left-0 right-0">
        Químida do Monstro 2025. Todos os direitos Reservados.
    </div>
</div>
