<script>
       import {db} from '../../js/firebase'
       import { doc, updateDoc, arrayUnion, arrayRemove, onSnapshot, setDoc} from "firebase/firestore";
       import { toast } from '@zerodevx/svelte-toast'
       import {getAuth, onAuthStateChanged, signOut} from 'firebase/auth';
       import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
       import { setContext } from 'svelte'
       const auth = getAuth();
        let mail;
        let categorias = [];
        let descuentoPropio
        onAuthStateChanged(auth, (user)=>{
        if (user) {
        const uid = user.uid;
        mail = user.email;
        console.log(uid, "   ", mail);
        onSnapshot(doc(db, "catalogos", mail), (doc) => {
        console.log("Current data: ", doc.data());
        descuentoPropio = doc.data().descuento
        categorias = [...doc.data().categorias]
        console.log(categorias);
        });
       
        }else{
        console.log('No encontramos nin id De User');
        }
       }
     )
       var cat = {
        categoriaCrear: '',
        seleccionadoRemove: ''
       };

      

       async function subircat() {
        // Atomically add a new region to the "regions" array field.
        var opcion = prompt("Cual Es la Nueva Categoria?:", "");
        if (opcion) {
            await updateDoc(doc(db, "catalogos", mail), {
         categorias: arrayUnion(opcion)
         }).then(()=>{
            toast.push('Categorias Creada Con Exito');
         });
        }else{
            alert("Tiene que Escribir Una Nueva Categoria")
        }
        
       }
       async function borrarCat(cat) {
        

         var estaSeguro = confirm(`Desea eliminar ${cat}?`);
            if (estaSeguro) {
                await updateDoc(doc(db, "catalogos", mail), {
               categorias: arrayRemove(cat)
                }).then(()=>{
              toast.push('Categoria Eliminada con Exito');
               });
            }else{
                return
            }
       }



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
  
        var datosProducto = {
            titulo: '',
            categoria: '',
            precio: '',
            descripcion: '',
            descuento: ''
        }
        async function subirLinkFS(link) {
            await setDoc(doc(db, "catalogos", mail, "productos", datosProducto.titulo.replace(/ /g, "")), {
                           ng_perfil: link,
                           titulo: datosProducto.titulo,
                           categoria: datosProducto.categoria,
                           precio: datosProducto.precio,
                           descripcion: datosProducto.descripcion,
                           fechaDeSubida: horario,
                           vistas: 0,
                           id: datosProducto.titulo.replace(/ /g, ""),
                           visible: true,
                           descuento: descuentoPropio
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
        <h1>Productos</h1>
        <h3>Categorias</h3>
        <form action="">
            <label for="">Crear Categorias</label>
            <input type="submit" value="Crear Categoria" on:click|preventDefault="{subircat}">
        </form>

        <form action="" class="borrarCats">
            <label for="">Borrar Categoria</label>
             {#each categorias as categoria}
              <button on:click|preventDefault="{borrarCat(categoria)}">{categoria}  x</button>
             {/each}
          
        </form>
        <h3>Crear Nuevo Producto</h3>
        <form action="" class="crearProducto">
            
            <div class="parteuno">
              <input style="display: none" bind:files type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >

              <div class="imagen">
              {#if avatar}
              <img class="avatar" on:click={()=>{fileinput.click();}} src="{avatar}" alt="d" /> <br>
              {:else}
              <img class="avatar" on:click={()=>{fileinput.click();}} src="https://cdn4.iconfinder.com/data/icons/small-n-flat/24/user-alt-512.png" alt="" />  <br>
              {/if}
            </div>
            </div>
           
          <div class="partedos">
            <label for="">Categoria Del Producto</label>
            <select bind:value="{datosProducto.categoria}"   name="" id="">
                {#each categorias as categoria}
                <option value="{categoria}">{categoria}</option>
                {/each}
                </select>
            <label for="name">Nombre del Producto</label>
            <input type="text" name="name" id="name" bind:value="{datosProducto.titulo}" placeholder="Nombre Del Producto">
            <label for="">Precio de El producto</label>
            <input type="number" placeholder="Precio Del Producto" bind:value="{datosProducto.precio}">
            <label for="">Descuento Propio</label>
            <input type="number" placeholder="Inserte un descuento" bind:value="{descuentoPropio}">
            <label for="">Descripcion</label>
            <textarea name="" id="" cols="30" rows="10" placeholder="Escriba una Breve descripcion" bind:value="{datosProducto.descripcion}"></textarea>
            {#if imagenSelccionada}
            <button type="button" on:click={subirImagen}>{procesoDeSubidaDeImagen}</button>
            {:else}
            <button type="button" on:click={()=>{fileinput.click();}}>Crear Producto</button>
            {/if}
          </div>
            
        </form>


    </div>
</div>


<style>
    .productos{
        width: 100%;
        min-height: 100vh;
        background-color: white;
    }
    .productos .categorias{
      margin: auto;
      text-align: center;
    }
    .productos .categorias h1{
      font-weight: 600;
      margin: 0px 0px 40px;
    }
    .productos .categorias h3{
      margin: 0px 0px 20px;
    }
    .productos .categorias input{
      background-color: #0C33BC;
      color: white;
      font-weight: 600;
      margin: 0px auto 20px;
      text-align: center;
    }
    .productos .categorias input::placeholder{
      color: rgba(252, 252, 252, 0.301);
    }
    .productos .categorias .borrarCats button{
      background-color: #EF0D0D;
      color: white;
      font-weight:500;
      border: none;
      margin: 10px;
    }
    .productos .categorias .crearProducto{
      margin: auto;
    }
    .productos .categorias .crearProducto h3{
      font-weight: 600;
      margin: 30px 0px  0px;
    }
    .productos .categorias .crearProducto .imagen img{
      width: 80%;
      border-radius: 27px;
    } 
    .productos .categorias .crearProducto select{
      margin: auto;
    }
    @media only screen and (min-width: 501px) {
      .productos{
        
    }
    .productos .categorias .crearProducto .imagen img{
      width: 400px;
      height: 400px;
      border-radius: 30px;
    } 
    }
    @media only screen and (min-width: 830px){
      .productos .categorias .crearProducto{
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
    @media only screen and (min-width: 1200px){
      .productos .categorias .crearProducto .parteuno, .partedos{
        margin: 0px 9%;
      }
    }
</style>