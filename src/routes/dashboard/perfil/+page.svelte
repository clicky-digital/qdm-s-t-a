<script lang="ts">
import { User, MessageSquare, Mail, CreditCard } from "lucide-svelte";
import { Button } from "@/components/ui/button/index.js";
import { Input } from "@/components/ui/input/index.js";
import { PUBLIC_URL_BASE_STORAGE } from '$env/static/public';
import { Whatsapp } from 'svelte-bootstrap-icons';
import { Time } from "vidstack";
import { goto } from "$app/navigation";

let { data, form } = $props();

let view = $state('profile');

let password = $state('');
let confirmPassword = $state('');
let passwordsMatch = $state(true);
let minimumPasswordLength = $state(false);

let selectedFile = $state<File | null>(null);

const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL"
    }).format(value);
  };

function handleSubmit(submitter?: string) {
    if(submitter == "updatePassword") {
        validatePassword();

        if(password.length < 6) {
            event.preventDefault()
        }
        if (!passwordsMatch) {
            event.preventDefault();
        }
    }
}
function validatePassword()
    {
    passwordsMatch = password === confirmPassword;
    minimumPasswordLength = password.length >= 6
}
async function logout(){
    let promise = await fetch('/api/logout', {method: 'POST'});
    goto('/login')
}

</script>

