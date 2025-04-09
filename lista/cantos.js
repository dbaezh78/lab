// Lista de cantos
const cantos = [
    "Alabaré",
    "Santo, Santo, Santo",
    "Cristo vive",
    "Aquí estoy Señor",
    "Ven Espíritu Santo",
    "Gloria a Dios",
    "Danos tu paz",
    "Canta y camina",
    "Pescador de hombres",
    "El Señor es mi pastor"
  ];
  
  // Referencias al DOM
  const inputBuscar = document.getElementById('buscar');
  const lista = document.getElementById('listaCantos');
  
  // Función para mostrar cantos
  function mostrarCantos(filtro = '') {
    lista.innerHTML = ''; // Limpiar lista
    const cantosFiltrados = cantos.filter(canto =>
      canto.toLowerCase().includes(filtro.toLowerCase())
    );
  
    if (cantosFiltrados.length === 0) {
      lista.innerHTML = '<li>No se encontraron cantos.</li>';
      return;
    }
  
    cantosFiltrados.forEach(canto => {
      const li = document.createElement('li');
      li.textContent = canto;
      lista.appendChild(li);
    });
  }
  
  // Escuchar evento de búsqueda
  inputBuscar.addEventListener('input', () => {
    mostrarCantos(inputBuscar.value);
  });
  
  // Mostrar todos los cantos al inicio
  mostrarCantos();
  