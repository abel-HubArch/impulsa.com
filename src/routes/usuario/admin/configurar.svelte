<script>
        import {db} from '../../js/firebase.js'
        import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
        import { doc, getDoc, onSnapshot } from "firebase/firestore";
        import SubirImagen from '../../Components/subirImagen.svelte';
        import SubirDatosNegocio from '../../Components/subirDatosNegocio.svelte';
        import EstiloCat from '../../Components/estiloCat.svelte';
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
 

var datosNg = {
    img:'',
    nombreNg: '',
    plan: '',
    categoria: '',
    descripcion: '',
    descuento: ''

};

onAuthStateChanged(auth, (user)=>{
        if (user) {
        const uid = user.uid;
        mail = user.email;
        console.log(uid, "   ", mail);
        onSnapshot(doc(db, "catalogos", mail), (doc) => {
        console.log("Current data: ", doc.data());
        datosNg.img = doc.data().ng_perfil;
        datosNg.nombreNg = doc.data().ng_nombre;
        datosNg.plan = doc.data().plan;
        datosNg.categoria = doc.data().categoria;
        datosNg.descripcion = doc.data().descripcion;
        datosNg.descuento = doc.data().descuento
        });
        }else{
        console.log('No encontramos nin id De User');
        }
       }
     )
</script>

<div class="configurar">
  
    
    <div class="catalogoEditar">
        <h1>Editar Catalogo</h1>
        <div class="datos">
            <div class="columna">
                <SubirImagen idG="{mail}" descripcion='{datosNg.descripcion}' ngName='{datosNg.nombreNg}' bussinesCat="{datosNg.categoria}" imgPerfil="{datosNg.img}" then="Se Subio foto de perfil Exitosamente" ></SubirImagen>
            </div>
            <div class="columna">
                <SubirDatosNegocio idG="{mail}" descripcion='{datosNg.descripcion}' ngName='{datosNg.nombreNg}' bussinesCat="{datosNg.categoria}" imgPerfil="{datosNg.img}"></SubirDatosNegocio>
            </div>
        </div>
       
        <EstiloCat></EstiloCat>
  </div>
</div>

<style>

    .configurar{
        width: 100%;
        text-align: center;
        min-height: 100vh;
    
        background-color: azure;
        padding-top: 30px;
    }
    .configurar h1{
        font-weight: 600;
        color: rgb(236, 95, 0);
    }
    .configurar .catalogoEditar .datos{
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }
    .configurar .catalogoEditar .datos .columna{
        margin: 0px 50px 100px;
    }
    @media only screen and (max-width: 1011px) {
        .configurar .catalogoEditar .datos .columna{
            margin: 0px 0px 100px;
        }
    }
    @media only screen and (max-width: 501px) {
        .configurar .catalogoEditar .datos .columna{
            margin: 0px 0px 0px;
        }
    }

</style>