<div class="w-full flex p-5 justify-center items-center">
    {#await data.profile}
        <div class="flex justify-center items-center font-bold text-2xl w-full">
            Carregando Perfil...
        </div>
        {:then profile}
        <div class="w-12/12 lg:w-9/12 h-full flex flex-col lg:flex-row gap-2">
            <div class="flex flex-col w-full lg:w-3/12 p-7 bg-slate-900/10 rounded-2xl">
                <div class="w-full flex flex-col gap-5 justify-center items-center h-2/5">

                    {#if (profile?.student?.avatar && !selectedFile)}
                        <img class="size-32 lg:size-48 border-2 rounded-full" src="{PUBLIC_URL_BASE_STORAGE + '/' + profile?.student?.avatar}" alt="User Avatar">
                    {:else}
                        {#if selectedFile}
                            <img
                                class="size-48 p-5 rounded-full"
                                src={URL.createObjectURL(selectedFile)}
                                alt="Imagem selecionada"
                                style="max-width: 300px; max-height: 300px;" />
                        {:else}
                            <div class="justify-center items-center flex flex-col">
                                <User class="size-48 p-5 rounded-full" />
                            </div>
                        {/if}
                    {/if}
                </div>
                <div class="h-3/5 flex flex-col pt-10">
                    <Button class="w-full cursor-pointer {view === 'profile' ? 'bg-yellow-300' : 'bg-transparent'} text-black hover:bg-slate-900/10 font-bold" onclick={()=>{view = "profile"}}>Informações do Perfil</Button>
                    <hr/>
                    <Button class="w-full cursor-pointer {view === 'sell' ? 'bg-yellow-300' : 'bg-transparent'} text-black hover:bg-slate-900/10 font-bold" onclick={()=>{view = "sell"}}>Informações de Compras</Button>
                    <hr/>
                    <Button class="w-full cursor-pointer {view === 'need-help' ? 'bg-yellow-300' : 'bg-transparent'} text-black hover:bg-slate-900/10 font-bold" onclick={()=>{view = "need-help"}}>Precisa de ajuda?</Button>
                </div>
                <Button onclick={() => logout()} class="bg-slate-900/10 text-red-500 cursor-pointer hover:text-white hover:bg-red-500">Sair</Button>
            </div>
            <div class="w-full lg:w-9/12">
                <form class="w-full h-full {view !== 'profile' ? 'hidden' : ''}" method="POST" enctype="multipart/form-data" onsubmit={()=>handleSubmit(event.submitter.value)}>
                    <div class="{view !== 'profile' ? 'hidden' : ''} w-full h-full flex flex-col items-center py-4 bg-slate-900/10 rounded-2xl">
                        <div class="flex w-full h-1/2">
                            <div class="w-1/2 flex flex-col items-center justify-center">
                                <div class="w-9/12">
                                    <label for="avatar">
                                        {#if profile?.student?.avatar}
                                            Alterar foto de perfil (jpg/png/jpeg):
                                        {:else}
                                            Foto de Perfil (jpg/png/jpeg):
                                        {/if}
                                        <div class="flex text-sm p-2 bg-white rounded-sm cursor-pointer">
                                            Clique aqui para &nbsp;<b>{#if selectedFile}alterar{:else}escolher{/if}</b>.
                                        </div>
                                    </label>
                                    <Input id="avatar" name="avatar" accept="image/*" type="file" class="w-full hidden" onchange={(e) => selectedFile = e.target.files[0]}></Input>
                                </div>
                                <div class="w-9/12">
                                    <label for="name">Nome:</label>
                                    <Input id="name" name="name" placeholder="Nome" class="w-full" value={profile?.student?.name}></Input>
                                </div>
                                <div class="w-9/12">
                                    <label for="email">E-mail:</label>
                                    <Input id="email" name="email" placeholder="E-mail" class="w-full" value={profile?.student?.email}></Input>
                                </div>
                                <div class="w-9/12">
                                    <label for="phone">Telefone:</label>
                                    <Input id="phone" name="phone" placeholder="Telefone" class="w-full" value={profile?.student?.phone}></Input>
                                </div>
                            </div>
                            <div class=" w-1/2 flex flex-col justify-center items-center gap-5">
                                <div class="w-9/12">
                                    <label for="name">Senha <span class="text-red-500">*</span></label>
                                    <Input bind:value={password}  oninput={()=>validatePassword()} name="password" placeholder="Senha" type="password"></Input>
                                </div>
                                <div class="w-9/12">
                                    <label for="name">Confirme sua Senha<span class="text-red-500">*</span></label>
                                    <Input bind:value={confirmPassword} oninput={()=>validatePassword()} name="confirmPassword" placeholder="Confirme sua Senha" type="password"></Input>
                                </div>
                                {#if !minimumPasswordLength}
                                    <span class="text-xs p-0 m-0 w-9/12">A senha deve conter pelo menos 6 caracteres.</span>
                                {/if}
                                {#if !passwordsMatch && minimumPasswordLength}
                                    <span class="text-xs text-red-500 p-0 m-0">As senhas devem ser iguais.</span>
                                {/if}
                                <Button value="updatePassword" disabled={!passwordsMatch || !minimumPasswordLength} formaction="?/updatePassword" type="submit" class="w-9/12 cursor-pointer">
                                    Alterar Senha
                                </Button>
                            </div>
                        </div>
                        <div class="flex flex-col items-center w-full h-1/2">
                            <div class="flex w-11/12 gap-5 p-2">
                                <div class="w-4/12">
                                    <label for="zip_code">CEP:</label>
                                    <Input name="zip_code" id="zip_code" placeholder="CEP" value={profile?.student?.zip_code}></Input>
                                </div>
                                <div class="w-4/12">
                                    <label for="district">Bairro:</label>
                                    <Input name="district" id="district" placeholder="Bairro" value={profile?.student?.district}></Input>
                                </div>
                                <div class="w-2/12">
                                    <label for="uf">Estado:</label>
                                    <Input name="uf" id="uf" placeholder="Estado" value={profile?.student?.uf}></Input>
                                </div>
                                <div class="w-3/12">
                                    <label for="city">Cidade:</label>
                                    <Input name="city" id="city" placeholder="Cidade" value={profile?.student?.city}></Input>
                                </div>
                            </div>
                            <div class="flex w-11/12 gap-5 p-2">
                                <div class="w-8/12">
                                    <label for="address">Endereço:</label>
                                    <Input name="address" id="address" placeholder="Endereço" value={profile?.student?.address}></Input>
                                </div>
                                <div class="w-4/12">
                                    <label for="number">Número:</label>
                                    <Input name="number" id="number" placeholder="Número" value={profile?.student?.number}></Input>
                                </div>
                            </div>
                            <div class="w-11/12 p-2">
                                <label for="complement">Complemento:</label>
                                <Input name="complement" id="complement" placeholder="Complemento" value={profile?.student?.complement}></Input>
                            </div>
                            <div class="w-11/12 p-2 lg:mb-6">
                                <Button value="update" type="submit" formaction="?/updateProfile" class="w-12/12 mt-2 cursor-pointer">
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
                <div class="{view !== 'sell' ? 'hidden' : ''} w-full h-full bg-slate-900/10 rounded-2xl p-8 flex flex-col items-center">
                    {#await data.plans_promise}
                        <p>Carregando Informações de Compra...</p>
                        {:then plans_promise}
                        <div class="w-full h-full">
                            <h1 class="text-2xl font-bold mb-8">Planos</h1>
                            {#if plans_promise.length > 0}
                                <table class="text-center w-full bg-white text-white shadow-md rounded-2xl">
                                    <thead class="w-full bg-slate-900">
                                        <tr>
                                            <th class="px-6 py-3 rounded-tl-2xl" >Nome do Plano</th>
                                            <th class="px-6 py-3" >Descrição</th>
                                            <th class="px-6 py-3" >Preço</th>
                                            <th class="px-6 py-3 rounded-tr-2xl" >Próxima Cobrança</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each plans_promise as p}
                                            {@const date = p.date_next_charge ? new Date(p.date_next_charge) : null}
                                            <tr class="text-black">
                                                <td class="px-6 py-4" >{p.plan.name}</td>
                                                <td class="px-6 py-4 text-start wrap-anywhere w-6/12" >{p.plan.description ?? "Sem descrição"}</td>
                                                <td class="px-6 py-4" >{formatCurrency(p.plan.price)}</td>
                                                <td class="px-6 py-4" >{date ? `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}` : "Sem informações"}</td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            {:else}
                                <div class="w-full h-full flex items-center justify-center">
                                    <h2 class="font-bold text-xl">Nenhuma informação disponível</h2>
                                </div>
                            {/if}
                        </div>
                    {/await}
                    {#await data.product_promise}
                        <p>Carregando Informações de Compra...</p>
                        {:then product_promise}
                        <div class="w-full h-full">
                            <h1 class="text-2xl font-bold my-8">Produtos</h1>
                            {#if product_promise.length > 0}
                                <table class="text-center bg-white shadow-md w-full text-white rounded-2xl">
                                    <thead class="w-full bg-slate-900">
                                        <tr>
                                            <th class="px-6 py-3 rounded-tl-2xl rounded-tr-2xl" >Nome do Produto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {#each product_promise as p}
                                            <tr class="text-black text-start">
                                                <td class="px-6 py-4" >{p.product.name}</td>
                                            </tr>
                                        {/each}
                                    </tbody>
                                </table>
                            {:else}
                                <div class="w-full h-full flex items-center justify-center">
                                    <h2 class="font-bold text-xl">Nenhuma informação disponível</h2>
                                </div>
                            {/if}
                        </div>
                    {/await}
                </div>
                <div class="{view !== 'need-help' ? 'hidden' : ''} w-full h-full bg-slate-900/10 rounded-2xl p-8 flex flex-col items-center">
                    <h2 class="text-2xl font-bold mb-8 text-gray-800">Como podemos te ajudar?</h2>
                    <div class="w-full max-w-md flex flex-col gap-5">
                        <a href="https://wa.me/{profile.need_help?.need_help_phone}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
                            <Whatsapp class="size-8 text-green-500" />
                            <div>
                                <p class="font-semibold text-lg text-gray-800">Precisa de ajuda?</p>
                                <p class="text-gray-600">Fale conosco pelo WhatsApp</p>
                            </div>
                        </a>
                        <a href="mailto:{profile.need_help?.need_help_email}" target="_blank" class="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
                            <Mail class="size-8 text-blue-500" />
                            <div>
                                <p class="font-semibold text-lg text-gray-800">Prefere E-mail?</p>
                                <p class="text-gray-600">Envie sua dúvida para nosso suporte</p>
                            </div>
                        </a>
                        <a href="https://consumer.hotmart.com/" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-4 bg-white rounded-lg shadow-md transition-transform hover:scale-105 duration-300">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" color="red" viewBox="0 0 48 48"><title>Hotmart SVG Icon</title><circle cx="23.925" cy="29.825" r="5.74" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M33.97 15.22s.76 1.014.17 2.027c-.591 1.013-2.027-.507-2.027-.507s.17-4.896-3.207-6.584c0 0 .169 2.532-1.182 3.377s-4.22-4.39-2.195-9.033c0 0-6.078.929-8.61 12.24c0 0-2.195.17-1.013-3.292c-3.546 5.74-5.994 11.565-5.572 17.39c.507 7.09 6.416 12.662 13.676 12.662s13.253-5.656 13.76-12.747c0 0 1.097-11.227-3.8-15.532"/></svg>
                            <div>
                                <p class="font-semibold text-lg text-gray-800">Gerencie sua assinatura</p>
                                <p class="text-gray-600">Acesse a Hotmart para alterar dados</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    {/await}
</div>
