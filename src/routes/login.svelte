<script>
import './js/firebase.js'
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { goto } from '$app/navigation';

const auth = getAuth();
var cuenta = {
    usuario: '',
    password: ''
}

var error = ''

function  iniciarSession () {
    signInWithEmailAndPassword(auth, cuenta.usuario, cuenta.password).then((userCredential)=>{
        const user = userCredential.user;
        console.log(user);
        goto(`/usuario/perfil`)
    }).catch((err)=>{
        console.log(err.code);
        const errormensaje = err.message;
        if (errormensaje == "Firebase: Error (auth/invalid-email).") {
            error = "El Usuario o Contraseña Son Incorrectos"
        }
    })
}
</script>


<svelte:head>
    <title>Iniciar Session</title>

</svelte:head>


<div class="iniciarSession">
    <h1>Iniciar Session</h1>
    <form action=""  on:submit|preventDefault={iniciarSession}>
        <label for="">Usuario</label>
        <input bind:value={cuenta.usuario} type="text" placeholder="Coloca Tu Usuario">
        <label for="">Contraseña</label>
        <input bind:value={cuenta.password} type="text" placeholder="Ingresa Tu Contraseña">
        {#if error == ''}
             <span></span><br>
        {:else}
             <span style="color: red;">{error}</span> <br>
        {/if}
        <input type="submit" value="Iniciar Session">
    </form>
</div>

<style>
    .iniciarSession{
        text-align: center;
        margin: auto;
        background-color: azure;
        margin-top: 20vh;
    }
    .iniciarSession h1{
        font-weight: 600;
        font-family: 'Open Sans', sans-serif;
        font-size: 30px;
    }
    .iniciarSession form{
        width: 100%;
        text-align: center;
        margin: auto;
    }
    .iniciarSession form label{
        margin-top: 80px;
        font-family: 'Open Sans', sans-serif;
        font-weight: 700;
    }
    .iniciarSession form input{
        margin: auto;
        text-align: center;
        margin-bottom: 30px;
    }

</style>