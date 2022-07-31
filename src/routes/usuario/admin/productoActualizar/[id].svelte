<script context="module">
    export async function load({params}){
     const id = params.id;

       return{
                props: {
                    id: id
                }
            }
 }



</script>

<script>
    import {db} from '../../../js/firebase'
    import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, setDoc} from "firebase/firestore";
    import { toast } from '@zerodevx/svelte-toast'
    import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
    import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
    import { setContext } from 'svelte'

    export let id
    var producto; 
    const auth = getAuth();
     let mail;
  

     var datosProducto = {
         titulo: '',
         categoria: '',
         precio: '',
         descripcion: '',
         descuento: 0 ,
     }
     var categorias = []
     onAuthStateChanged(auth, (user)=>{
     if (user) {
     const uid = user.uid;
     mail = user.email;
     console.log(uid, "   ", mail);
     onSnapshot(doc(db, "catalogos", mail), (doc) => {
     console.log("Current data: ", doc.data());
     categorias = [...doc.data().categorias]
     console.log(categorias);
     });
     const unsub = onSnapshot(doc(db, "catalogos", mail, "productos", id), (doc) => {
     const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
     datosProducto.titulo = doc.data().titulo;
     datosProducto.precio = doc.data().precio;
     datosProducto.categoria = doc.data().categoria;
     datosProducto.descripcion = doc.data().descripcion;
     datosProducto.ng_perfil = doc.data().ng_perfil;
     datosProducto.descuento = doc.data().descuento;
});
    
     }else{
     console.log('No encontramos nin id De User');
     }
    }
  )
  
   




//img
     var imagenSelccionada = false;
     let files;
     var procesoDeSubidaDeImagen = 'Crear Producto';
     var nombreArchivo;
     var archivo;
     var fileinput;
     var avatar;
     export let then = 'alerta de subida exitosa';
     export let idG, ngName, bussinesCat, imgPerfil;
     


     var horario = new Date().toString();
     
     $: if(files){
         console.log(files);
         for (const file of files) {
         console.log(file.name);
         nombreArchivo = file.name;
         archivo = file;
        }
     } 
     $: if(files){
         console.log(files);
         for (const file of files) {
         console.log(file.name);
         nombreArchivo = file.name;
         archivo = file;
        }
     } 

     const onFileSelected =(e)=>{
       imagenSelccionada = true;
       let image = e.target.files[0];
                 let reader = new FileReader();
                 reader.readAsDataURL(image);
                 reader.onload = e => {
                      avatar = e.target.result
                 };
                 var name
                 //remplazando espacios 
                 var fecha = horario.replace(/ /g, "");  
                 var titulo_imagen = fecha 
                 //generando nombre
                 name =  'img' + titulo_imagen + "-" + "impulsa.jpg";
                 console.log(name);
                 procesoDeSubidaDeImagen = 'Crear Producto';
     }
    var idDocActualizar = datosProducto.titulo.replace(/ /g, "")
     async function subirLinkFS(link) {
         await updateDoc(doc(db, "catalogos", mail, "productos", id), {
                        ng_perfil: link,
                        titulo: datosProducto.titulo,
                        categoria: datosProducto.categoria,
                        precio: datosProducto.precio,
                        descripcion: datosProducto.descripcion,
                        fechaDeSubida: horario,
                        vistas: 0,
                        id: datosProducto.titulo.replace(/ /g, ""),
                        visible: true
                      }).then(()=>{
                       toast.push(then);
                      });
                    
       
     }

     const subirImagen =  ()=>{
       if(datosProducto.titulo == '' || datosProducto.categoria == '' || datosProducto.precio == "" || datosProducto.descripcion == ''){
         alert('Tiene que llenar los datos')
       }else{
       var nombreDelArchivoQueSubira = horario.replace(/ /g, "") + nombreArchivo.replace(/ /g, "")  ;

const storage = getStorage();

const storageRef = ref(storage, nombreDelArchivoQueSubira);

const uploadTask = uploadBytesResumable(storageRef, archivo);
uploadTask.on('state_changed',
(snapshot) => {
 // Observe state change events such as progress, pause, and resume
 // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
 const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
 console.log('Upload is ' + progress + '% done');
 procesoDeSubidaDeImagen = `Subiendo... ${progress.toFixed(0)}%`
 switch (snapshot.state) {
   case 'paused':
     console.log('Upload is paused');
     break;
   case 'running':
     console.log('Upload is running');
     break;
 }
},
(error) => {
 // Handle unsuccessful uploads
},
() => {
 // Handle successful uploads on complete
 // For instance, get the download URL: https://firebasestorage.googleapis.com/...
 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
   console.log('File available at', downloadURL);
   procesoDeSubidaDeImagen = "Subido con Exito";
   subirLinkFS(downloadURL)
   setContext('link', {link: downloadURL})
   return downloadURL
 });
}
);
}
     }
     
    
</script>

<div class="productos">
 <div class="categorias">
     <h1>{id}</h1>
    
     <form action="">
         <h3>Editar producto</h3>

         <input style="display: none" bind:files type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >

         <div class="imagen">
         {#if avatar}
         <img class="avatar" on:click={()=>{fileinput.click();}} src="{avatar}" alt="d" /> <br>
         {:else}
         <img class="avatar" on:click={()=>{fileinput.click();}} src="{datosProducto.ng_perfil}" alt="" />  <br>
         {/if}
       </div>
       
         <label for="">Categoria Del Producto</label>
         <select bind:value="{datosProducto.categoria}" name="" id="">
             {#each categorias as categoria}
             <option value="{categoria}">{categoria}</option>
             {/each}
             </select>
         <label for="">Nombre del Producto</label>
         <input type="text" bind:value="{datosProducto.titulo}" placeholder="Nombre Del Producto">
         <label for="">Precio de El producto</label>
         <input type="number" bind:value="{datosProducto.precio}">
         <label for="">Descuento Propio</label>
         <input type="number" bind:value="{datosProducto.descuento}">
         <label for="">Descripcion</label>
         <textarea name="" id="" cols="30" rows="10" bind:value="{datosProducto.descripcion}"></textarea>
         {#if imagenSelccionada}
         <button type="button" on:click={subirImagen}>{procesoDeSubidaDeImagen}</button>
         {:else}
         <button type="button" on:click={()=>{fileinput.click();}}>Crear Producto</button>
         {/if}
     </form>


 </div>
</div>


<style>
 .productos{
     width: 100%;
     min-height: 100vh;
     background-color: white;
 }
</style>