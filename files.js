// Configuración de Firebase
/* const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_AUTH_DOMAIN",
    databaseURL: "TU_DATABASE_URL",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_STORAGE_BUCKET",
    messagingSenderId: "TU_MESSAGING_SENDER_ID",
    appId: "TU_APP_ID"
  }; */
  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  //import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";
import { getDatabase, ref as dbRef, push, get } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";

  // Your web app's Firebase configuration
  /* const firebaseConfig = {
    apiKey: "AIzaSyB1fjJTfYLbi2ciuhIDDkMCrZAmAQcdEeg",
    authDomain: "dani-juli.firebaseapp.com",
    projectId: "dani-juli",
    storageBucket: "dani-juli.firebasestorage.app",
    messagingSenderId: "634240655462",
    appId: "1:634240655462:web:755b31764342d53c480da7"
  }; */


  /* 
  const firebaseConfig = {
        apiKey: "AIzaSyB1fjJTfYLbi2ciuhIDDkMCrZAmAQcdEeg",
        authDomain: "dani-juli.firebaseapp.com",
        databaseURL:"https://dani-juli-default-rtdb.firebaseio.com",
        projectId: "dani-juli",
        storageBucket: "dani-juli.firebasestorage.app",
        messagingSenderId: "634240655462",
        appId: "1:634240655462:web:755b31764342d53c480da7"
      };
  
  */

      class BodaMemories {
        constructor() {
          Swal.fire(
            '¡Bienvenid@!',
            'Podras visualizar y subir las imagenes que tomaste.',
            'success'
          );
          // Inicializamos Firebase
          const firebaseConfig = {
            apiKey: "AIzaSyB1fjJTfYLbi2ciuhIDDkMCrZAmAQcdEeg",
            authDomain: "dani-juli.firebaseapp.com",
            databaseURL:"https://dani-juli-default-rtdb.firebaseio.com",
            projectId: "dani-juli",
            storageBucket: "dani-juli.firebasestorage.app",
            messagingSenderId: "634240655462",
            appId: "1:634240655462:web:755b31764342d53c480da7"
          };
          firebase.initializeApp(firebaseConfig);
          
          this.storage = firebase.storage();
          // this.database = firebase.database(); // Ya no necesitamos la Realtime Database
      
          // Cargar medios desde Storage
          this.loadMediaFromStorage();
      
          // Evento para subir archivos
          document.getElementById('uploadButton').addEventListener('click', () => this.uploadFile());
        }
      
        // Subir archivos a Storage
        uploadFile() {
          const name = document.getElementById('name').value;
          const fileInput = document.getElementById('file');
          const files = fileInput.files; // TODOS los archivos que seleccionó el usuario
        
          // Validar que haya nombre y al menos 1 archivo
          if (!name || files.length === 0) {
            Swal.fire('¡Ups!', 'Por favor, completa tu nombre y selecciona uno o más archivos.', 'warning');
            return;
          }
        
          // 1. Antes de iniciar, mostramos un spinner con SweetAlert
          Swal.fire({
            title: 'Subiendo archivos...',
            text: 'Por favor, espera un momento.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
          
        
          // 2. Crear un array de promesas para subir cada archivo
          const uploadPromises = [];
        
          for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const fileName = `${Date.now()}-${file.name}`;
            
            // Referencia en Storage a la carpeta "uploads/"
            const storageRef = this.storage.ref(`uploads/${fileName}`);
            
            // Promesa que sube el archivo y luego obtiene la URL de descarga
            const uploadTaskPromise = storageRef
              .put(file)
              .then((snapshot) => snapshot.ref.getDownloadURL());
            
            uploadPromises.push(uploadTaskPromise);
          }
        
          // 3. Esperar a que TODAS las subidas terminen usando Promise.all
          Promise.all(uploadPromises)
            .then((downloadURLs) => {
              // Cerramos el spinner
              Swal.close();
        
              // Mostramos un mensaje de éxito
              Swal.fire('¡Listo!', 'Se subieron todos los archivos con éxito.', 'success');
        
              // Limpieza de campos
              document.getElementById('status').innerText = 'Todos los archivos se subieron con éxito.';
              fileInput.value = '';
              document.getElementById('name').value = '';
        
              // (Opcional) Aquí podrías guardar la información (nombre, downloadURLs, etc.) en una base de datos
              // Y recargar la galería para que muestre los nuevos archivos
              this.loadMediaFromStorage();
            })
            .catch((error) => {
              // Si alguna subida falla, vienes aquí
              Swal.close();
              Swal.fire('Error', `Hubo un problema subiendo los archivos: ${error}`, 'error');
              console.error('Error al subir archivos:', error);
              document.getElementById('status').innerText = 'Error al subir los archivos.';
            });
        }
        
        

/*         uploadFile() {
          
          
          const name = document.getElementById('name').value;
          const fileInput = document.getElementById('file');
          const file = fileInput.files[0];
      
          if (!name || !file) {
            Swal.fire('¡Ups!', 'Por favor, completa tu nombre y selecciona un archivo.', 'warning');
            return;
          }

          // 1. Antes de iniciar el upload, mostramos el spinner con SweetAlert
          Swal.fire({
            title: 'Subiendo archivos......',
            text: 'Por favor, espera un momento.',
            allowOutsideClick: false, // Para que no cierren la alerta haciendo clic afuera
            didOpen: () => {
              Swal.showLoading(); // Muestra el spinner
            }
          });
      
          // Generar un nombre para el archivo
          const fileName = `${Date.now()}-${file.name}`;
      
          // Referencia a la carpeta "uploads/"
          const storageRef = this.storage.ref(`uploads/${fileName}`);
      
          const uploadTask = storageRef.put(file);
      
          uploadTask.on(
            'state_changed',
            null,
            (error) => {
              Swal.close(); // Cerramos el spinner
              Swal.fire('Error', 'Hubo un problema al subir el archivo.', 'error');
              console.error('Error al subir el archivo:', error);
              document.getElementById('status').innerText = 'Error al subir el archivo.';
            },
            () => {
                // Una vez que se sube, obtenemos la URL de descarga
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                Swal.close(); // Cerramos el spinner
                // 4. Mostramos un mensaje de éxito
                Swal.fire('¡Listo!', 'El archivo se subió con éxito.', 'success');
                document.getElementById('status').innerText = 'Archivo subido con éxito.';
                fileInput.value = '';
                document.getElementById('name').value = '';
      
                // Aquí podrías guardar la información en Realtime Database o en Firestore si quieres
                // Pero si NO vas a usar base de datos, basta con recargar la galería
                this.loadMediaFromStorage();
              });
            }
          );
        } */
      
        // Cargar la lista de archivos directamente desde Storage
       /*  loadMediaFromStorage() {
          const gallery = document.getElementById('mediaGallery');
          gallery.innerHTML = ''; // Limpiar la galería antes de cargar
      
          // Referencia a la carpeta "uploads/"
          const uploadsRef = this.storage.ref('uploads');
      
          // listAll() nos da la lista de archivos (items) y subcarpetas (prefixes)
          uploadsRef.listAll()
            .then((res) => {
              // Iteramos sobre cada archivo
              res.items.forEach((itemRef) => {
                // Obtenemos la URL de descarga de cada archivo
                itemRef.getDownloadURL().then((url) => {
                  // También podemos obtener los metadatos si hace falta
                  // itemRef.getMetadata().then((metadata) => { ... })
      
                  // Crear un contenedor de Bootstrap
                  const col = document.createElement('div');
                  col.classList.add('col-12', 'col-md-4');
      
                  const card = document.createElement('div');
                  card.classList.add('card', 'shadow-sm');
      
                  const mediaContainer = document.createElement('div');
                  mediaContainer.classList.add('media-container', 'card-body', 'text-center');
      
                  // Dependiendo del tipo MIME que quieras soportar:
                  // en este enfoque, no tienes el 'fileType', pero podrías inferirlo revisando la extensión
                  // o usando getMetadata(). Por simplicidad, asumamos que si es imagen termina en .jpg, .png, etc.
                  if (itemRef.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                    const img = document.createElement('img');
                    img.src = url;
                    mediaContainer.appendChild(img);
                  } else if (itemRef.name.match(/\.(mp4|mov|avi|wmv|flv)$/i)) {
                    const video = document.createElement('video');
                    video.src = url;
                    video.controls = true;
                    mediaContainer.appendChild(video);
                  } else {
                    // Si no coincide con imagen o video, puedes poner un ícono genérico o ignorar
                    const link = document.createElement('a');
                    link.href = url;
                    link.target = "_blank";
                    link.innerText = 'Descargar archivo';
                    mediaContainer.appendChild(link);
                  }
      
                  card.appendChild(mediaContainer);
                  col.appendChild(card);
                  gallery.appendChild(col);
                });
              });
            })
            .catch((error) => {
              console.error('Error al listar archivos en Storage:', error);
              gallery.innerHTML = '<p class="text-center text-danger">Error al cargar archivos de Storage.</p>';
            });
        } */
           loadMediaFromStorage() {
              // 1) Obtenemos el contenedor de la galería
              const gallery = document.getElementById('mediaGallery');
              gallery.innerHTML = ''; // Limpia lo anterior
            
              // 2) (Opcional) Obtenemos el span del contador
              const fileCountElement = document.getElementById('fileCount');
            
              // 3) Referencia a la carpeta "uploads" en tu Storage
              const uploadsRef = firebase.storage().ref('uploads');
            
              // 4) listAll() para obtener los archivos
              uploadsRef.listAll()
                .then((res) => {
                  // res.items -> array de archivos en la carpeta
                  if (fileCountElement) {
                    // Actualizamos el contador
                    fileCountElement.innerText = res.items.length;
                  }
            
                  // Recorremos cada archivo
                  res.items.forEach((itemRef) => {
                    // Obtener URL de descarga
                    itemRef.getDownloadURL().then((url) => {
                      // Creamos la columna .col-4, por ejemplo
                      const col = document.createElement('div');
                      col.classList.add('col-12', 'col-md-4');
            
                      // Creamos la card
                      const card = document.createElement('div');
                      card.classList.add('card', 'shadow-sm');
            
                      // Contenedor interno
                      const mediaContainer = document.createElement('div');
                      mediaContainer.classList.add('media-container', 'card-body', 'text-center');
            
                      // === AQUI VIENE LO IMPORTANTE ===
                      // 1) Creamos un enlace <a> para abrir en nueva pestaña
                      const link = document.createElement('a');
                      link.href = url;       // Apunta a la URL de descarga
                      link.target = '_blank'; // Nueva pestaña
            
                      // 2) Creamos el elemento correspondiente (img/video)
                      if (itemRef.name.match(/\.(jpg|jpeg|png|gif)$/i)) {
                        // Es una imagen
                        const img = document.createElement('img');
                        img.src = url;
                        img.style.maxWidth = '100%';
                        link.appendChild(img); // La metemos dentro del <a>
                      } else if (itemRef.name.match(/\.(mp4|mov|avi|wmv|flv)$/i)) {
                        // Es un video
                        const video = document.createElement('video');
                        video.src = url;
                        video.controls = true;
                        video.style.maxWidth = '100%';
                        link.appendChild(video);
                      } else {
                        // Si no es imagen ni video, ponemos un link genérico
                        link.innerText = 'Descargar archivo';
                      }
            
                      // 3) Agregamos el enlace al mediaContainer
                      mediaContainer.appendChild(link);
            
                      // Y luego armamos la card
                      card.appendChild(mediaContainer);
                      col.appendChild(card);
            
                      // Finalmente, lo agregamos a la galería
                      gallery.appendChild(col);
                    });
                  });
                })
                .catch((error) => {
                  console.error('Error al listar archivos en Storage:', error);
                  gallery.innerHTML = '<p class="text-center text-danger">Error al cargar archivos de Storage.</p>';
                  if (fileCountElement) {
                    fileCountElement.innerText = 0;
                  }
                });
            }
            
      }
      
      // Instanciar la clase cuando cargue el DOM
      document.addEventListener('DOMContentLoaded', () => {
        new BodaMemories();
      });
      