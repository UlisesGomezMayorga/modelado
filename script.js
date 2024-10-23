// Variables globales
let actividades = [];
const container = document.getElementById('container');
const width = container.clientWidth, height = container.clientHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
camera.position.set(10, 10, 1);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Agregar GridHelper
const gridSize = 50; // Tamaño de la rejilla
const gridDivisions = 10; // Número de divisiones
const gridHelper = new THREE.GridHelper(gridSize, gridDivisions);
scene.add(gridHelper);

// Configurar controles de cámara
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// Cargar el archivo STL
const loader = new THREE.STLLoader();
let currentMesh = null;

// Hacer fetch del archivo JSON
fetch('actividades.json')
  .then(response => response.json())
  .then(data => {
    actividades = data;
    console.log('Datos cargados:', actividades);
  })
  .catch(error => console.error('Error al cargar el JSON:', error));

// Buscar actividad en el JSON
function buscarActividad(punto) {
  actividad = parseInt(document.getElementById('select_actividad').value)

  const result = actividades.find(item => item.actividad === actividad && item.punto === punto);

  if (result) {
    // Llamar a la función loadModel con los datos obtenidos del JSON
    loadModel(result.archivo, result.nombre, result.consigna, result.imagen);
  } else {
    alert('Actividad no encontrada.');
  }
}

// Cargar y mostrar el modelo STL
function loadModel(stlFile, nombre, consigna, imagen) {
  document.getElementById('description').innerText = `Nombre: ${nombre}\n\nConsigna: ${consigna}`;
  document.getElementById('image_plane').src = imagen;
  
  loader.load(stlFile, function (geometry) {
    if (currentMesh) {
      scene.remove(currentMesh);
    }
    const material = new THREE.MeshNormalMaterial();
    currentMesh = new THREE.Mesh(geometry, material);
    scene.add(currentMesh);

    // Ajustar rotación del modelo (ajusta según tu necesidad)
    currentMesh.rotation.x = -Math.PI / 2; // Rotar 90 grados sobre el eje X

    // Centrar el objeto
    const box = new THREE.Box3().setFromObject(currentMesh);
    const center = box.getCenter(new THREE.Vector3());
    currentMesh.position.sub(center); // Centra el modelo
  }, undefined, function (error) {
    console.error('Error al cargar el archivo STL:', error);
  });
}

// Animación
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

// Iniciar la animación
animate();

function changeMode(mode, other) {
  document.getElementById(mode).style.display = 'flex';
  document.getElementById(other).style.display = 'none';
}


function updateName(){
	buscarActividad(1)
	document.getElementById('title_actividad').innerHTML = "Actividad " + document.getElementById('select_actividad').value
}