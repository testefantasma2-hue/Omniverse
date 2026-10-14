/* ============================================================================
   OMNIVERSE EXPANSION MODULE (addons.js)
   Injetado automaticamente via GitHub Actions em todos os módulos do App
   ============================================================================ */

(function() {
  if (window.__omniverseAddonsLoaded) return;
  window.__omniverseAddonsLoaded = true;

  // Detecta em qual módulo estamos
  const isFicha = !!document.getElementById('ranking-geral');
  const isDossie = !!document.getElementById('bct-list');
  const isBestiario = document.title.includes('Bestiário');
  const isHub = !!document.getElementById('mod-ficha');

  // Se estiver no Hub principal (index.html), não exibe os botões internos duplicados
  if (isHub) return;

  // 1. ESTILOS DO PAINEL FLUTUANTE (HUD TÁTICO)
  const style = document.createElement('style');
  style.textContent = `
    .omni-hud {
      position: fixed; bottom: 16px; right: 16px; z-index: 99999;
      display: flex; flex-direction: column; align-items: flex-end; gap: 8px;
      font-family: 'Inter', 'Courier Prime', sans-serif;
    }
    .omni-hud-bar {
      display: flex; gap: 6px; background: rgba(14, 14, 30, 0.95);
      border: 1px solid #8c6dff; border-radius: 50px; padding: 6px 10px;
      box-shadow: 0 8px 25px rgba(0,0,0,0.7); backdrop-filter: blur(6px);
    }
    .omni-btn {
      background: #22224a; color: #e7e3f6; border: 1px solid #4a3d8f;
      border-radius: 30px; padding: 7px 13px; font-size: 12px; font-weight: 700;
      cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 5px;
    }
    .omni-btn:hover { background: #8c6dff; color: #fff; border-color: #fff; }
    .omni-btn.primary { background: #ef5a63; border-color: #ef5a63; color: #fff; }
    .omni-modal {
      background: #12122b; color: #e7e3f6; border: 2px solid #8c6dff;
      border-radius: 14px; padding: 16px; width: 320px; max-width: 90vw;
      box-shadow: 0 12px 35px rgba(0,0,0,0.85); display: none;
    }
    .omni-modal.open { display: block; animation: omniPop 0.18s ease; }
    @keyframes omniPop { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
    .omni-modal h4 { margin: 0 0 10px; color: #f2c069; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display:flex; justify-content:space-between; }
    .omni-roll-result {
      background: #08081a; border: 1px solid #3a316e; border-radius: 10px;
      padding: 12px; text-align: center; margin-top: 10px;
    }
    .omni-roll-num { font-size: 32px; font-weight: 900; color: #f2c069; line-height: 1; }
    .omni-roll-tag { display: inline-block; margin-top: 6px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 800; }
    .gs-4 { background: #f2c069; color: #000; box-shadow: 0 0 12px #f2c069; }
    .gs-3 { background: #8c6dff; color: #fff; }
    .gs-2 { background: #5ad1a0; color: #000; }
    .gs-1 { background: #5aa9ef; color: #000; }
    .gs-0 { background: #4a4231; color: #ccc; }
    .gs-neg { background: #ef5a63; color: #fff; }
    .omni-slot-list { max-height: 180px; overflow-y: auto; display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
    .omni-slot-item { display: flex; justify-content: space-between; align-items: center; background: #08081a; padding: 6px 10px; border-radius: 6px; border: 1px solid #2c2760; font-size: 12px; }
    @media print { .omni-hud { display: none !important; } }
  `;
  document.head.appendChild(style);

  // 2. CONSTRUÇÃO DO HUD
  const hud = document.createElement('div');
  hud.className = 'omni-hud';
  hud.innerHTML = `
    <!-- Modal do Rolador d100 -->
    <div class="omni-modal" id="omni-roller-modal">
      <h4><span>🎲 Rolador Tático d100</span><span style="cursor:pointer" onclick="document.getElementById('omni-roller-modal').classList.remove('open')">✕</span></h4>
      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:8px; font-size:11px;">
        <div>
          <label style="color:#9b93c4;display:block;margin-bottom:3px;">Perícia / VA (%)</label>
          <input type="number" id="omni-va" value="65" min="1" max="100" style="width:100%;padding:6px;background:#08081a;color:#fff;border:1px solid #4a3d8f;border-radius:6px;">
        </div>
        <div>
          <label style="color:#9b93c4;display:block;margin-bottom:3px;">GS Inato (Rank/Cat)</label>
          <input type="number" id="omni-gs-bonus" value="0" min="0" max="10" style="width:100%;padding:6px;background:#08081a;color:#fff;border:1px solid #4a3d8f;border-radius:6px;">
        </div>
      </div>
      <div style="margin-top:8px; display:flex; gap:6px;">
        <input type="text" id="omni-dano-formula" placeholder="Dano opcional (ex: 2d8+4)" style="flex:1;padding:6px;background:#08081a;color:#fff;border:1px solid #4a3d8f;border-radius:6px;font-size:11px;">
        <button class="omni-btn primary" onclick="window.omniExecutarRolagem()">ROLAR</button>
      </div>
      <div class="omni-roll-result" id="omni-roll-output">
        <div style="font-size:11px;color:#9b93c4;">Dê duplo-clique em qualquer perícia da ficha ou clique em ROLAR</div>
      </div>
    </div>

    <!-- Modal do Cofre de Salvamento -->
    <div class="omni-modal" id="omni-vault-modal">
      <h4><span>💾 Cofre de Memória Local</span><span style="cursor:pointer" onclick="document.getElementById('omni-vault-modal').classList.remove('open')">✕</span></h4>
      <div style="font-size:11px; color:#5ad1a0; margin-bottom:6px;">✓ Auto-Save ativo a cada alteração</div>
      <button class="omni-btn primary" style="width:100%;justify-content:center;" onclick="window.omniSalvarSlot()">+ Salvar Ficha Atual no Cofre</button>
      <div class="omni-slot-list" id="omni-vault-list"></div>
    </div>

    <!-- Barra Principal -->
    <div class="omni-hud-bar">
      ${(isFicha || isDossie) ? `<button class="omni-btn" onclick="window.omniToggleModal('omni-vault-modal')">💾 Cofre</button>` : ''}
      <button class="omni-btn primary" onclick="window.omniToggleModal('omni-roller-modal')">🎲 Rolar d100</button>
    </div>
  `;
  document.body.appendChild(hud);

  window.omniToggleModal = function(id) {
    const el = document.getElementById(id);
    const isOpen = el.classList.contains('open');
    document.querySelectorAll('.omni-modal').forEach(m => m.classList.remove('open'));
    if (!isOpen) {
      el.classList.add('open');
      if (id === 'omni-vault-modal') renderizarCofre();
    }
  };

  // 3. MOTOR MATEMÁTICO DE ROLAGEM d100 + GS + DADOS DE DANO
  function rolarExpressaoDano(expr) {
    if (!expr || !expr.trim()) return null;
    try {
      let limpa = expr.toLowerCase().replace(/\s+/g, '');
      let detalhes = [];
      let total = 0;
      const partes = limpa.match(/[+-]?[^+-]+/g) || [];
      partes.forEach(p => {
        let sinal = p.startsWith('-') ? -1 : 1;
        let termo = p.replace(/^[+-]/, '');
        if (termo.includes('d')) {
          let [qtd, faces] = termo.split('d').map(n => parseInt(n) || 1);
          let somaDados = 0;
          for (let i = 0; i < qtd; i++) somaDados += Math.floor(Math.random() * faces) + 1;
          total += sinal * somaDados;
          detalhes.push(`${qtd}d${faces}[${somaDados}]`);
        } else {
          let num = parseInt(termo) || 0;
          total += sinal * num;
          detalhes.push(`${sinal > 0 ? '+' : '-'}${num}`);
        }
      });
      return { total, texto: detalhes.join(' ') };
    } catch(e) { return null; }
  }

  window.omniExecutarRolagem = function(nomeAcao) {
    const vaInput = parseInt(document.getElementById('omni-va').value) || 50;
    const vaEfetivo = Math.min(95, Math.max(1, vaInput));
    const gsBonus = parseInt(document.getElementById('omni-gs-bonus').value) || 0;
    const formulaDano = document.getElementById('omni-dano-formula').value;

    const d100 = Math.floor(Math.random() * 100) + 1;
    const limiarExtremo = Math.max(1, Math.floor(vaEfetivo * 0.25));
    const limiarBom = Math.max(2, Math.floor(vaEfetivo * 0.60));

    let label = '', gsObtido = 0, classeCSS = '', multCritico = 1;

    if (d100 === 1) {
      label = 'EXTREMO ABSOLUTO!'; gsObtido = 4 + gsBonus; classeCSS = 'gs-4'; multCritico = 3;
    } else if (d100 === 100) {
      label = 'FRACASSO EXTREMO!'; gsObtido = -1; classeCSS = 'gs-neg';
    } else if (d100 <= limiarExtremo) {
      label = 'SUCESSO EXTREMO (CRÍTICO)'; gsObtido = 3 + gsBonus; classeCSS = 'gs-3'; multCritico = 2;
    } else if (d100 <= limiarBom) {
      label = 'SUCESSO BOM'; gsObtido = 2 + gsBonus; classeCSS = 'gs-2';
    } else if (d100 <= vaEfetivo) {
      label = 'SUCESSO NORMAL'; gsObtido = 1 + gsBonus; classeCSS = 'gs-1';
    } else {
      label = 'FRACASSO'; gsObtido = 0; classeCSS = 'gs-0';
    }

    let htmlDano = '';
    if (gsObtido > 0 && formulaDano) {
      const resDano = rolarExpressaoDano(formulaDano);
      if (resDano) {
        const danoFinal = resDano.total * multCritico;
        htmlDano = `<div style="margin-top:8px;padding-top:6px;border-top:1px dashed #3a316e;font-size:12px;">
          💥 Dano: <b style="color:#ef5a63;font-size:15px;">${danoFinal}</b> ${multCritico > 1 ? `(Crítico x${multCritico}!)` : ''}
        </div>`;
      }
    }

    const out = document.getElementById('omni-roll-output');
    out.innerHTML = `
      ${nomeAcao ? `<div style="font-size:11px;color:#9b93c4;margin-bottom:4px;">Teste: <b style="color:#fff">${nomeAcao}</b> (Alvo ≤ ${vaEfetivo}%)</div>` : ''}
      <div class="omni-roll-num">${d100}</div>
      <div class="omni-roll-tag ${classeCSS}">${label} (${gsObtido} GS)</div>
      <div style="font-size:10px;color:#9b93c4;margin-top:5px;">Faixas: Crítico ≤ ${limiarExtremo} | Bom ≤ ${limiarBom} | Normal ≤ ${vaEfetivo}</div>
      ${htmlDano}
    `;
  };

  // Duplo-clique inteligente em qualquer linha de Perícia (Ficha Player) ou Competência (Dossiê)
  document.addEventListener('dblclick', e => {
    const rowPericia = e.target.closest('.pericia-row');
    if (rowPericia) {
      const inputs = rowPericia.querySelectorAll('input');
      const nome = inputs[0].value || 'Perícia';
      const pct = parseInt(inputs[1].value) || 50;
      document.getElementById('omni-va').value = pct;
      document.getElementById('omni-roller-modal').classList.add('open');
      window.omniExecutarRolagem(nome);
    }
    const rowComp = e.target.closest('.competencia-row');
    if (rowComp) {
      const inputs = rowComp.querySelectorAll('input');
      const nome = inputs[0].value || 'Competência';
      const va = parseInt(inputs[2].value) || 50;
      const gs = parseInt((inputs[3].value || '0').replace('+','')) || 0;
      document.getElementById('omni-va').value = va;
      document.getElementById('omni-gs-bonus').value = gs;
      document.getElementById('omni-roller-modal').classList.add('open');
      window.omniExecutarRolagem(nome);
    }
  });

  // 4. SISTEMA DE AUTO-SAVE E COFRE LOCAL (LOCALSTORAGE)
  const STORAGE_KEY_AUTO = isFicha ? 'omni_autosave_ficha' : (isDossie ? 'omni_autosave_dossie' : null);
  const STORAGE_KEY_VAULT = isFicha ? 'omni_vault_fichas' : 'omni_vault_dossies';

  function coletarEstadoAtual() {
    if (isDossie && typeof window.collectData === 'function') return window.collectData();
    if (isFicha) {
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
    return null;
  }

  function aplicarEstadoSalvo(data) {
    if (!data) return;
    if (isDossie && typeof window.applyData === 'function') {
      window.applyData(data);
      return;
    }
    if (isFicha) {
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
      if (typeof window.updateCarga === 'function') window.updateCarga();
    }
  }

  if (STORAGE_KEY_AUTO) {
    // Carrega auto-save ao abrir
    setTimeout(() => {
      const salvo = localStorage.getItem(STORAGE_KEY_AUTO);
      if (salvo) {
        try { aplicarEstadoSalvo(JSON.parse(salvo)); } catch(e) {}
      }
    }, 150);

    // Salva a cada input ou clique
    const dispararAutoSave = () => {
      try {
        const estado = coletarEstadoAtual();
        if (estado) localStorage.setItem(STORAGE_KEY_AUTO, JSON.stringify(estado));
      } catch(e) {}
    };
    document.addEventListener('input', dispararAutoSave);
    document.addEventListener('change', dispararAutoSave);
  }

  window.omniSalvarSlot = function() {
    const estado = coletarEstadoAtual();
    if (!estado) return;
    const nome = isFicha ? (estado.basico['nome'] || 'Sem Nome') : (estado.basico['nome-campo'] || 'Entidade');
    const cofre = JSON.parse(localStorage.getItem(STORAGE_KEY_VAULT) || '[]');
    cofre.push({ id: Date.now(), nome, data: estado });
    localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(cofre));
    renderizarCofre();
  };

  window.omniCarregarSlot = function(id) {
    const cofre = JSON.parse(localStorage.getItem(STORAGE_KEY_VAULT) || '[]');
    const item = cofre.find(x => x.id === id);
    if (item) {
      aplicarEstadoSalvo(item.data);
      localStorage.setItem(STORAGE_KEY_AUTO, JSON.stringify(item.data));
    }
  };

  window.omniDeletarSlot = function(id) {
    let cofre = JSON.parse(localStorage.getItem(STORAGE_KEY_VAULT) || '[]');
    cofre = cofre.filter(x => x.id !== id);
    localStorage.setItem(STORAGE_KEY_VAULT, JSON.stringify(cofre));
    renderizarCofre();
  };

  function renderizarCofre() {
    const list = document.getElementById('omni-vault-list');
    if (!list) return;
    const cofre = JSON.parse(localStorage.getItem(STORAGE_KEY_VAULT) || '[]');
    if (cofre.length === 0) {
      list.innerHTML = `<div style="font-size:11px;color:#9b93c4;text-align:center;padding:8px;">Nenhuma ficha salva no cofre ainda.</div>`;
      return;
    }
    list.innerHTML = cofre.map(item => `
      <div class="omni-slot-item">
        <span style="font-weight:600;">${item.nome}</span>
        <div style="display:flex;gap:4px;">
          <button class="omni-btn" style="padding:3px 8px;font-size:10px;" onclick="window.omniCarregarSlot(${item.id})">Abrir</button>
          <button class="omni-btn primary" style="padding:3px 7px;font-size:10px;" onclick="window.omniDeletarSlot(${item.id})">✕</button>
        </div>
      </div>
    `).join('');
  }
})();
