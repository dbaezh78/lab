import { registerServiceWorker } from './pwa.js';
import { searchSongs } from './search.js';
import { transposeNote, normalizeChord, CHROMATIC_SCALE } from './chords.js';

// --- Estado Global de la SPA ---
let allSongs = [];
let filteredSongs = [];
let currentCanto = null;
let currentKeyOffset = 0; // Transposición en semitonos
let originalSongKey = 'La'; // Nota base del canto cargado
let zoomFactor = 1.0;
let isScrollActive = false;
let scrollIntervalId = null;
let activeStage = null;
let activeMoments = [];
let allAsambleaExpanded = true;
let currentBook = 'resucito';
let favorites = new Set();
let catequesisData = null;

// Referencias del DOM
const dashboardView = document.getElementById('dashboard-view');
const songViewerView = document.getElementById('song-viewer-view');
const songsGrid = document.getElementById('songs-grid');
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const toggleFiltersBtn = document.getElementById('toggle-filters-btn');
const filtersPanel = document.getElementById('filters-panel');
const stageFiltersContainer = document.getElementById('stage-filters-container');
const momentFiltersContainer = document.getElementById('moment-filters-container');

// Referencias del visor
const viewerBackBtn = document.getElementById('viewer-back-btn');
const favoriteBtn = document.getElementById('favorite-btn');
const viewerSongTitle = document.getElementById('viewer-song-title');
const viewerSongSubtitle = document.getElementById('viewer-song-subtitle');
const keyBadge = document.getElementById('key-badge');
const transposeDownBtn = document.getElementById('transpose-down-btn');
const transposeUpBtn = document.getElementById('transpose-up-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const zoomInBtn = document.getElementById('zoom-in-btn');
const scrollPlayBtn = document.getElementById('scroll-play-btn');
const scrollSpeedSlider = document.getElementById('scroll-speed-slider');
const splitLayoutBtn = document.getElementById('split-layout-btn');
const asambleaToggleBtn = document.getElementById('asamblea-toggle-btn');
const settingsOpenBtn = document.getElementById('settings-open-btn');
const cantoLeftCol = document.getElementById('canto-left-col');
const cantoRightCol = document.getElementById('canto-right-col');
const cantoColumnsContainer = document.getElementById('canto-columns');
const viewerAudioContainer = document.getElementById('viewer-audio-container');
const viewerAudioPlayer = document.getElementById('viewer-audio-player');
const notesTextarea = document.getElementById('notes-textarea');

// Nuevas referencias de la barra de herramientas y buscador rápido
const toneCapoTrigger = document.getElementById('tone-capo-trigger');
const capoBadge = document.getElementById('capo-badge');
const chordModalTriggerBtn = document.getElementById('chord-modal-trigger-btn');
const scrollSpeedToggleBtn = document.getElementById('scroll-speed-toggle-btn');
const toolbarSpeedPopover = document.getElementById('toolbar-speed-popover');
const prevSongBtn = document.getElementById('prev-song-btn');
const nextSongBtn = document.getElementById('next-song-btn');
const toolbarSearchInput = document.getElementById('toolbar-search-input');
const toolbarSearchSuggestions = document.getElementById('toolbar-search-suggestions');
const cantoHeaderBlock = document.getElementById('canto-header-block');

// Modales
const chordModal = document.getElementById('chord-modal');
const chordModalTitle = document.getElementById('chord-modal-title');
const chordModalClose = document.getElementById('chord-modal-close');
const chordDiagramImg = document.getElementById('chord-diagram-img');
const modalChordNotePicker = document.getElementById('modal-chord-note-picker');

const settingsModal = document.getElementById('settings-modal');
const settingsModalClose = document.getElementById('settings-modal-close');
const capoSelect = document.getElementById('capo-select');
const settingsZoomOutBtn = document.getElementById('settings-zoom-out-btn');
const settingsZoomInBtn = document.getElementById('settings-zoom-in-btn');
const settingsZoomBadge = document.getElementById('settings-zoom-badge');
const exportNotesBtn = document.getElementById('export-notes-btn');
const importNotesBtn = document.getElementById('import-notes-btn');

// Estado interno para el prontuario de acordes activo
let selectedModalNote = 'La';
let selectedModalType = 'm';
let isSplitLayout = localStorage.getItem('split-layout') !== 'false';
let activeSongsPlaylist = []; // Almacena el listado activo de cantos en pantalla para navegar

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', async () => {
  // Registrar Service Worker
  registerServiceWorker();
  
  // Cargar preferencias guardadas
  initPreferences();
  
  // Cargar índice de canciones
  try {
    const response = await fetch('data/songs-index.json');
    allSongs = await response.json();
    filteredSongs = [...allSongs];
    renderSongsList(filteredSongs);
  } catch (error) {
    console.error('Error al cargar la base de datos de canciones:', error);
    songsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: red;">Error al cargar cantos. Comprueba la conexión o intenta recargar.</div>`;
  }
  
  // Escuchar cambios de URL/Hash para ruteo virtual
  window.addEventListener('hashchange', routeSPA);
  routeSPA(); // Ruta inicial
  
  // Configurar listeners generales
  setupEventListeners();
});

