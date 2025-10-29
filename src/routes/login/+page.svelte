<script lang="ts">
	import { User, Lock } from "lucide-svelte";

    let { data, form } = $props();
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
                <div class="flex items-center justify-center text-yellow-300 text-lg font-bold pb-2">
                    {form?.message}
                </div>
				<form
                    method="POST" action="?/login"
					class="w-full flex flex-col gap-3"
				>
					<div class="flex items-center justify-center w-full border-gray-300 sm:text-sm bg-white p-1 rounded-full">
						<div class="flex items-center bg-slate-900 rounded-full p-1 text-yellow-300">
							<User class="w-4 h-4" />
						</div>

						<input
                            value="{form?.email}"
							type="email"
							name="email"
							id="email"
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
							class="block w-full sm:text-sm border-0 bg-transparent focus:border-0 focus:ring-0 h-5"
							placeholder="Password"
							autocomplete="current-password"
							required
						/>
					</div>

					<div>
						<button
							type="submit"
							class="w-full cursor-pointer flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-full"
						>
							Acessar Painel
						</button>
					</div>
					<div 
						class="flex items-center justify-center"
					>
						<label 
							class="flex items-center justify-center w-full text-xs p-1 text-gray-100 gap-2"
						>
							<input
                                name="rememeberPassword"
								type="checkbox"
								class="w-4 h-4 border-gray-300 rounded-sm"
							/>
								Lembrar minha senha
						</label>
					</div>
				</form>

				<div class="flex items-center justify-between gap-2 pt-6 text-xs">
					<div class="text-gray-100">
						<a href="/recuperar-senha">
							Esqueci minha senha
						</a>
					</div>

					<div class="text-yellow-300 italic">
						<a href="/cadastrar-se">
							Cadastrar-se
						</a>
					</div>
				</div>
			</div>
		</div>	
	</div>

	<div class="text-center text-xs text-gray-100 pt-2 absolute bottom-10 left-0 right-0">
		Química do Monstro 2025. Todos os direitos Reservados.
	</div>
</div>
