<script>
    import {db} from '../js/firebase'
    import { doc, updateDoc } from "firebase/firestore";
    import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
    import { toast } from '@zerodevx/svelte-toast'
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
    export let idG, ngName, bussinesCat, imgPerfil, descripcion;

    var datos = {
        nombreNg: ngName,
        descuento: 0
    }
    
    async function subirDatos() {
              await updateDoc(doc(db, "catalogos", mail), {
              ng_nombre: datos.nombreNg,
              descripcion: datos.descripcion,
              descuento: datos.descuento
              }).then(()=>{toast.push("Datos Actualizados con Exito");});
    } 

    </script>
    
    <form action="">
        <label for="">Nombre de Negocio</label>
        <input type="text" bind:value="{datos.nombreNg}" placeholder="Nombre de negocio">
        <label for="">Descuento</label>
        <input type="number" bind:value="{datos.descuento}" placeholder="Descuento">
        <label for="">Descripcion</label>
        <textarea name="" bind:value="{datos.descripcion}" id="" cols="30" rows="10"></textarea>
        <input type="submit" on:click|preventDefault="{subirDatos}" value="Actualizar">
    </form>
    <!-- 
        --catalogo
        categorias
        descripcion
        ng_nombre
        ng_perfil
        descuento
        plan
        vistas
        puntaje
        ubicacion
        ng_email

        --datos_negocio
        
     -->