// --- Ruteo de la SPA ---
function routeSPA() {
  const hash = window.location.hash;
  
  // Detener scroll al cambiar de pantalla
  stopAutoScroll();
  
  if (hash.startsWith('#canto=')) {
    const songId = hash.replace('#canto=', '');
    loadSongView(songId);
  } else {
    // Volver al buscador
    songViewerView.style.display = 'none';
    dashboardView.style.display = 'flex';
    document.title = "RESUCITÓ - Cantos Neocatecumenales";
  }
}

// --- Carga de Detalles de Canción ---
async function loadSongView(songId) {
  try {
    viewerSongTitle.textContent = "Cargando...";
    viewerSongSubtitle.textContent = "";
    cantoLeftCol.innerHTML = "";
    cantoRightCol.innerHTML = "";
    viewerAudioContainer.style.display = 'none';
    
    const response = await fetch(`data/songs/${songId}.json`);
    if (!response.ok) throw new Error('Canto no encontrado');
    
    currentCanto = await response.json();
    
    // Configurar cabecera del visor (Christ block y título de libro)
    if (cantoHeaderBlock) {
      const stage = (currentCanto.catCanto || '').toUpperCase();
      const title = (currentCanto.title || currentCanto.tt || '').toUpperCase();
      const subtitle = currentCanto.subtitle || '';
      
      cantoHeaderBlock.innerHTML = `
        <div class="canto-header-left">
          <img src="img/logo_cantos.png" alt="Cristo" class="canto-header-img">
        </div>
        <div class="canto-header-center">
          <div class="canto-header-stage">${stage}</div>
          <h1 class="canto-header-title">${title}</h1>
          <div class="canto-header-subtitle">${subtitle}</div>
        </div>
        <div class="canto-header-right"></div>
      `;
    }
    
    if (viewerSongTitle) {
      viewerSongTitle.textContent = currentCanto.title || currentCanto.tt || 'Sin Título';
    }
    if (viewerSongSubtitle) {
      viewerSongSubtitle.textContent = currentCanto.subtitle || '';
    }
    document.title = `${currentCanto.title || currentCanto.tt || 'Sin Título'} - Resucitó`;
    
    // Tono original
    originalSongKey = normalizeChord(currentCanto.acorde || 'La');
    currentKeyOffset = 0; // Reiniciar offset
    updateTransposeBadge();
    
    // Cejilla original
    const defaultCapo = parseInt(currentCanto.cejilla) || 0;
    capoSelect.value = defaultCapo;
    if (capoBadge) {
      capoBadge.textContent = formatCapoText(defaultCapo);
    }
    
    // Cargar notas del cantor
    notesTextarea.value = localStorage.getItem(`notes_${songId}`) || '';
    
    // Configurar estrella de favoritos
    favoriteBtn.classList.toggle('active-star', favorites.has(songId));
    
    // Sincronizar botones de navegación anterior / siguiente
    const currentIndex = activeSongsPlaylist.findIndex(s => s.id === songId);
    const playListToUse = currentIndex !== -1 ? activeSongsPlaylist : allSongs;
    const currentIdxToUse = currentIndex !== -1 ? currentIndex : allSongs.findIndex(s => s.id === songId);
    
    if (currentIdxToUse !== -1) {
      prevSongBtn.style.opacity = currentIdxToUse > 0 ? '1' : '0.4';
      prevSongBtn.style.pointerEvents = currentIdxToUse > 0 ? 'auto' : 'none';
      nextSongBtn.style.opacity = currentIdxToUse < playListToUse.length - 1 ? '1' : '0.4';
      nextSongBtn.style.pointerEvents = currentIdxToUse < playListToUse.length - 1 ? 'auto' : 'none';
    } else {
      prevSongBtn.style.opacity = '0.4';
      prevSongBtn.style.pointerEvents = 'none';
      nextSongBtn.style.opacity = '0.4';
      nextSongBtn.style.pointerEvents = 'none';
    }
    
    // Limpiar buscador rápido superior
    if (toolbarSearchInput) toolbarSearchInput.value = '';
    if (toolbarSearchSuggestions) toolbarSearchSuggestions.style.display = 'none';
    
    // Configurar audio
    if (currentCanto.audioSrc) {
      viewerAudioPlayer.src = currentCanto.audioSrc;
      viewerAudioContainer.style.display = 'flex';
    } else {
      viewerAudioPlayer.src = '';
      viewerAudioContainer.style.display = 'none';
    }
    
    // Renderizar letras y acordes
    renderSongContent();
    
    // Mostrar visor
    dashboardView.style.display = 'none';
    songViewerView.style.display = 'flex';
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error al cargar detalle del canto:', error);
    alert('No se pudo cargar la letra del canto.');
    window.location.hash = ''; // Volver al listado
  }
}

