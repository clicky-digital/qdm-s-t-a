<script lang="ts">
    import { User } from "lucide-svelte";
    import { Button } from "@/components/ui/button/index.js";
    import { Input } from "@/components/ui/input/index.js";
    import { PUBLIC_URL_BASE_STORAGE } from '$env/static/public';

    let { data, form } = $props();

    let view = $state('profile');

    let password = $state('');
    let confirmPassword = $state('');
    let passwordsMatch = $state(true);
    let minimumPasswordLength = $state(false);

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
    function logout(){
        //TODO Make logout function
    }
</script>

<div class="w-full flex p-5 justify-center items-center">
    {#await data.profile}
        <div class="flex justify-center items-center font-bold text-2xl w-full">
            Carregando Perfil...
        </div>
    {:then profile}
        <div class="w-9/12 h-full flex gap-2">
            <div class="flex flex-col w-3/12 p-2 bg-slate-900/10 rounded-2xl">
                <div class="w-full flex flex-col gap-5 justify-center items-center h-2/5">
                    {#if (profile?.student?.avatar)}
                        <img class="size-48 border-2 rounded-full" src="{PUBLIC_URL_BASE_STORAGE + '/' + profile?.student?.avatar}" alt="User Avatar">
                    {:else}
                        <User class="size-48 p-5 border-2 rounded-full" />
                    {/if}
                </div>
                <div class="h-3/5 flex flex-col pt-10">
                    <Button class="w-full cursor-pointer {view === 'profile' ? 'bg-yellow-300' : 'bg-transparent'} text-black hover:bg-slate-900/10 font-bold" onclick={()=>{view = "profile"}}>Informações do Perfil</Button>
                    <hr/>
                    <Button class="w-full cursor-pointer {view === 'sell' ? 'bg-yellow-300' : 'bg-transparent'} text-black hover:bg-slate-900/10 font-bold" onclick={()=>{view = "sell"}}>Informações de Compras</Button>
                    <hr/>
                    <Button class="w-full cursor-pointer {view === 'one' ? 'bg-yellow-300' : 'bg-transparent'} text-black hover:bg-slate-900/10 font-bold" onclick={()=>{view = "one"}}>One</Button>
                    <hr/>
                    <Button class="w-full cursor-pointer {view === 'two' ? 'bg-yellow-300' : 'bg-transparent'} text-black hover:bg-slate-900/10 font-bold" onclick={()=>{view = "two"}}>Two</Button>
                </div>
                <Button onclick={() => logout()} class="bg-slate-900/10 text-red-500 cursor-pointer hover:text-white hover:bg-red-500">Sair</Button>
            </div>
            <div class="w-9/12">
                <form class="w-full h-full" method="POST" onsubmit={()=>handleSubmit(event.submitter.value)}>
                    <div class="{view !== 'profile' ? 'hidden' : ''} w-full h-full flex flex-col items-center bg-slate-900/10 rounded-2xl">
                        <div class="flex w-full h-1/2">
                            <div class="w-1/2 flex flex-col items-center justify-center">
                                <Input name="avatar" placeholder="Foto de Perfil" type="file" class="w-9/12 bg-white"></Input>
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
                                    <span class="text-xs p-0 m-0">A senha deve conter pelo menos 6 caracteres.</span>
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
                            <div class="flex w-11/12 gap-5 p-5">
                                <div class="w-4/12">
                                    <label for="zip_code">CEP:</label>
                                    <Input name="zip_code" id="zip_code" placeholder="CEP" value={profile?.student?.zip_code}></Input>
                                </div>
                                <div class="w-4/12">
                                    <label for="district">Bairro:</label>
                                    <Input name="district" id="district" placeholder="Bairro" value={profile?.student?.district}></Input>
                                </div>
                                <div class="w-1/12">
                                    <label for="uf">Estado:</label>
                                    <Input name="uf" id="uf" placeholder="Estado" value={profile?.student?.uf}></Input>
                                </div>
                                <div class="w-3/12">
                                    <label for="city">Cidade:</label>
                                    <Input name="city" id="city" placeholder="Cidade" value={profile?.student?.city}></Input>
                                </div>
                            </div>
                            <div class="flex w-11/12 gap-5 p-5">
                                <div class="w-8/12">
                                    <label for="address">Endereço:</label>
                                    <Input name="address" id="address" placeholder="Endereço" value={profile?.student?.address}></Input>
                                </div>
                                <div class="w-1/12">
                                    <label for="number">Número:</label>
                                    <Input name="number" id="number" placeholder="Número" value={profile?.student?.number}></Input>
                                </div>
                                <div class="w-3/12">
                                    <label for="complement">Complemento:</label>
                                    <Input name="complement" id="complement" placeholder="Complemento" value={profile?.student?.complement}></Input>
                                </div>
                            </div>
                            <Button value="update" type="submit" formaction="?/updateProfile" class="w-9/12 mt-10 cursor-pointer">
                                Salvar
                            </Button>
                        </div>
                    </div>
                </form>
                <div class="{view !== 'sell' ? 'hidden' : ''} w-full h-full">
                    Informações de Compras
                </div>
                <div class="{view !== 'one' ? 'hidden' : ''} w-full h-full">
                    One
                </div>
                <div class="{view !== 'two' ? 'hidden' : ''} w-full h-full">
                    Two
                </div>
            </div>
        </div>
    {/await}
</div>