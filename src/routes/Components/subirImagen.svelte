

<script>
import {db} from '../js/firebase.js'
import { doc, updateDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from '@zerodevx/svelte-toast'
//Importamos el getContext que
import { setContext } from 'svelte'

        var imagenSelccionada = false;
        let files;
        var procesoDeSubidaDeImagen = 'Subir Foto de Perfil';
        var nombreArchivo;
        var archivo;
        var fileinput;
        var avatar;
        export let then = 'alerta de subida exitosa';
        export let idG, ngName, bussinesCat, imgPerfil, descripcion;
        
  

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
                    procesoDeSubidaDeImagen = 'Subir Foto de Perfil';
        }
        async function subirLinkFS(link) {
          await updateDoc(doc(db, "catalogos", idG), {
          ng_perfil: link
          });
          toast.push(then);
          
        }

        const subirImagen =  ()=>{
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
        

</script>

<div class="subirFotoDePerfil">
    <form action="">
        <input style="display: none" bind:files type="file" accept=".jpg, .jpeg, .png" on:change={(e)=>onFileSelected(e)} bind:this={fileinput} >

        <div class="imagen">
        {#if avatar}
        <img class="avatar" on:click={()=>{fileinput.click();}} src="{avatar}" alt="d" /> <br>
        {:else}
        <img class="avatar" on:click={()=>{fileinput.click();}} src="{imgPerfil}" alt="" />  <br>
        {/if}


        {#if imagenSelccionada}
        <button type="button" on:click={subirImagen}>{procesoDeSubidaDeImagen}</button>
        {:else}
        <button type="button" on:click={()=>{fileinput.click();}}>Cambiar Imagen</button>
        {/if}
      </div>
      
    </form>
</div>

<style>
  .subirFotoDePerfil{
    text-align: center;
    margin: auto;
  }
  .subirFotoDePerfil .imagen{
    margin: auto;
    text-align: center;
  }
  .subirFotoDePerfil .imagen .avatar{
    width: 512px;
    height: 512px;
  }
  .subirFotoDePerfil .imagen button{
    text-align: center;
    margin: auto;
  }
  
</style>