// --- Renderizado de Canción ---
function formatCapoText(capoValue) {
  const val = parseInt(capoValue) || 0;
  if (val === 0) return '0/ al aire';
  if (val === 1) return '1/ 1º traste';
  if (val === 2) return '2/ 2º traste';
  if (val === 3) return '3/ 3º traste';
  return `${val}/ ${val}º traste`;
}

// --- Renderizado de Canción ---
function renderSongContent() {
  if (!currentCanto) return;
  
  cantoLeftCol.innerHTML = '';
  cantoRightCol.innerHTML = '';
  
  // Renderizar lado izquierdo
  if (currentCanto.lizq) {
    renderSection(cantoLeftCol, currentCanto.lizq);
  }
  
  // Renderizar lado derecho
  if (currentCanto.lder && currentCanto.lder.length > 0) {
    cantoRightCol.style.display = '';
    renderSection(cantoRightCol, currentCanto.lder);
  } else {
    // Si no hay lado derecho, ocultarlo para pantallas grandes
    cantoRightCol.style.display = 'none';
  }
}

function renderSection(container, lines) {
  lines.forEach(item => {
    if (item.type === "collapsible-block") {
      // Bloque colapsable (Asamblea)
      const containerDiv = document.createElement('div');
      containerDiv.className = 'collapsible-block-container';
      containerDiv.dataset.blockId = item.id;
      
      const triggerLine = renderLine(item.triggerLine);
      triggerLine.classList.add('collapsible-trigger');
      
      const contentDiv = document.createElement('div');
      contentDiv.className = 'collapsible-content';
      
      item.lines.forEach(subLine => {
        contentDiv.appendChild(renderLine(subLine));
      });
      
      // Manejar estado inicial de colapso
      const isExpanded = allAsambleaExpanded || item.initialState === 'expanded';
      contentDiv.style.display = isExpanded ? 'block' : 'none';
      
      const triggerLetra = triggerLine.querySelector('.letra');
      if (!isExpanded && triggerLetra && !triggerLetra.textContent.endsWith('...')) {
        triggerLetra.textContent += '...';
      }
      
      triggerLine.addEventListener('click', () => {
        const currentlyVisible = contentDiv.style.display !== 'none';
        contentDiv.style.display = currentlyVisible ? 'none' : 'block';
        const letraSpan = triggerLine.querySelector('.letra');
        if (letraSpan) {
          if (currentlyVisible) {
            if (!letraSpan.textContent.endsWith('...')) letraSpan.textContent += '...';
          } else {
            letraSpan.textContent = letraSpan.textContent.replace('...', '');
          }
        }
      });
      
      containerDiv.appendChild(triggerLine);
      containerDiv.appendChild(contentDiv);
      container.appendChild(containerDiv);
    } else if (item.img) {
      // Entrada de imagen (Diagramas, partituras)
      const imgLineDiv = document.createElement('div');
      imgLineDiv.className = 'linea-imagen';
      const imgEl = document.createElement('img');
      imgEl.src = item.img;
      imgEl.alt = "Diagrama musical";
      imgLineDiv.appendChild(imgEl);
      container.appendChild(imgLineDiv);
    } else {
      // Línea de canto normal
      container.appendChild(renderLine(item));
    }
  });
}

