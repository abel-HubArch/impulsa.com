<script>
       import CatalogoUnoEjm from '../images/catalogo/muestraUno.svelte';
        import CatalogoDosEjm from '../images/catalogo/muestraDos.svelte';
        import CatalogoTresEjm from '../images/catalogo/muestraTres.svelte';
        import {db} from '../js/firebase'
       import { doc, updateDoc } from "firebase/firestore";
       import { toast } from '@zerodevx/svelte-toast'
        import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';

        var coloresConfig = {
            botones: '#000',
            clickBoton: '#FF0000',
            titulos: '#000',
            escrituras: '#6F6F6F',
            tarjetafondo: '#fff',
            fondoCatalogo: '#fff'
        }

        const auth = getAuth();
        let mail;

        onAuthStateChanged(auth, (user)=>{
        if (user) {
        const uid = user.uid;
        mail = user.email;
        console.log(uid, "   ", mail);
        }else{
        console.log('No encontramos nin id De User');
        }
       }
       )

      
             
    

        
        const estiloSeleccionadoUno = async ()=>{  
        await updateDoc(doc(db, "catalogos", mail), {
                estilo: 'uno'
              }).then(()=>{toast.push("Estilo 1 Actualizado con Exito");});
        }
        const estiloSeleccionadoDos = async ()=>{
       
            await updateDoc(doc(db, "catalogos", mail), {

              estilo: "dos"
              }).then(()=>{toast.push("Estilo 2 Actualizado con Exito");});
        }
     
        const estiloSeleccionadoTres = async ()=>{
      
            await updateDoc(doc(db, "catalogos", mail), {
    
              estilo: "tres"
              }).then(()=>{toast.push("Estilo 3 Actualizado con Exito");});
        }
        

</script>

<h1>Configurar Tienda</h1>
    <div class="colores configuracion">
        <!-- 
            
         -->
        <h3>Selecciona Los Colores Para tu tienda</h3>
        <div class="seleccionar ">
            <div class="opcion">
                <input type="color" bind:value={coloresConfig.botones}>
                <p>Botones</p>
            </div>
            <div class="opcion">
                <input type="color" bind:value={coloresConfig.clickBoton}>
                <p>Color de Click</p>
            </div>
            <div class="opcion">
                <input type="color" bind:value={coloresConfig.titulos}>
                <p>Titulos <br> Encabezados </p>
            </div>
            <div class="opcion">
                <input type="color" bind:value={coloresConfig.escrituras}>
                <p>Textos <br> pequenos </p>
            </div>
            <div class="opcion">
                <input type="color" bind:value={coloresConfig.tarjetafondo}>
                <p>Color <br> Fondo Producto</p>
            </div>
            <div class="opcion">
                <input type="color" bind:value={coloresConfig.fondoCatalogo}>
                <p>Color de <br> Fondo Catalogo</p>
            </div>
        </div>
    </div>
    <div class="estiloCat configuracion">
        <!--  -->
        <h3>Selecciona el Estilo De Tu Catalogo</h3>
        <div class="seleccionar ">
            <div class="flexImg">
                <div class="imagenSvelte"> 

                   <div class="opcionImg seleccionado"> 
                    <!-- <p style="color: green;   font-weight: 700;">Seleccionado</p>   -->
                       

                       <CatalogoUnoEjm 
                    botones={coloresConfig.botones} 
                    hoverBotones={coloresConfig.clickBoton}
                    titulos={coloresConfig.titulos}
                    titulosDos={coloresConfig.escrituras}
                    tarjetaFondo={coloresConfig.tarjetafondo}
                    fondoCatalogo={coloresConfig.fondoCatalogo}
                    ></CatalogoUnoEjm> <br>
                    <button on:click="{estiloSeleccionadoUno}">Elegir Estilo</button>
                

                </div>
                       
                  
                        <div class="opcionImg">  
                             <CatalogoDosEjm
                            botones={coloresConfig.botones} 
                            hoverBotones={coloresConfig.clickBoton}
                            titulos={coloresConfig.titulos}
                            titulosDos={coloresConfig.escrituras}
                            tarjetaFondo={coloresConfig.tarjetafondo}
                            fondoCatalogo={coloresConfig.fondoCatalogo}
                            ></CatalogoDosEjm>
                            <br>
                            <button on:click="{estiloSeleccionadoDos}">Elegir Estilo</button>
                        </div>
                     
                  
                    <div class="opcionImg"> 
                          <CatalogoTresEjm
                        botones={coloresConfig.botones} 
                        hoverBotones={coloresConfig.clickBoton}
                        titulos={coloresConfig.titulos}
                        titulosDos={coloresConfig.escrituras}
                        tarjetaFondo={coloresConfig.tarjetafondo}
                        fondoCatalogo={coloresConfig.fondoCatalogo}
                        ></CatalogoTresEjm>
                        <br>
                        <button on:click="{estiloSeleccionadoTres}">Elegir Estilo</button>
                    </div>                  
                </div>
            </div>
        </div>
    </div>

    <style>
    .configurar .configuracion{
        margin-top: 20px;
        margin-bottom: 60px;
    }
    .configurar .configuracion .seleccionar{
        margin-top: 30px;
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
    }
    .configurar .configuracion .seleccionar .opcion{
        margin: 10px 20px;
    }
    .configurar .configuracion .seleccionar .opcion p{
        margin-top: 10px;
        color: black;
    }
    .configurar .configuracion .seleccionar .flexImg {
        display: flex;
        justify-content: center;
        width: 100%;
        scroll-snap-type: x mandatory;
        overflow-x: scroll;
        overflow-y: hidden;
    }
    .configurar .configuracion .seleccionar .flexImg  .imagenSvelte{
        display: flex;
        width: 100%;
        scroll-snap-type: x mandatory;
        overflow-x: scroll;
        overflow-y: hidden;
    }
    .configurar .configuracion .seleccionar .flexImg  .imagenSvelte .opcionImg{
        flex: 0 0 30%;
        width: 100%;
        object-fit: cover;
        scroll-snap-align: center;
    }
    .configurar .catalogoEditar form label{
        margin-top: 30px;
    }
    .configurar .catalogoEditar form input{
        margin: auto;
        text-align: center;
    }
    </style>