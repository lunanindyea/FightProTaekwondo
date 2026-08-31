const products = [
  {id:1,name:"Dobok Premium",brand:"FightPro",category:"Dobok",price:489000,rating:4.9,sizes:["130","140","150","160","S","M","L"],colors:["Putih"],img:"https://upload.wikimedia.org/wikipedia/commons/7/71/Dobok-_ITF.jpg",badge:"BEST SELLER",desc:"Dobok ringan untuk latihan harian dengan potongan yang memberi ruang gerak."},
  {id:2,name:"Hogu Competition",brand:"Daedo",category:"Pelindung",price:799000,rating:4.8,sizes:["S","M","L","XL"],colors:["Biru","Merah"],img:"https://commons.wikimedia.org/wiki/Special:FilePath/Proteccionestkd.JPG?width=1200",badge:"POPULAR",desc:"Body protector untuk latihan sparring dengan coverage area yang luas."},
  {id:3,name:"Head Guard Pro",brand:"Daedo",category:"Pelindung",price:359000,rating:4.9,sizes:["S","M","L","XL"],colors:["Putih","Biru","Merah"],img:"https://commons.wikimedia.org/wiki/Special:FilePath/ITF_Taekwondo_Sparring_Gear.jpg?width=1200",badge:"TOP RATED",desc:"Head guard dengan desain ringan untuk perlindungan dan mobilitas."},
  {id:4,name:"Kick Gloves",brand:"KWON",category:"Aksesoris",price:219000,rating:4.7,sizes:["S","M","L"],colors:["Merah","Biru"],img:"https://commons.wikimedia.org/wiki/Special:FilePath/TAEKWONDO.jpg?width=1400",badge:"NEW",desc:"Gloves latihan untuk drill tangan dan teknik kombinasi."},
  {id:5,name:"Shin Guard Elite",brand:"FightPro",category:"Pelindung",price:289000,rating:4.8,sizes:["S","M","L","XL"],colors:["Putih","Hitam"],img:"https://commons.wikimedia.org/wiki/Special:FilePath/Proteccionestkd.JPG?width=1200",badge:"BEST SELLER",desc:"Shin guard ringan untuk latihan teknik dan sparring."},
  {id:6,name:"Competition Belt",brand:"FightPro",category:"Sabuk",price:99000,rating:4.8,sizes:["S","M","L"],colors:["Putih","Biru","Merah","Hitam"],img:"https://commons.wikimedia.org/wiki/Special:FilePath/Taekwondo_black_belt.jpg?width=1400",badge:"VALUE",desc:"Sabuk taekwondo dengan jahitan rapat dan bahan nyaman."},
  {id:7,name:"Foot Protector",brand:"Adidas",category:"Sepatu",price:429000,rating:4.7,sizes:["S","M","L","XL"],colors:["Putih","Hitam"],img:"https://commons.wikimedia.org/wiki/Special:FilePath/Foot_protectors.jpg?width=1200",badge:"LIGHTWEIGHT",desc:"Foot protector untuk mobilitas dan perlindungan saat sparring."},
  {id:8,name:"Kick Target Paddle",brand:"FightPro",category:"Target",price:159000,rating:4.9,sizes:["M"],colors:["Merah","Biru"],img:"https://commons.wikimedia.org/wiki/Special:FilePath/Bop-bag_punching_target.JPG?width=1200",badge:"TRAINING",desc:"Target untuk speed drill, akurasi tendangan, dan reaction training."},
  {id:9,name:"FightPro Gear Bag",brand:"FightPro",category:"Tas",price:379000,rating:4.8,sizes:["L"],colors:["Hitam"],img:"https://images.unsplash.com/photo-1550999231-12fdd37f90d5?auto=format&fit=crop&fm=jpg&q=75&w=1000",badge:"NEW",desc:"Tas gear berkapasitas besar untuk dobok, protector, dan accessories."},
  {id:10,name:"Starter Set",brand:"FightPro",category:"Aksesoris",price:999000,rating:5.0,sizes:["S","M","L"],colors:["Putih","Merah","Biru"],img:"https://commons.wikimedia.org/wiki/Special:FilePath/ITF_Taekwondo_Sparring_Gear.jpg?width=1200",badge:"BUNDLE",desc:"Paket latihan untuk pemula: gloves, shin guard, belt, dan accessories."}
];

let cart = JSON.parse(localStorage.getItem("fpt-cart") || "[]");
let wishlist = JSON.parse(localStorage.getItem("fpt-wishlist") || "[]");
let currentSlide = 0;
let slideTimer;

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const formatIDR = n => new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",maximumFractionDigits:0}).format(n);

