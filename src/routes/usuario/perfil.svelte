
<script>

   import {db} from '../js/firebase.js'
   import { doc,collection , getDoc, onSnapshot, query, where, getDocs, orderBy, limit } from "firebase/firestore";
   import { goto } from '$app/navigation';
   import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';

const auth = getAuth();
var mail;
var datosNg = {
    img:'',
    nombreNg: '',
    plan: '',
    categoria: '',
    descripcion: '',
    descuento: '',
    vistas: 0
};

var productos = [];

onAuthStateChanged(auth, async (user)=>{
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
        datosNg.descuento = doc.data().descuento,
        datosNg.vistas = doc.data().vistas;
        });

        
            const querySnapshot = await getDocs(query(collection(db, "catalogos", mail, "productos"), orderBy("vistas", "desc"), limit(6)));
            let documento = []
            querySnapshot.forEach((doc) => {
            documento.push({...doc.data(), id: doc.id});
            productos = [...documento]
            console.log(doc.id, " => ", doc.data());
          })
          console.log(productos);
        } 
        else{
        console.log('No encontramos nin id De User');
        }
       }
     )


  


</script>



<div style="background-color: #fff;">

    <div class="contenedor">
        <div class="imgDegra">
            <img src="{datosNg.img}" id="imgNegocio"  alt=""> <br>
        </div>

            <div class="texto-encima">
                <div class="datos">
                    <h3>{datosNg.categoria}</h3>
                    <h1>{datosNg.nombreNg}</h1>
                    <h3>{datosNg.plan}</h3>
                </div>    
            </div>
         
    </div>

        <div class="opciones">
            <a href="/usuario/admin/productos"><button>Productos</button></a><a href="/usuario/admin/configurar"><button>Configurar</button></a><br>
            
        </div>
        <div class="estadisticas">
            <h2>{datosNg.vistas} Vistas</h2>
        </div>
        <div class="productosOpciones">
            <h1>Productos mas vistos</h1>
            <a href="/usuario/admin/productosAdmin">Ver Todos los Productos</a>
        </div>
      

        <div class="productos">
           
            {#each productos as producto}
            <div class="producto">
                <p>{producto.categoria}</p>
                <h1>{producto.titulo}</h1>
                <img src="{producto.ng_perfil}" alt="">
                <div class="descripcion">
                    <p>{producto.descripcion}</p>
                </div>
                <div class="datos">
                    <h3>{producto.precio}Bs</h3>
                    <h3>{producto.vistas} Vistas</h3>
                </div>           
             </div>
            {:else}
            <a href="/usuario/admin/productos"><h4><br><br> Click para empezar a crear un nuevo producto</h4></a>
            {/each}
            
        </div>
  
          
         
       
</div>


    

<style>
    #imgNegocio{
        width: 100%;
        height: 40vh;
    }
    .texto-encima{
    width: 100%;
    height: 40vh;
    position: absolute;
    top: 0px;
    /*left: 10px;*/
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.45), rgba(0, 0, 0, 0.45));
}
    .contenedor{
margin: auto;
text-align: center;
background-color: white;
width: 100vw;
position: relative;
display: inline-block;
text-align: center;
}

.estadisticas{
    text-align: center;
    margin: 30px ;
}
.productosOpciones{
    text-align: center;
    margin: 0px 0px 50px;
}

.contenedor .datos{
    padding-top: 40px;
    display: flex;
    justify-content: center;
    height: 35vh;
    background-size: cover;
    background-position: center;
    margin-bottom: 30px;
    text-align: center;
}
.contenedor .datos h3{
    font-size: 15px;
    color: white;
    text-align: center;
    
}

.contenedor .datos h1{
    margin: 50px 15% 0px;
    font-size: 20px;
    font-family: 'Open Sans', sans-serif;
    font-weight: 700;
    color: white;
    text-align: center;
}

 .opciones{
    width: 100%;
    text-align: center;
    margin: auto;
}
 .opciones button{
    width: 48%;
    font-size: 3vw;
    margin-top: 30px;
}
.contenedor form{
    margin: auto;
    margin-top: 30px;
}
.contenedor input{
    margin: auto;
}
.contenedor select{
    margin: auto;
}
#loginerr{
    display: none;
}

.empresa{
    display: none;
    visibility: hidden;
}
.contenedor .crearCategoria{
    display: flex;
}

#formb{
    display: none;
    visibility: hidden;
}

.productos{
    width: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
  white-space: nowrap;
    display: inline-block;
    text-align: center;
    margin: auto;
}
.productos .producto{
    background-color: white;
    display: inline-block;
    margin: 0px 30px;
    width: 45%;
}
.productos .producto .descripcion{
    width: 100%;
    height: 50%;
    background-color: rgb(155, 155, 155);
    overflow-y: scroll;


}
.productos .producto img{
    height: 230px;
    width: 100%;
    border-radius: 20px;
    margin: 0px 0px 20px;
}
.productos .producto .datos{
    display: flex;
    justify-content: center;
    align-items: center;
}
.productos .producto p{
    color: black;
    margin: 0px 0px 20px;
}
.productos .producto .datos h3{
    margin: 0px 20px;
}
</style>