function renderLine(lineItem) {
  const lineDiv = document.createElement('div');
  lineDiv.className = 'linea-canto';
  
  const content = typeof lineItem === 'string' ? lineItem : (lineItem.line || '');
  const sectionClass = lineItem.sC || '';
  const textColor = lineItem.color || '';
  
  if (sectionClass) {
    sectionClass.split(' ').forEach(cls => {
      if (cls) lineDiv.classList.add(cls);
    });
  }
  
  // Parsear texto y acordes
  const firstParenIndex = content.indexOf('(');
  let rawLetra = firstParenIndex !== -1 ? content.substring(0, firstParenIndex) : content;
  
  // Quitar coma final de letra si existe (pero conservar espacios iniciales para alineación)
  let cleanLetra = rawLetra;
  if (cleanLetra.endsWith(' ')) {
    cleanLetra = cleanLetra.replace(/\s+$/, '');
  }
  if (cleanLetra.endsWith(',')) {
    cleanLetra = cleanLetra.substring(0, cleanLetra.length - 1);
  }
  // Quitar comillas si envuelven todo
  if (cleanLetra.trim().startsWith('"') && cleanLetra.trim().endsWith('"')) {
    const trimmed = cleanLetra.trim();
    cleanLetra = trimmed.substring(1, trimmed.length - 1);
  }
  
  // Coleccionar acordes
  const matches = [];
  if (firstParenIndex !== -1) {
    const chordsString = content.substring(firstParenIndex);
    const noteMatches = chordsString.match(/\(([^)]+)\)/g);
    if (noteMatches) {
      noteMatches.forEach(noteBlock => {
        const parts = noteBlock.substring(1, noteBlock.length - 1).split(',');
        const noteName = parts[0] ? parts[0].trim() : '';
        const noteType = parts[1] ? parts[1].trim() : '';
        const rawPosition = parseFloat(parts[2]) || 0;
        if (noteName) {
          matches.push({ noteName, noteType, position: Math.round(rawPosition) });
        }
      });
    }
  }
  
  // Si no hay acordes, renderizar simple
  if (matches.length === 0) {
    const letraSpan = document.createElement('span');
    letraSpan.className = 'letra';
    letraSpan.textContent = cleanLetra;
    if (textColor) letraSpan.style.color = textColor;
    lineDiv.appendChild(letraSpan);
    return lineDiv;
  }
  
  // Ordenar acordes por posición
  matches.sort((a, b) => a.position - b.position);
  
  // Renderizar letra con acordes insertados como wrappers inline
  let lastIndex = 0;
  matches.forEach(match => {
    const pos = match.position;
    
    // Texto previo al acorde
    if (pos > lastIndex) {
      const textNode = document.createTextNode(cleanLetra.substring(lastIndex, pos));
      lineDiv.appendChild(textNode);
    }
    
    // Carácter en la posición (o espacio si está fuera de rango)
    const char = cleanLetra[pos] || ' ';
    
    // Crear wrapper span inline
    const wrapper = document.createElement('span');
    wrapper.className = 'chord-anchor-wrapper';
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    
    // Crear span de nota posicionada
    const chordSpan = document.createElement('span');
    chordSpan.className = 'nota-posicionada';
    chordSpan.dataset.originalNote = match.noteName;
    chordSpan.dataset.noteType = match.noteType;
    
    const transposedNote = transposeNote(match.noteName, currentKeyOffset);
    chordSpan.textContent = transposedNote + (match.noteType ? ' ' : '') + match.noteType;
    
    wrapper.appendChild(chordSpan);
    wrapper.appendChild(document.createTextNode(char));
    
    lineDiv.appendChild(wrapper);
    lastIndex = pos + 1; // saltar el carácter que metimos al wrapper
  });
  
  // Agregar resto del texto
  if (lastIndex < cleanLetra.length) {
    const remainingText = document.createTextNode(cleanLetra.substring(lastIndex));
    lineDiv.appendChild(remainingText);
  }
  
  // Aplicar color de texto si corresponde
  if (textColor) {
    lineDiv.style.color = textColor;
  }
  
  return lineDiv;
}

// --- Transposición cromática ---
function updateTransposeBadge() {
  const transposedKey = transposeNote(originalSongKey, currentKeyOffset);
  keyBadge.textContent = transposedKey;
}

function shiftKey(semitones) {
  currentKeyOffset = (currentKeyOffset + semitones) % 12;
  updateTransposeBadge();
  
  // Actualizar todos los acordes en pantalla sin re-renderizar todo
  document.querySelectorAll('.nota-posicionada').forEach(span => {
    const originalNote = span.dataset.originalNote;
    const noteType = span.dataset.noteType;
    const transposedNote = transposeNote(originalNote, currentKeyOffset);
    span.textContent = transposedNote + (noteType ? ' ' : '') + noteType;
  });
}

// --- Diagramas de Acordes ---
function updateModalChordDiagram() {
  const noteName = selectedModalNote;
  const noteType = selectedModalType;
  
  // Resaltar botón de Nota
  modalChordNotePicker.querySelectorAll('.btn-picker').forEach(btn => {
    const btnNote = btn.dataset.note;
    btn.classList.toggle('active', btnNote.toLowerCase() === noteName.toLowerCase());
  });
  
  // Actualizar textos informativos en el modal
  const subtitle = document.getElementById('chord-modal-subtitle');
  if (subtitle) {
    subtitle.innerHTML = `Selecciona el nuevo acorde para reemplazar a <strong>[${noteName}${noteType ? ' ' : ''}${noteType}]</strong> y transportar todo el canto completo:`;
  }
  
  const label = document.getElementById('chord-picker-label');
  if (label) {
    label.innerHTML = `Cambiar acorde <strong>[${noteName}${noteType ? ' ' : ''}${noteType}]</strong> a:`;
  }
  
  const diagTitle = document.getElementById('chord-diagram-title');
  if (diagTitle) {
    diagTitle.innerHTML = `Digitación del acorde <strong>${noteName}${noteType ? ' ' : ''}${noteType}</strong>:`;
  }
  
  // Mapear el acorde a su correspondiente nombre de imagen
  const normalizedBase = noteName.toLowerCase()
    .replace('do#', 'dos')
    .replace('re#', 'res')
    .replace('fa#', 'fas')
    .replace('sol#', 'sols')
    .replace('si♭', 'sib')
    .replace('sib', 'sib');
  
  let typeSuffix = noteType.toLowerCase()
    .replace('maj7', 'maj7')
    .replace('7', '7')
    .replace('m', 'm');
  
  let filename = `${normalizedBase}${typeSuffix}.jpg`;
  
  chordDiagramImg.src = `ima/${filename}`;
  chordDiagramImg.onerror = () => {
    // Fallback a acorde base
    chordDiagramImg.src = `ima/${normalizedBase}.jpg`;
    chordDiagramImg.onerror = () => {
      // Fallback secundario si nada carga
      chordDiagramImg.src = 'img/ico.ico';
    };
  };
}