function saveState(){
  localStorage.setItem("fpt-cart", JSON.stringify(cart));
  localStorage.setItem("fpt-wishlist", JSON.stringify(wishlist));
  updateCounters();
}
function updateCounters(){
  $("#cartCount").textContent = cart.reduce((sum,i)=>sum+i.qty,0);
  $("#wishCount").textContent = wishlist.length;
}
function renderProducts(){
  const q = $("#searchInput").value.toLowerCase().trim();
  const price = $("#priceFilter").value, size=$("#sizeFilter").value, color=$("#colorFilter").value, brand=$("#brandFilter").value;
  const list = products.filter(p=>{
    const text = `${p.name} ${p.brand} ${p.category}`.toLowerCase();
    const [min,max] = price==="all" ? [0,Infinity] : price.split("-").map(Number);
    return (!q || text.includes(q)) &&
      (price==="all" || (p.price>=min && p.price<=max)) &&
      (size==="all" || p.sizes.includes(size)) &&
      (color==="all" || p.colors.includes(color)) &&
      (brand==="all" || p.brand===brand);
  });
  $("#productGrid").innerHTML = list.map(p=>`
    <article class="product-card">
      <div class="product-img" data-detail="${p.id}">
        <img src="${p.img}" alt="${p.name}" loading="lazy">
        <span class="product-badge">${p.badge}</span>
        <button class="wish ${wishlist.includes(p.id)?"active":""}" data-wish="${p.id}" title="Wishlist">${wishlist.includes(p.id)?"♥":"♡"}</button>
      </div>
      <div class="product-info">
        <span class="product-brand">${p.brand}</span>
        <div class="product-name">${p.name}</div>
        <div class="rating">★★★★★ <span>(${p.rating})</span></div>
        <div class="price">${formatIDR(p.price)}</div>
        <div class="product-actions">
          <button class="add-cart" data-add="${p.id}">+ Keranjang</button>
          <button class="buy-now" data-buy="${p.id}" title="Beli sekarang">↗</button>
        </div>
      </div>
    </article>`).join("");
  $("#emptyState").hidden = list.length !== 0;
}
function addToCart(id, qty=1){
  const p=products.find(x=>x.id===id), existing=cart.find(x=>x.id===id);
  if(existing) existing.qty+=qty; else cart.push({id,qty});
  saveState(); renderCart(); openCart();
}
function toggleWish(id){
  wishlist = wishlist.includes(id) ? wishlist.filter(x=>x!==id) : [...wishlist,id];
  saveState(); renderProducts();
}
function renderCart(){
  if(!cart.length){
    $("#cartItems").innerHTML = `<div class="empty-state"><strong>Keranjang masih kosong.</strong><span>Yuk pilih gear untuk latihan berikutnya.</span></div>`;
  } else {
    $("#cartItems").innerHTML = cart.map(item=>{
      const p=products.find(x=>x.id===item.id);
      return `<div class="cart-row">
        <div class="cart-thumb"><img src="${p.img}" alt=""></div>
        <div><strong>${p.name}</strong><small>${formatIDR(p.price)}</small><div class="qty"><button data-minus="${p.id}">−</button><span>${item.qty}</span><button data-plus="${p.id}">+</button></div></div>
        <button class="wish" data-remove="${p.id}" title="Hapus">×</button>
      </div>`;
    }).join("");
  }
  $("#cartTotal").textContent = formatIDR(cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0));
}
function openCart(){ $("#cartDrawer").classList.add("open"); $("#drawerBackdrop").classList.add("open"); }
function closeCart(){ $("#cartDrawer").classList.remove("open"); $("#drawerBackdrop").classList.remove("open"); }

function wa(message){
  window.open(`https://wa.me/6285814568534?text=${encodeURIComponent(message)}`,"_blank");
}
function buyNow(id){
  const p=products.find(x=>x.id===id);
  wa(`halo permisi kak, mau pesan alat yang ${p.name}. Harga ${formatIDR(p.price)}. Apakah masih tersedia?`);
}
function openDetail(id){
  const p=products.find(x=>x.id===id);
  $("#modalContent").innerHTML=`<div class="detail-grid">
    <div class="detail-img"><img src="${p.img}" alt="${p.name}"></div>
    <div class="detail-content"><span class="product-brand">${p.brand} • ${p.category}</span><div class="product-name">${p.name}</div><div class="rating">★★★★★ ${p.rating}</div><div class="price">${formatIDR(p.price)}</div><p>${p.desc}</p>
    <label>Ukuran</label><select><option>${p.sizes.join("</option><option>")}</option></select>
    <label>Warna</label><select><option>${p.colors.join("</option><option>")}</option></select>
    <button class="btn btn-primary" style="width:100%;margin-top:18px" data-modal-add="${p.id}">Tambah ke Keranjang</button></div></div>`;
  $("#modal").classList.add("open");
}

