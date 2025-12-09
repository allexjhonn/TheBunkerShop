const products = [
      { id: 'bat01', name: 'Bastão de Baseball', price: 40, desc: 'Arma leve e resistente.', img: 'imagens/bastão.png' },
      { id: 'lan01', name: 'Lanterna', price: 25, desc: 'Ilumina áreas escuras.', img: 'imagens/agoravai 3.png' },
      { id: 'ban01', name: 'Bandagem', price: 15, desc: 'Cura ferimentos leves.', img: 'imagens/bandagem.png' },
      { id: 'can01', name: 'Cantil', price: 20, desc: 'Armazena água potável.', img: 'imagens/garrafa.png' },
      { id: 'ped01', name: 'Pederneira', price: 30, desc: 'Acenda fogueiras facilmente.', img: 'imagens/pederneira.png' },
      { id: 'moch01', name: 'Mochila', price: 60, desc: 'Aumenta espaço de inventário.', img: 'imagens/mochila.png' },
      { id: 'caniv01', name: 'Canivete', price: 35, desc: 'Ferramenta versátil.', img: 'imagens/canivete.png' },
      { id: 'suco01', name: 'Arma (Mp4)', price: 90, desc: 'Use para se defender', img: 'imagens/mp4 Submachine.png' },
      { id: 'sopa01', name: 'Sopa de Tomate', price: 18, desc: 'Recupera HP moderado.', img: 'imagens/imagem tomate.png' },
      { id: 'bin01', name: 'Binóculos', price: 50, desc: 'Permite observar longe.', img: 'imagens/binoculos.png' },
      { id: 'past01', name: "Pastilhas Purificadoras d'Água", price: 22, desc: 'Purifica água contaminada.', img: 'imagens/psta.png' },
      { id: 'rad01', name: 'Rádio', price: 45, desc: 'Comunicação à distância.', img: 'imagens/agoravai 1.png' },
      { id: 'pil01', name: 'Pilhas', price: 12, desc: 'Energia para dispositivos.', img: 'imagens/pilhas.png' },
      { id: 'mach01', name: 'Machado', price: 70, desc: 'Arma poderosa corpo a corpo.', img: 'imagens/agoravai 2.png' },
      { id: 'ammo01', name: 'Munição (várias)', price: 55, desc: 'Essencial para armas de fogo.', img: 'imagens/bala da ak47 e da mp4 Submachine.png' }
    ];

   
    const state = {
      gold: 200,
      hp: 78,
      cart: {},
    };

    // ======= Render produtos =======
    const productsEl = document.getElementById('products');
    function renderProducts(){
      productsEl.innerHTML = '';
      for(const p of products){
        const card = document.createElement('div'); card.className='card';
        card.innerHTML = `
          <img class="pixel-img" src="${p.img}" alt="${p.name}" />
          <div class="meta">
            <div style="font-size:11px">${p.name}</div>
            <div style="font-size:9px; color:#cfcfcf">${p.desc}</div>
            <div class="price">${p.price} DK</div>
            <div style="margin-top:8px"><button class="btn" data-id="${p.id}">Comprar</button></div>
          </div>
        `;
        productsEl.appendChild(card);
      }
    }

    // ======= Carrinho =======
    const cartList = document.getElementById('cartList');
    const totalEl = document.getElementById('total');

    function updateCartUI(){
      const keys = Object.keys(state.cart);
      if(keys.length===0){ cartList.innerText='(vazio)'; totalEl.innerText='0'; return; }
      cartList.innerHTML='';
      let total=0;
      for(const id of keys){
        const item = state.cart[id];
        total += item.price * item.qty;
        const div = document.createElement('div'); div.className='cart-item';
        div.innerHTML = `<div>${item.name} x${item.qty}</div><div>${item.price*item.qty} <button class='small-btn' data-action='inc' data-id='${id}'>+</button> <button class='small-btn' data-action='dec' data-id='${id}'>-</button></div>`;
        cartList.appendChild(div);
      }
      totalEl.innerText = total;
    }

    // ======= Eventos =======
    document.addEventListener('click', (e)=>{
      const buy = e.target.closest('.btn');
      if(buy && buy.dataset && buy.dataset.id){
        addToCart(buy.dataset.id);
      }
      if(e.target.dataset && e.target.dataset.action){
        const id = e.target.dataset.id;
        if(e.target.dataset.action==='inc') changeQty(id, +1);
        if(e.target.dataset.action==='dec') changeQty(id, -1);
      }
    });

    function addToCart(id){
      const product = products.find(p=>p.id===id);
      if(!product) return;
      if(state.gold < product.price){ showModal('Você não tem dinheiro!!. Procure por missões ou venda itens.'); return; }
      if(!state.cart[id]) state.cart[id] = { ...product, qty:0 };
      state.cart[id].qty += 1;
      state.gold -= product.price;
      refreshStats(); updateCartUI();
    }

    function changeQty(id, delta){
      const itm = state.cart[id];
      if(!itm) return;
      itm.qty += delta;
      if(itm.qty<=0){ delete state.cart[id]; }
      // if removing, refund half price (trade-in)
      if(delta<0){ state.gold += Math.max(0, Math.round(itm.price*0.5)); }
      refreshStats(); updateCartUI();
    }

    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', ()=>{
      const keys = Object.keys(state.cart);
      if(keys.length===0){ showModal('Carrinho vazio. Compre algo antes de finalizar.'); return; }
      // Simula entrega e efeitos
      let summary = 'Compra efetuada!\nItens adquiridos:\n';
      for(const id of keys){ const it = state.cart[id]; summary += `- ${it.name} x${it.qty}\\n`; }
      state.cart = {};
      updateCartUI();
      showModal(summary+'\nBoa sorte lá fora.');
    });

    // Modal helpers
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    document.getElementById('modalClose').addEventListener('click', ()=> modal.classList.remove('show'));
    document.getElementById('modalBack').addEventListener('click', ()=> modal.classList.remove('show'));
    function showModal(text){ modalContent.innerText = text; modal.classList.add('show'); }

    // Stats / UI
    function refreshStats(){ document.getElementById('gold').innerText = state.gold; document.getElementById('hp').innerText = state.hp; }

    // Inicialização
    renderProducts(); refreshStats(); updateCartUI();

    // Pequena animação: gotas de pixel caindo (decorativo)
    (function decor(){
      const shop = document.getElementById('shop');
      setInterval(()=>{
        const d = document.createElement('div');
        d.style.position='absolute'; d.style.left=(Math.random()*50)+'%'; d.style.top='0'; d.style.width='6px'; d.style.height='6px';
        d.style.background='#6b2f2f'; d.style.opacity='0.12'; d.style.border='1px solid #000'; d.style.transform='translateY(0)'; d.style.imageRendering='pixelated';
        shop.appendChild(d);
        let y=0; const id=setInterval(()=>{ y+=4; d.style.top=y+'px'; if(y>shop.clientHeight+20){ clearInterval(id); d.remove(); } }, 40);
      },700);
    })();