function showChordDiagram(noteName, noteType) {
  selectedModalNote = noteName;
  selectedModalType = noteType;
  
  updateModalChordDiagram();
  chordModal.style.display = 'flex';
}

// --- Auto-scroll ---
function toggleAutoScroll() {
  if (isScrollActive) {
    stopAutoScroll();
  } else {
    startAutoScroll();
  }
}

function startAutoScroll() {
  isScrollActive = true;
  scrollPlayBtn.querySelector('span').textContent = 'pause';
  scrollPlayBtn.classList.add('active');
  
  // El intervalo se regula con el slider (min: 1, max: 100)
  // Mapear slider (25 por defecto) a tiempo en ms
  const speed = parseInt(scrollSpeedSlider.value);
  const intervalMs = Math.max(10, 110 - speed); // a mayor slider, menor tiempo de espera
  
  scrollIntervalId = setInterval(() => {
    window.scrollBy({ top: 1, behavior: 'auto' });
    // Detener al llegar al final de la página
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      stopAutoScroll();
    }
  }, intervalMs);
}

function stopAutoScroll() {
  isScrollActive = false;
  scrollPlayBtn.querySelector('span').textContent = 'south';
  scrollPlayBtn.classList.remove('active');
  if (scrollIntervalId) {
    clearInterval(scrollIntervalId);
    scrollIntervalId = null;
  }
}

// --- Buscador y Renderizado de Lista ---
function renderSongsList(songsList) {
  activeSongsPlaylist = songsList;
  songsGrid.innerHTML = '';
  
  if (songsList.length === 0) {
    songsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">No se encontraron cantos con los filtros actuales.</div>`;
    return;
  }
  
  songsList.forEach(song => {
    const card = document.createElement('a');
    card.className = 'song-card';
    card.href = `#canto=${song.id}`;
    
    // Obtener color/estilo de la etapa
    let stageClass = 'badge-otros';
    const cleanStage = song.stage.toLowerCase();
    if (cleanStage.includes('pre')) stageClass = 'badge-precatecumenado';
    else if (cleanStage.includes('cate')) stageClass = 'badge-catecumenado';
    else if (cleanStage.includes('ele')) stageClass = 'badge-eleccion';
    else if (cleanStage.includes('lit')) stageClass = 'badge-liturgia';
    else if (cleanStage.includes('cat')) stageClass = 'badge-catolicos';
    
    card.innerHTML = `
      <div class="song-card-number">
        <span>Canto #${song.dbno || 'S/N'}</span>
        <span class="badge ${stageClass}">${song.stage}</span>
      </div>
      <div class="song-card-title">${song.title}</div>
      <div class="song-card-subtitle">${song.subtitle}</div>
      <div class="song-card-badges">
        ${song.hasAudio ? '<span class="badge badge-audio">Audio</span>' : ''}
        ${song.cejilla ? `<span class="badge badge-capo">Cejilla: ${song.cejilla}</span>` : ''}
        ${song.acorde ? `<span class="badge badge-capo">${song.acorde}</span>` : ''}
      </div>
    `;
    
    songsGrid.appendChild(card);
  });
}

async function renderCatequesis() {
  songsGrid.innerHTML = '';
  
  if (!catequesisData) {
    songsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">Cargando catequesis...</div>`;
    try {
      const response = await fetch('data/catequesis.json');
      catequesisData = await response.json();
    } catch (e) {
      console.error('Error al cargar catequesis:', e);
      songsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: red;">No se pudo cargar la catequesis.</div>`;
      return;
    }
  }
  
  songsGrid.innerHTML = '';
  const container = document.createElement('div');
  container.className = 'catequesis-container';
  
  catequesisData.forEach(item => {
    const card = document.createElement('div');
    card.className = 'catequesis-card';
    
    const htmlContent = item.catequesis || '';
    const author = item.autor ? `<p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px;"><b>Autor:</b> ${item.autor} | <b>Fuente:</b> ${item.fuente_biblica || 'Litúrgica'}</p>` : '';
    
    card.innerHTML = `
      <h2>${item.titulo || item.title || 'Sin Título'}</h2>
      ${author}
      <div class="catequesis-body">${htmlContent}</div>
    `;
    container.appendChild(card);
  });
  
  songsGrid.appendChild(container);
}

