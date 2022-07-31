<script>
       import {db} from '../../js/firebase'
       import { doc,collection ,query, getDocs, orderBy, limit, updateDoc, deleteDoc } from "firebase/firestore";
       import { toast } from '@zerodevx/svelte-toast'
       import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
    

       var productos = [];

        const auth = getAuth();
        let mail;
        let categorias = [];
        
        onAuthStateChanged(auth, async (user)=>{
        if (user) {
        const uid = user.uid;
        mail = user.email;
     
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

     var visible = true;
   async  function visibleProduct(id) {
            await updateDoc(doc(db, "catalogos", mail, "productos", id), {
                           visible: true
                         }).then(()=>{
                          toast.push('Producto Visible');
                         });
     }

     async function hiddenProduct(id) {
        var opcion = confirm("Desea Ocultar El Producto?");
        if (opcion == true) {
            await updateDoc(doc(db, "catalogos", mail, "productos", id), {
                           visible: false
                         }).then(()=>{
                          toast.push('Producto Ocultado');
                         });
	   } else {
	    return
	   }
     
     }

     async function borrarProducto(id) {
        var opcion = confirm("Desea Eliminar el Producto?");
        if (opcion == true) {
            await deleteDoc(doc(db, "catalogos", mail, "productos", id)).then(()=>{
                        toast.push('Producto Eliminado');
                        location.reload();

            });
	   } else {
	    return
	   }
     }

</script>

<div class="title">
    <h1>Administrar Productos</h1>
</div>

<div class="productosDiv">
   
           
        {#each productos as producto}
        <div class="producto">
            <h1>{producto.titulo}</h1>
            <p>{producto.categoria}</p>
            <img src="{producto.ng_perfil}" alt="">
            <div class="descripcion">
                <p>{producto.descripcion}</p>
            </div>
            <div class="datos">
                <h3>{producto.precio}Bs</h3>
                <h3>{producto.vistas} Vistas</h3>
            </div>  
            <div class="checkboxproducto">
                <label class="content-input">
                    {#if producto.visible}
                      <input type="checkbox" bind:checked={producto.visible} on:click="{hiddenProduct(producto.id)}" name="{producto.titulo}"  id="{producto.id}">Desabilitar Producto<i></i>
                    {:else}
                      <input type="checkbox" bind:checked={producto.visible} on:click="{visibleProduct(producto.id)}" name="{producto.titulo}"  id="{producto.id}">Habilitar producto<i></i>
                    {/if}
                </label>
                <div class="botones">
                    <button on:click="{borrarProducto(producto.id)}">Borrar Producto</button> <a href="/usuario/admin/productoActualizar/{producto.id}"><button>Editar Producto</button></a>
                </div>
            </div>         
           
         </div>

        {:else}
              <h3>Cargando... Espera un momento</h3>
        {/each}
        
   
</div>



<style>
    .title{
        width: 100%;
        background-color: white;
        text-align: center;
        padding: 30px 0px;
        
    }
    .title h1{
        font-weight: 800;
    }
    .productosDiv{
        width: 100%;
        min-height: 100vh;
        background-color: white;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
  
.productosDiv .producto{
    background-color: white;
    margin: 0px 30px;
    width: 300px;
    transition-duration: 300ms;
    border-radius: 40px;
    padding: 10px;
}
.productosDiv .producto .checkboxproducto{
    margin: 40px;
}
.productosDiv .producto:hover{
    background-color: rgb(165, 165, 165);
}

.productosDiv .content-input input, .content-select select{
	appearance: none;
	-webkit-appearance: none;
	-moz-appearance: none;
}
.productosDiv .content-input{
	position: relative;
	margin-bottom: 30px;
	padding:5px 0 5px 60px; /* Damos un padding de 60px para posicionar 
        el elemento <i> en este espacio*/
	display: block;
}



.productosDiv .content-input input + i{
       background: #f0f0f0;
       border:2px solid rgba(0,0,0,0.2);
       position: absolute; 
       left: 0;
       top: 0;
}




.productosDiv .content-input input[type=checkbox ] + i{
	width: 52px;
	height: 30px;
	border-radius: 15px;
}
.productosDiv .content-input input[type=checkbox] + i:before{
	content: ''; /* No hay contenido */
	width: 26px;
	height: 26px;
	background: #fff;
	border-radius: 50%;
	position: absolute;
	z-index: 1;
	left: 0px;
	top: 0px;
	-webkit-box-shadow: 3px 0 3px 0 rgba(0,0,0,0.2);
	box-shadow: 3px 0 3px 0 rgba(0,0,0,0.2);
}
.productosDiv .content-input input[type=checkbox]:checked + i:before{
	left: 22px;
	-webkit-box-shadow: -3px 0 3px 0 rgba(0,0,0,0.2);
	box-shadow: 3px 0 -3px 0 rgba(0,0,0,0.2);
}
.productosDiv .content-input input[type=checkbox]:checked + i{
 background: #2AC176;
}
.productosDiv .producto .descripcion{

}
.productosDiv .producto img{
    height: 230px;
    width: 100%;
    border-radius: 20px;
    margin: 0px 0px 20px;
}
.productosDiv .producto .datos{
    display: flex;
    justify-content: center;
    align-items: center;
}
.productosDiv .producto p{
    color: black;
    margin: 0px 0px 20px;
}
.productosDiv .producto .datos h3{
    margin: 0px 20px;
}
</style>