function setSlide(index){
  const slides=$$(".feature-slide"); currentSlide=(index+slides.length)%slides.length;
  slides.forEach((s,i)=>s.classList.toggle("active",i===currentSlide));
  $("#slideIndicator").textContent=`${String(currentSlide+1).padStart(2,"0")} / ${String(slides.length).padStart(2,"0")}`;
}
function startSlider(){ clearInterval(slideTimer); slideTimer=setInterval(()=>setSlide(currentSlide+1),4500); }

document.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]"); if(add) addToCart(Number(add.dataset.add));
  const buy=e.target.closest("[data-buy]"); if(buy) buyNow(Number(buy.dataset.buy));
  const wish=e.target.closest("[data-wish]"); if(wish){e.preventDefault();e.stopPropagation();toggleWish(Number(wish.dataset.wish))}
  const detail=e.target.closest(".product-img"); if(detail && !e.target.closest("[data-wish]")) openDetail(Number(detail.dataset.detail));
  const plus=e.target.closest("[data-plus]"); if(plus){const i=cart.find(x=>x.id===Number(plus.dataset.plus));i.qty++;saveState();renderCart()}
  const minus=e.target.closest("[data-minus]"); if(minus){const i=cart.find(x=>x.id===Number(minus.dataset.minus));i.qty--;if(i.qty<=0)cart=cart.filter(x=>x!==i);saveState();renderCart()}
  const remove=e.target.closest("[data-remove]"); if(remove){cart=cart.filter(x=>x.id!==Number(remove.dataset.remove));saveState();renderCart()}
  const modalAdd=e.target.closest("[data-modal-add]"); if(modalAdd){addToCart(Number(modalAdd.dataset.modalAdd));$("#modal").classList.remove("open")}
  const cat=e.target.closest("[data-category]"); if(cat){$("#searchInput").value="";["priceFilter","sizeFilter","colorFilter","brandFilter"].forEach(id=>$("#"+id).value="all");renderProducts();$("#searchInput").value=cat.dataset.category;renderProducts();location.hash="products"}
});
$("#searchInput").addEventListener("input",renderProducts);
["priceFilter","sizeFilter","colorFilter","brandFilter"].forEach(id=>$("#"+id).addEventListener("change",renderProducts));
$("#resetFilters").addEventListener("click",()=>{["priceFilter","sizeFilter","colorFilter","brandFilter"].forEach(id=>$("#"+id).value="all");$("#searchInput").value="";renderProducts()});
$("#prevSlide").addEventListener("click",()=>{setSlide(currentSlide-1);startSlider()});
$("#nextSlide").addEventListener("click",()=>{setSlide(currentSlide+1);startSlider()});
$("#cartBtn").addEventListener("click",()=>{renderCart();openCart()});
$("#closeCart").addEventListener("click",closeCart);$("#drawerBackdrop").addEventListener("click",closeCart);
$("#modalClose").addEventListener("click",()=>$("#modal").classList.remove("open"));
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")$("#modal").classList.remove("open")});
$("#checkoutBtn").addEventListener("click",()=>{
  if(!cart.length)return;
  const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `- ${p.name} x${i.qty} = ${formatIDR(p.price*i.qty)}`}).join("\n");
  const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
  wa(`halo permisi kak, mau pesan alat yang..\n\n${lines}\n\nTotal: ${formatIDR(total)}\n\nMohon info ketersediaan dan proses pesanannya ya kak.`);
});
$("#floatingWa").addEventListener("click",()=>wa("halo permisi kak, mau pesan alat yang.."));
$("#waLink").addEventListener("click",e=>{e.preventDefault();wa("halo permisi kak, mau pesan alat yang..")});
$("#trackingLink").addEventListener("click",e=>{e.preventDefault();$("#modalContent").innerHTML=`<h2 style="font-family:'Barlow Condensed';font-size:45px">TRACKING PESANAN</h2><p style="color:#68707d;font-size:12px">Masukkan nomor pesanan untuk demo tracking.</p><input id="trackInput" placeholder="Contoh: FPT-2026-001" style="width:100%;padding:13px;border:1px solid #e8ebef;border-radius:8px"><button class="btn btn-primary" style="margin-top:12px;width:100%" onclick="document.querySelector('#trackResult').textContent='Pesanan demo sedang diproses. Hubungi WhatsApp untuk status real-time.'">Lacak Pesanan</button><p id="trackResult" style="font-size:11px;margin-top:15px"></p>`;$("#modal").classList.add("open")});
$("#langBtn").addEventListener("click",()=>{const en=document.documentElement.lang==="id";document.documentElement.lang=en?"en":"id";$("#langBtn").textContent=en?"EN":"ID";alert(en?"English mode is active for navigation labels.":"Mode Indonesia aktif.")});
$("#menuBtn").addEventListener("click",()=>$("#mainNav").classList.toggle("open"));

updateCounters();renderProducts();renderCart();setSlide(0);startSlider();