async function handleSearchAndFilters() {
  if (currentBook === 'catequesis') {
    document.querySelector('.search-box-container').style.display = 'none';
    document.querySelector('.filters-toggle-section').style.display = 'none';
    filtersPanel.style.display = 'none';
    toggleFiltersBtn.classList.remove('active');
    
    await renderCatequesis();
    return;
  }
  
  document.querySelector('.search-box-container').style.display = 'flex';
  document.querySelector('.filters-toggle-section').style.display = 'block';
  
  let sourceList = allSongs;
  if (currentBook === 'favoritos') {
    sourceList = allSongs.filter(song => favorites.has(song.id));
  } else {
    sourceList = allSongs.filter(song => song.sourceBook === currentBook);
  }
  
  const query = searchInput.value;
  filteredSongs = searchSongs(sourceList, query, activeStage, activeMoments);
  renderSongsList(filteredSongs);
}

// --- Event Listeners ---
function setupEventListeners() {
  // Pestañas de Libros
  document.querySelectorAll('.book-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.book-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentBook = tab.dataset.book;
      
      // Limpiar búsqueda y filtros al cambiar de libro
      searchInput.value = '';
      clearSearchBtn.style.display = 'none';
      
      // Reiniciar filtros visuales
      activeStage = null;
      stageFiltersContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      activeMoments = [];
      momentFiltersContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      
      handleSearchAndFilters();
    });
  });

  // Buscador e inputs
  searchInput.addEventListener('input', () => {
    clearSearchBtn.style.display = searchInput.value ? 'block' : 'none';
    handleSearchAndFilters();
  });
  
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.style.display = 'none';
    handleSearchAndFilters();
  });
  
  // Toggle panel filtros
  toggleFiltersBtn.addEventListener('click', () => {
    const isVisible = filtersPanel.style.display !== 'none';
    filtersPanel.style.display = isVisible ? 'none' : 'flex';
    toggleFiltersBtn.classList.toggle('active', !isVisible);
  });
  
  // Clic en etapas
  stageFiltersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    
    const stage = btn.dataset.stage;
    if (activeStage === stage) {
      activeStage = null;
      btn.classList.remove('active');
    } else {
      stageFiltersContainer.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
      activeStage = stage;
      btn.classList.add('active');
    }
    handleSearchAndFilters();
  });
  
  // Clic en momentos litúrgicos
  momentFiltersContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-pill');
    if (!btn) return;
    
    const moment = btn.dataset.moment;
    const index = activeMoments.indexOf(moment);
    
    if (index > -1) {
      activeMoments.splice(index, 1);
      btn.classList.remove('active');
    } else {
      activeMoments.push(moment);
      btn.classList.add('active');
    }
    handleSearchAndFilters();
  });
  
  // Botones de visor
  viewerBackBtn.addEventListener('click', () => {
    window.location.hash = '';
  });
  
  // Zoom settings
  if (settingsZoomOutBtn) settingsZoomOutBtn.addEventListener('click', () => updateZoom(zoomFactor - 0.1));
  if (settingsZoomInBtn) settingsZoomInBtn.addEventListener('click', () => updateZoom(zoomFactor + 0.1));

  // Clic en Tone/Capo trigger para abrir transposición
  if (toneCapoTrigger) {
    toneCapoTrigger.addEventListener('click', () => {
      if (!currentCanto) return;
      const currentTransposedNote = transposeNote(originalSongKey, currentKeyOffset);
      showChordDiagram(currentTransposedNote, currentCanto.typeSuffix || '');
    });
  }

  // Botón de acordes / transposición
  if (chordModalTriggerBtn) {
    chordModalTriggerBtn.addEventListener('click', () => {
      if (!currentCanto) return;
      const currentTransposedNote = transposeNote(originalSongKey, currentKeyOffset);
      showChordDiagram(currentTransposedNote, currentCanto.typeSuffix || '');
    });
  }

  // Botón de Dividir Pantalla (Book icon)
  if (splitLayoutBtn) {
    splitLayoutBtn.addEventListener('click', () => {
      isSplitLayout = !isSplitLayout;
      localStorage.setItem('split-layout', isSplitLayout ? 'true' : 'false');
      splitLayoutBtn.classList.toggle('active', isSplitLayout);
      if (cantoColumnsContainer) {
        cantoColumnsContainer.classList.toggle('single-column', !isSplitLayout);
      }
    });
  }

  // Control de velocidad en popover
  if (scrollSpeedToggleBtn) {
    scrollSpeedToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = toolbarSpeedPopover.style.display !== 'none';
      toolbarSpeedPopover.style.display = isVisible ? 'none' : 'block';
    });
    
    document.addEventListener('click', (e) => {
      if (toolbarSpeedPopover && !toolbarSpeedPopover.contains(e.target) && e.target !== scrollSpeedToggleBtn) {
        toolbarSpeedPopover.style.display = 'none';
      }
    });
  }

  // Navegación de Canto Anterior
  if (prevSongBtn) {
    prevSongBtn.addEventListener('click', () => {
      if (!currentCanto) return;
      const currentIndex = activeSongsPlaylist.findIndex(s => s.id === currentCanto.id);
      const playListToUse = currentIndex !== -1 ? activeSongsPlaylist : allSongs;
      const currentIdxToUse = currentIndex !== -1 ? currentIndex : allSongs.findIndex(s => s.id === currentCanto.id);
      
      if (currentIdxToUse > 0) {
        const prevSong = playListToUse[currentIdxToUse - 1];
        window.location.hash = `#canto=${prevSong.id}`;
      }
    });
  }

  // Navegación de Canto Siguiente
  if (nextSongBtn) {
    nextSongBtn.addEventListener('click', () => {
      if (!currentCanto) return;
      const currentIndex = activeSongsPlaylist.findIndex(s => s.id === currentCanto.id);
      const playListToUse = currentIndex !== -1 ? activeSongsPlaylist : allSongs;
      const currentIdxToUse = currentIndex !== -1 ? currentIndex : allSongs.findIndex(s => s.id === currentCanto.id);
      
      if (currentIdxToUse !== -1 && currentIdxToUse < playListToUse.length - 1) {
        const nextSong = playListToUse[currentIdxToUse + 1];
        window.location.hash = `#canto=${nextSong.id}`;
      }
    });
  }

  // Buscador rápido de la barra de herramientas superior
  if (toolbarSearchInput) {
    toolbarSearchInput.addEventListener('input', () => {
      const query = toolbarSearchInput.value.trim();
      if (!query) {
        toolbarSearchSuggestions.style.display = 'none';
        return;
      }
      
      const matches = searchSongs(allSongs, query).slice(0, 8); // Máximo 8 sugerencias
      
      if (matches.length === 0) {
        toolbarSearchSuggestions.innerHTML = `<div class="search-suggestion-item" style="color: var(--text-muted); cursor: default;">No se encontraron cantos</div>`;
      } else {
        toolbarSearchSuggestions.innerHTML = matches.map(song => `
          <div class="search-suggestion-item" data-id="${song.id}">
            <strong>${song.titulo || song.title}</strong>
            <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">${song.catCanto || ''}</span>
          </div>
        `).join('');
      }
      toolbarSearchSuggestions.style.display = 'block';
    });
    
    if (toolbarSearchSuggestions) {
      toolbarSearchSuggestions.addEventListener('click', (e) => {
        const item = e.target.closest('.search-suggestion-item');
        if (!item || !item.dataset.id) return;
        window.location.hash = `#canto=${item.dataset.id}`;
        toolbarSearchSuggestions.style.display = 'none';
        toolbarSearchInput.value = '';
      });
      
      document.addEventListener('click', (e) => {
        if (toolbarSearchSuggestions && !toolbarSearchSuggestions.contains(e.target) && e.target !== toolbarSearchInput) {
          toolbarSearchSuggestions.style.display = 'none';
        }
      });
    }
  }
  
  scrollPlayBtn.addEventListener('click', toggleAutoScroll);
  
  scrollSpeedSlider.addEventListener('input', () => {
    if (isScrollActive) {
      // Reiniciar scroll con nueva velocidad
      stopAutoScroll();
      startAutoScroll();
    }
  });
  
  asambleaToggleBtn.addEventListener('click', () => {
    allAsambleaExpanded = !allAsambleaExpanded;
    asambleaToggleBtn.classList.toggle('active', allAsambleaExpanded);
    asambleaToggleBtn.querySelector('span').textContent = allAsambleaExpanded ? 'visibility' : 'visibility_off';
    
    document.querySelectorAll('.collapsible-content').forEach(content => {
      content.style.display = allAsambleaExpanded ? 'block' : 'none';
    });
    document.querySelectorAll('.collapsible-trigger').forEach(trigger => {
      const letraSpan = trigger.querySelector('.letra');
      if (allAsambleaExpanded) {
        letraSpan.textContent = letraSpan.textContent.replace('...', '');
      } else {
        if (!letraSpan.textContent.endsWith('...')) letraSpan.textContent += '...';
      }
    });
  });
  
  settingsOpenBtn.addEventListener('click', () => {
    settingsModal.style.display = 'flex';
  });
  
  // Guardado de favoritos
  favoriteBtn.addEventListener('click', () => {
    if (!currentCanto) return;
    const songId = currentCanto.id;
    if (favorites.has(songId)) {
      favorites.delete(songId);
      favoriteBtn.classList.remove('active-star');
    } else {
      favorites.add(songId);
      favoriteBtn.classList.add('active-star');
    }
    localStorage.setItem('favorites', JSON.stringify([...favorites]));
    
    if (currentBook === 'favoritos') {
      handleSearchAndFilters();
    }
  });
  
  // Guardado de notas del cantor
  notesTextarea.addEventListener('input', () => {
    if (currentCanto) {
      localStorage.setItem(`notes_${currentCanto.id}`, notesTextarea.value);
    }
  });
  
  // Cejilla select
  capoSelect.addEventListener('change', () => {
    if (!currentCanto) return;
    const selectedCapo = parseInt(capoSelect.value) || 0;
    const originalCantoCapo = parseInt(currentCanto.cejilla) || 0;
    
    if (capoBadge) {
      capoBadge.textContent = formatCapoText(selectedCapo);
    }
    
    // Shift chords relatively:
    // Nueva cejilla cambia los nombres de acordes virtuales que debe tocar el guitarrista
    // Diferencia de semitonos: (originalCantoCapo - selectedCapo)
    const relativeShift = originalCantoCapo - selectedCapo;
    
    document.querySelectorAll('.nota-posicionada').forEach(span => {
      const originalNote = span.dataset.originalNote;
      const noteType = span.dataset.noteType;
      // Aplicar transposición de cejilla + transposición de tono de usuario
      const finalShift = relativeShift + currentKeyOffset;
      const finalNote = transposeNote(originalNote, finalShift);
      span.textContent = finalNote + (noteType ? ' ' : '') + noteType;
    });
  });
  
  // Cerrar modales
  chordModalClose.addEventListener('click', () => chordModal.style.display = 'none');
  chordModal.addEventListener('click', (e) => {
    if (e.target === chordModal) chordModal.style.display = 'none';
  });
  
  settingsModalClose.addEventListener('click', () => settingsModal.style.display = 'none');
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.style.display = 'none';
  });
  
  // Click listeners para el prontuario de acordes interactivo
  modalChordNotePicker.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-picker');
    if (!btn) return;
    
    const chosenNote = btn.dataset.note;
    const fromIdx = CHROMATIC_SCALE.indexOf(normalizeChord(selectedModalNote));
    const toIdx = CHROMATIC_SCALE.indexOf(normalizeChord(chosenNote));
    
    if (fromIdx !== -1 && toIdx !== -1) {
      let diff = toIdx - fromIdx;
      if (diff !== 0) {
        shiftKey(diff);
        selectedModalNote = chosenNote;
        updateModalChordDiagram();
      }
      // Cerrar el modal al realizar la selección
      chordModal.style.display = 'none';
    }
  });
  
  // Selección de temas
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.dataset.theme;
      setTheme(theme);
    });
  });
  
  // Exportar / Importar notas
  exportNotesBtn.addEventListener('click', exportNotes);
  importNotesBtn.addEventListener('click', importNotes);
  
  // Cerrar con Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      chordModal.style.display = 'none';
      settingsModal.style.display = 'none';
    }
  });
  
  // Recalcular posiciones en resize de pantalla
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      if (currentCanto) renderSongContent();
    }, 150);
  });
}

