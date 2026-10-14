/* ============================================================================
   OMNIVERSE MOBILE UI, ROSTER HUB & DICE ENGINE (addons.js v3.0)
   Corrige layout mobile, cria Aba de Criacao/Galeria de Fichas, 
   habilita salvamento nativo de Criaturas no APK e Rolador D2-D100.
   ============================================================================ */

(function () {
  if (window.__omniV3Loaded) return;
  window.__omniV3Loaded = true;

  const isHub = !!document.getElementById('mod-ficha');
  const isFicha = !!document.getElementById('ranking-geral');
  const isDossie = !!document.getElementById('bct-list');
  const isBook = !isHub && !isFicha && !isDossie;

  const KEY_PLAYERS = 'omni_db_players_v3';
  const KEY_CREATURES = 'omni_db_creatures_v3';
  const KEY_ACTIVE_PLAYER = 'omni_active_player_id';
  const KEY_ACTIVE_CREATURE = 'omni_active_creature_id';

  // ==========================================================================
  // 1. CORREÇÃO GLOBAL DE CSS MOBILE & ESTILO DE CARTÕES (TODOS OS MÓDULOS)
  // ==========================================================================
  const globalCSS = document.createElement('style');
  globalCSS.textContent = `
    html, body {
      max-width: 100vw !important;
      overflow-x: hidden !important;
      -webkit-text-size-adjust: 100%;
    }
    * { box-sizing: border-box; max-width: 100%; }

    /* Corrige livros e tabelas cortadas no celular */
    .book-container, .manual, .shell, .wrap {
      width: 100% !important;
      max-width: 100% !important;
      padding: 14px 12px 90px 12px !important;
      margin: 0 !important;
      overflow-x: hidden !important;
    }
    table {
      display: block !important;
      width: 100% !important;
      overflow-x: auto !important;
      -webkit-overflow-scrolling: touch;
      white-space: nowrap;
      font-size: 0.82em !important;
    }
    th, td { white-space: normal !important; min-width: 75px; word-break: break-word; }
    h1 { font-size: 1.45em !important; word-break: break-word; }
    h2 { font-size: 1.18em !important; word-break: break-word; }

    /* Corrige Dossie de Criatura no Mobile */
    .dossier-header, .dossier-header-bar {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      text-align: center !important;
      gap: 12px !important;
      padding: 16px 12px !important;
    }
    .creature-name-input {
      font-size: 1.3em !important;
      text-align: center !important;
      white-space: normal !important;
    }
    .sub-field-row { justify-content: center !important; }
    .sub-field-row input { width: 100% !important; max-width: 240px !important; }
    .photo-slot { margin: 0 auto !important; }
    .page-body, .folder-content { padding: 14px 12px !important; }
    .folder-tabs {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 6px !important;
      padding: 8px 12px !important;
    }
    .folder-tab {
      border-radius: 6px !important;
      border: 1px solid #a8956a !important;
      transform: none !important;
      text-align: center;
      padding: 8px 6px !important;
    }
    .competencia-head { display: none !important; }
    .competencia-row {
      display: grid !important;
      grid-template-columns: 1fr 1fr 1fr !important;
      gap: 6px !important;
      padding: 8px !important;
      background: rgba(0,0,0,0.06);
      border-radius: 6px;
      margin-bottom: 8px !important;
    }
    .competencia-row input:first-child { grid-column: 1 / -1 !important; font-weight: 700; }

    /* Navegacao da Ficha em Grade 2x3 estilo painel tático mobile */
    .tabs {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 8px !important;
    }
    .tab-btn {
      padding: 11px 8px !important;
      text-align: center !important;
      font-size: 0.72em !important;
      border-radius: 8px !important;
    }

    /* Cartoes de Atributos inspirados em ficha tática mobile */
    .attr-grid {
      display: grid !important;
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
    }
    .attr-block {
      background: linear-gradient(180deg, #161632 0%, #0b0b1a 100%) !important;
      border: 1.5px solid #3d3575 !important;
      border-radius: 14px !important;
      padding: 12px 8px !important;
      box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    /* Barra Superior Nativa de Salvamento Mobile (Ficha e Dossie) */
    .omni-save-bar {
      background: linear-gradient(90deg, #171736, #24193c);
      border: 1px solid #8c6dff;
      border-radius: 12px;
      padding: 10px 14px;
      margin-bottom: 14px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      align-items: center;
      justify-content: space-between;
    }
    .omni-save-bar .status-txt {
      font-size: 0.8em;
      color: #f2c069;
      font-weight: 700;
      font-family: 'Orbitron', monospace, sans-serif;
    }
    .omni-save-actions { display: flex; gap: 6px; flex-wrap: wrap; }
    .omni-action-btn {
      background: #8c6dff; color: #fff; border: none;
      padding: 8px 13px; border-radius: 8px; font-weight: 700;
      font-size: 0.8em; cursor: pointer; font-family: sans-serif;
    }
    .omni-action-btn.green { background: #2eb872; }
    .omni-action-btn.red { background: #ef5a63; }

    /* ========================================================================
       BOTÃO FLUTUANTE DE DADOS (FAB) E PAINEL DE ROLAGEM (D2 A D100)
       ======================================================================== */
    .omni-dice-fab {
      position: fixed;
      bottom: 20px;
      right: 18px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2b8bf2, #6f42c1);
      border: 2px solid #a8d1ff;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 22px rgba(43, 139, 242, 0.65);
      cursor: pointer;
      z-index: 999998;
      transition: transform 0.15s ease;
      user-select: none;
    }
    .omni-dice-fab:active { transform: scale(0.92); }
    .omni-dice-fab svg { width: 32px; height: 32px; }

    .omni-dice-sheet {
      position: fixed;
      bottom: 88px;
      right: 14px;
      width: 335px;
      max-width: calc(100vw - 28px);
      background: #111224;
      border: 1.5px solid #4a558f;
      border-radius: 18px;
      padding: 16px;
      color: #eae6f8;
      font-family: 'Inter', sans-serif;
      box-shadow: 0 16px 45px rgba(0,0,0,0.88);
      z-index: 999999;
      display: none;
    }
    .omni-dice-sheet.open { display: block; animation: fabPop 0.18s ease-out; }
    @keyframes fabPop { from { opacity: 0; transform: translateY(12px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }

    .dice-sheet-head {
      display: flex; justify-content: space-between; align-items: center;
      border-bottom: 1px solid #282c4e; padding-bottom: 8px; margin-bottom: 12px;
      font-weight: 800; font-size: 0.92em; color: #f2c069; letter-spacing: 0.5px;
    }
    .dice-controls-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px;
    }
    .dice-ctrl-box {
      background: #080914; border: 1px solid #2b3058; border-radius: 10px; padding: 8px; text-align: center;
    }
    .dice-ctrl-box label { display: block; font-size: 0.68em; color: #9b93c4; margin-bottom: 5px; text-transform: uppercase; }
    .stepper { display: flex; align-items: center; justify-content: space-between; gap: 4px; }
    .stepper button {
      width: 30px; height: 30px; border-radius: 8px; border: 1px solid #3d4478;
      background: #1a1c38; color: #fff; font-weight: 800; font-size: 1em; cursor: pointer;
    }
    .stepper input {
      width: 55px !important; text-align: center !important; background: transparent !important;
      border: none !important; color: #fff !important; font-weight: 800 !important; font-size: 1.05em !important; padding: 0 !important;
    }

    .dice-grid-btns {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 7px; margin-bottom: 12px;
    }
    .die-btn {
      background: linear-gradient(160deg, #1e2246, #141630);
      border: 1px solid #485299; border-radius: 10px; padding: 10px 4px;
      color: #fff; font-weight: 800; font-size: 0.85em; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      transition: all 0.12s;
    }
    .die-btn:hover, .die-btn:active { background: #2b8bf2; border-color: #fff; transform: translateY(-1px); }
    .die-btn.d100-btn { grid-column: span 2; background: linear-gradient(135deg, #6f42c1, #ef5a63); border-color: #f2c069; }
    .die-btn span.die-sub { font-size: 0.62em; color: #b8c0ee; font-weight: 400; }

    .dice-result-box {
      background: #070812; border: 1px solid #303766; border-radius: 12px;
      padding: 12px; text-align: center; min-height: 76px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .dice-total-num { font-size: 2.1em; font-weight: 900; color: #f2c069; line-height: 1.05; }
    .dice-breakdown { font-size: 0.76em; color: #9b93c4; margin-top: 5px; word-break: break-word; }
    .dice-gs-badge {
      display: inline-block; margin: 6px auto 0; padding: 3px 10px;
      border-radius: 12px; font-size: 0.72em; font-weight: 800;
    }
  `;
  document.head.appendChild(globalCSS);

  // ==========================================================================
  // 2. COMPONENTE DO ROLADOR FLUTUANTE (D2, D4, D6, D8, D12, D20, D100)
  // ==========================================================================
  if (!isHub) {
    const fab = document.createElement('div');
    fab.className = 'omni-dice-fab';
    fab.title = 'Rolador de Dados';
    fab.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="12 2 21 7 21 17 12 22 3 17 3 7 12 2"></polygon>
        <polyline points="12 22 12 12"></polyline>
        <polyline points="21 7 12 12 3 7"></polyline>
        <line x1="3" y1="17" x2="12" y2="12"></line>
        <line x1="21" y1="17" x2="12" y2="12"></line>
      </svg>
    `;

    const sheet = document.createElement('div');
    sheet.className = 'omni-dice-sheet';
    sheet.id = 'omni-dice-sheet';
    sheet.innerHTML = `
      <div class="dice-sheet-head">
        <span>🎲 ROLADOR POLIÉDRICO</span>
        <span style="cursor:pointer;font-size:1.1em;color:#9b93c4;" id="close-dice-sheet">✕</span>
      </div>

      <div class="dice-controls-row">
        <div class="dice-ctrl-box">
          <label>Nº de Dados</label>
          <div class="stepper">
            <button type="button" onclick="window.omniStep('dice-qty', -1, 1, 50)">−</button>
            <input type="number" id="dice-qty" value="1" min="1" max="50">
            <button type="button" onclick="window.omniStep('dice-qty', 1, 1, 50)">+</button>
          </div>
        </div>
        <div class="dice-ctrl-box">
          <label>Modificador (−/+)</label>
          <div class="stepper">
            <button type="button" onclick="window.omniStep('dice-mod', -1, -100, 100)">−</button>
            <input type="number" id="dice-mod" value="0" min="-100" max="100">
            <button type="button" onclick="window.omniStep('dice-mod', 1, -100, 100)">+</button>
          </div>
        </div>
      </div>

      <div class="dice-grid-btns">
        <button type="button" class="die-btn" onclick="window.omniRollDie(2)">D2<span class="die-sub">Moeda</span></button>
        <button type="button" class="die-btn" onclick="window.omniRollDie(4)">D4<span class="die-sub">Tetra</span></button>
        <button type="button" class="die-btn" onclick="window.omniRollDie(6)">D6<span class="die-sub">Cubo</span></button>
        <button type="button" class="die-btn" onclick="window.omniRollDie(8)">D8<span class="die-sub">Octa</span></button>
        <button type="button" class="die-btn" onclick="window.omniRollDie(12)">D12<span class="die-sub">Dodeca</span></button>
        <button type="button" class="die-btn" onclick="window.omniRollDie(20)">D20<span class="die-sub">Icosa</span></button>
        <button type="button" class="die-btn d100-btn" onclick="window.omniRollDie(100)">D100 (Percentual)<span class="die-sub">Sistema Omniverse</span></button>
      </div>

      <div class="dice-result-box" id="omni-dice-result">
        <div style="font-size:0.78em;color:#9b93c4;">Escolha a quantidade, o modificador e toque num dado acima.</div>
      </div>
    `;

    document.body.appendChild(fab);
    document.body.appendChild(sheet);

    fab.addEventListener('click', () => sheet.classList.toggle('open'));
    sheet.querySelector('#close-dice-sheet').addEventListener('click', () => sheet.classList.remove('open'));

    window.omniStep = function (inputId, delta, min, max) {
      const el = document.getElementById(inputId);
      let val = (parseInt(el.value) || 0) + delta;
      el.value = Math.max(min, Math.min(max, val));
    };

    window.omniRollDie = function (faces) {
      const qty = Math.max(1, Math.min(50, parseInt(document.getElementById('dice-qty').value) || 1));
      const mod = parseInt(document.getElementById('dice-mod').value) || 0;
      const rolls = [];
      let sum = 0;
      for (let i = 0; i < qty; i++) {
        const r = Math.floor(Math.random() * faces) + 1;
        rolls.push(r);
        sum += r;
      }
      const finalTotal = sum + mod;
      const modStr = mod > 0 ? ` + ${mod}` : (mod < 0 ? ` − ${Math.abs(mod)}` : '');

      let extraBadge = '';
      if (faces === 100 && qty === 1) {
        const r = rolls[0];
        if (r === 1) extraBadge = `<div class="dice-gs-badge" style="background:#f2c069;color:#000;">★ EXTREMO ABSOLUTO (4 GS)</div>`;
        else if (r === 100) extraBadge = `<div class="dice-gs-badge" style="background:#ef5a63;color:#fff;">💀 FRACASSO EXTREMO (-1 GS)</div>`;
      }

      document.getElementById('omni-dice-result').innerHTML = `
        <div style="font-size:0.72em;color:#8c6dff;font-weight:700;text-transform:uppercase;">Rolagem: ${qty}d${faces}${modStr}</div>
        <div class="dice-total-num">${finalTotal}</div>
        <div class="dice-breakdown">Dados: [ ${rolls.join(', ')} ] ${mod !== 0 ? `(Mod: ${mod > 0 ? '+'+mod : mod})` : ''}</div>
        ${extraBadge}
      `;
    };
  }

  // ==========================================================================
  // 3. SALVAMENTO NATIVO NO CELULAR (FICHA DE PLAYER & DOSSIÊ DE CRIATURA)
  // ==========================================================================
  function getSavedList(key) {
    try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; }
  }
  function setSavedList(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  if (isFicha || isDossie) {
    const toolbar = document.querySelector('.toolbar');
    const saveBar = document.createElement('div');
    saveBar.className = 'omni-save-bar';
    saveBar.innerHTML = `
      <span class="status-txt" id="omni-save-status">${isFicha ? '👤 OPERADOR ATIVO' : '☣️ ENTIDADE P.A.C.E.'}</span>
      <div class="omni-save-actions">
        <button type="button" class="omni-action-btn green" id="btn-native-save">💾 Guardar na Central</button>
        <button type="button" class="omni-action-btn" id="btn-native-new">📄 Limpar / Nova</button>
      </div>
    `;
    if (toolbar && toolbar.parentNode) {
      toolbar.parentNode.insertBefore(saveBar, toolbar.nextSibling);
    } else {
      document.body.insertBefore(saveBar, document.body.firstChild);
    }

    function extrairDadosFichaPlayer() {
      const data = { basico: {}, atributos: [], recursos: [], pericias: [], habilidades: [], inventario: [] };
      ['nome','especie','nivel','idade','altura-peso','conceito','arquetipo','classe-especial','aparencia','ranking-geral','ranking-geral-nivel'].forEach(id => {
        const el = document.getElementById(id); if (el) data.basico[id] = el.value;
      });
      document.querySelectorAll('.attr-block').forEach(b => {
        const s = b.querySelectorAll('select');
        data.atributos.push({
          nome: b.querySelector('.attr-name-input').value,
          val: b.querySelector('.attr-value-row input').value,
          rank: s[0].value, level: s[1].value
        });
      });
      document.querySelectorAll('.resource-block').forEach(b => {
        const n = b.querySelectorAll('input[type=number]');
        data.recursos.push({
          nome: b.querySelector('.resource-name-input').value,
          atual: n[0].value, max: n[1].value,
          cor: b.querySelector('.resource-fill').style.background
        });
      });
      document.querySelectorAll('.pericia-row').forEach(r => {
        const i = r.querySelectorAll('input'), s = r.querySelectorAll('select');
        data.pericias.push({ nome: i[0].value, pct: i[1].value, rank: s[0].value, level: s[1].value });
      });
      document.querySelectorAll('.habilidade-card').forEach(c => {
        const i = c.querySelectorAll('input');
        data.habilidades.push({ nome: i[0].value, tipo: c.querySelector('select').value, custo: i[1].value, desc: c.querySelector('textarea').value });
      });
      document.querySelectorAll('.inv-row').forEach(r => {
        const t = r.querySelectorAll('input[type=text]'), n = r.querySelectorAll('input[type=number]');
        data.inventario.push({ item: t[0].value, qtd: n[0].value, peso: n[1].value, desc: t[1].value, equip: r.querySelector('input[type=checkbox]').checked });
      });
      data.cargaMax = document.getElementById('carga-max')?.value || 100;
      data.historia = document.getElementById('historia')?.value || '';
      data.portrait = document.getElementById('portrait-img')?.src || '';
      return data;
    }

    function carregarDadosFichaPlayer(data) {
      if (!data) return;
      Object.entries(data.basico || {}).forEach(([id, val]) => {
        const el = document.getElementById(id); if (el) el.value = val;
      });
      if (typeof window.updateRankingBadge === 'function') window.updateRankingBadge();
      document.getElementById('attr-grid').innerHTML = '';
      (data.atributos || []).forEach(a => window.addAttributeRow(a));
      document.getElementById('recursos-list').innerHTML = '';
      (data.recursos || []).forEach(r => window.addRecursoRow(r));
      document.getElementById('pericias-list').innerHTML = '';
      (data.pericias || []).forEach(p => window.addPericiaRow(p));
      document.getElementById('habilidades-list').innerHTML = '';
      (data.habilidades || []).forEach(h => window.addHabilidadeRow(h));
      document.getElementById('inventario-list').innerHTML = '';
      (data.inventario || []).forEach(i => window.addInventarioRow(i));
      if (data.cargaMax) document.getElementById('carga-max').value = data.cargaMax;
      if (data.historia !== undefined) document.getElementById('historia').value = data.historia;
      if (data.portrait && data.portrait.startsWith('data:')) {
        const img = document.getElementById('portrait-img');
        img.src = data.portrait; img.style.display = 'block';
        document.getElementById('portrait-placeholder').style.display = 'none';
      }
      if (typeof window.updateCarga === 'function') window.updateCarga();
    }

    function salvarFichaAtualNoBanco(mostrarAlerta) {
      const hoje = new Date().toLocaleDateString('pt-BR');
      if (isFicha) {
        const payload = extrairDadosFichaPlayer();
        const list = getSavedList(KEY_PLAYERS);
        let activeId = localStorage.getItem(KEY_ACTIVE_PLAYER);
        let idx = list.findIndex(x => String(x.id) === String(activeId));
        const resumoPV = payload.recursos?.[0] ? `${payload.recursos[0].atual}/${payload.recursos[0].max}` : '—';
        const entry = {
          id: idx >= 0 ? list[idx].id : Dat