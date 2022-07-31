    <script>
        import './js/firebase.js'
        import './publico/style/main.css'
        import './publico/style/base.css'
        import logo from './images/logo.svg';
        import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
        import { goto } from '$app/navigation';
        import { SvelteToast } from '@zerodevx/svelte-toast'
        var session = false;

        var estadoMenu = "body"
        function AbrirMenu(){
           estadoMenu = "body menu-is-open"
        }
        function CerrarMenu(){
           estadoMenu = "body"
        }

        const auth = getAuth();

        onAuthStateChanged(auth, (user)=>{
            if (user) {
                const uid = user.uid
                console.log('si esta en session');
                session = true
            }else{
                console.log('no esta en session');
                session = false
                
            }
        });

        function cerrarSession() {
            var estaSeguro = confirm('Confirma Cerrar Session');
            if (estaSeguro) {
                signOut(auth).then(() => {
                 // Sign-out successful.s
                 goto(`/`)
                }).catch((error) => {
                  alert('Hubo un Error')
                });
            }else{
                return
            }
        }

        

    </script>
    
    <body class="{estadoMenu}">
    <!-- header
    ================================================== -->
    <header class="s-header">
        <SvelteToast></SvelteToast>
        <div class="header-logo">
            <a class="site-logo" href="/">
                <img src="{logo}" alt="Pagina De Inicio">
            </a>
        </div>

        <nav class="header-nav">

            <p class="header-nav__close" on:click={CerrarMenu} title="close"><span>Cerrar</span></p>

            <div class="header-nav__content">
                <h3>Menu</h3>
            
                <ul class="header-nav__list">
                    <li class="current"><a href="/" on:click={CerrarMenu} title="inicio">inicio</a></li>


                    <li><a href="login" on:click={CerrarMenu} title="nosotros">Servicios</a></li>

                    <!-- 
   <div class="servicios">
                        <span><a href="">- Para Negocios</a></span> <br>
                        <span><a href="">- Automatizacion</a></span> <br>
                        <span><a href="">- Para Emprendedores</a></span> <br>
                    </div>
                     -->
                 
                    

                    <li><a href="catalogo" on:click={CerrarMenu} title="catalogo">Catalogos</a></li>
                    <li><a href="empresas" on:click={CerrarMenu} title="empresas">Empresas</a></li>
                    <li><a href="contactanos" on:click={CerrarMenu} title="contactanos">Contactanos </a></li>
                    <li><a href="contactanos" on:click={CerrarMenu} title="contactanos">Noticias</a></li>
                </ul>
    
                <p id="textoInf"></p>
    
             {#if session}
             <li><a id="lgText" on:click={CerrarMenu} href="/usuario/perfil" title="iniciar sesion">Mi Perfil</a></li>
             <span on:click={cerrarSession}>Cerrar Session</span>
             {:else}
             <li><a id="lgText" on:click={CerrarMenu} href="/login" title="iniciar sesion">Iniciar Session</a></li>
             {/if}
                

            </div> <!-- end header-nav__content -->

        </nav>  <!-- end header-nav -->

    
        <p class="header-menu-toggle opaque" on:click={AbrirMenu}>
            <span class="header-menu-text">Menu</span>
            <span class="header-menu-icon"></span>
        </p>
     
        
    </header> <!-- end s-header -->

    <div class="contenedorPadre" on:click={CerrarMenu}>
        <slot></slot>
    </div>
</body>

<style>
    .s-header{
        background-color: black;
    }
    .contenedorPadre{
        margin-top: 97px;
        background-color: aqua;
    }
</style>