function updateZoom(factor) {
  zoomFactor = Math.max(0.6, Math.min(2.0, factor));
  document.documentElement.style.setProperty('--font-zoom', zoomFactor);
  if (settingsZoomBadge) {
    settingsZoomBadge.textContent = `${Math.round(zoomFactor * 100)}%`;
  }
}

// --- Ajustes Visuales y Preferencias ---
function initPreferences() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  setTheme(savedTheme);
  
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites) {
    try {
      favorites = new Set(JSON.parse(savedFavorites));
    } catch (e) {
      console.error('Error al cargar favoritos:', e);
    }
  }

  // Inicializar clase y botón de dividir pantalla
  if (cantoColumnsContainer) {
    cantoColumnsContainer.classList.toggle('single-column', !isSplitLayout);
  }
  if (splitLayoutBtn) {
    splitLayoutBtn.classList.toggle('active', isSplitLayout);
  }
}

function setTheme(theme) {
  document.body.className = '';
  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('theme', theme);
  
  // Resaltar botón activo en el modal de ajustes
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.theme === theme);
  });
}

// --- Exportar/Importar Anotaciones locales ---
function exportNotes() {
  const notesObj = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('notes_')) {
      notesObj[key] = localStorage.getItem(key);
    }
  }
  
  const blob = new Blob([JSON.stringify(notesObj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `resucito_notas_cantor_${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importNotes() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  input.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        let count = 0;
        for (const [key, value] of Object.entries(importedData)) {
          if (key.startsWith('notes_')) {
            localStorage.setItem(key, value);
            count++;
          }
        }
        alert(`Se importaron con éxito ${count} anotaciones de cantos.`);
        // Recargar si estamos en un canto
        if (currentCanto) {
          notesTextarea.value = localStorage.getItem(`notes_${currentCanto.id}`) || '';
        }
      } catch (err) {
        alert('El archivo no es un backup válido de notas de cantor.');
      }
    };
    reader.readAsText(file);
  };
  input.click();
}
