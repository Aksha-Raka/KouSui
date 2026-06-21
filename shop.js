// ============================================================
//  SHOP KOUSUI — File JavaScript Lengkap
//  Penjelasan setiap bagian ada di komentar masing-masing
// ============================================================


// ============================================================
//  BAGIAN 1: DATA PRODUK
//  Ini adalah "database" produk kamu.
//  Setiap produk adalah sebuah object { id, name, price }
//  Kalau mau tambah produk baru, tinggal tambah baris baru.
// ============================================================

const products = [
  { id: "a", name: "Parfum A",       price: 39.99 },
  { id: "b", name: "Parfum Mix B",   price: 49.00 },
  { id: "c", name: "Parfum Anjay S", price: 3.00  },
  { id: "d", name: "Parfum Aksha F", price: 1.00  },
  { id: "e", name: "Parfum Dandi A", price: 50.00 },
];


// ============================================================
//  BAGIAN 2: DATA PROMO CODE (KODE DISKON)
//  Ini daftar kode promo yang valid.
//
//  Ada 2 jenis diskon:
//    - type: "percent" → potongan dalam persen (%)
//    - type: "fixed"   → potongan dalam nominal langsung (CAD)
//
//  Cara tambah kode baru:
//    "KODEBARU": { type: "percent", value: 15, label: "15% off" }
// ============================================================

const promoCodes = {
  "KOUSUI10": { type: "percent", value: 10, label: "10% off"   },
  "SAVE20":   { type: "percent", value: 20, label: "20% off"   },
  "FLAT5":    { type: "fixed",   value: 5,  label: "CAD 5 off" },
};


// ============================================================
//  BAGIAN 3: STATE (DATA YANG BERUBAH-UBAH)
//  - quantities: menyimpan jumlah setiap produk di keranjang
//  - activePromo: kode promo yang sedang aktif (null = tidak ada)
//  - TAX_RATE: persentase pajak (0.13 = 13%)
// ============================================================

let quantities  = {};   // contoh isinya: { a: 2, b: 0, c: 1, ... }
let activePromo = null; // contoh isinya: "KOUSUI10" atau null
const TAX_RATE  = 0.13; // 13% pajak

// Set semua quantity awal ke 0
products.forEach(function(p) {
  quantities[p.id] = 0;
});


// ============================================================
//  BAGIAN 4: RENDER PRODUK KE HALAMAN
//  Fungsi ini membuat tampilan daftar produk secara otomatis
//  dari array products di atas.
//  Dipanggil sekali saat halaman pertama kali dimuat.
// ============================================================

function renderProducts() {
  var list = document.getElementById("product-list");

  // Buat HTML untuk setiap produk, lalu gabungkan
  list.innerHTML = products.map(function(p) {
    return (
      '<div class="product-row">' +
        '<div>' +
          '<p class="product-name">' + p.name + '</p>' +
          '<p class="product-price">CAD ' + p.price.toFixed(2) + ' / botol</p>' +
        '</div>' +
        '<div class="qty-ctrl">' +
          // Tombol kurang: panggil changeQty dengan delta -1
          '<button class="qty-btn" onclick="changeQty(\'' + p.id + '\', -1)">&#8722;</button>' +
          // Tampilan angka quantity, diberi id supaya bisa diupdate
          '<span class="qty-num" id="qty-' + p.id + '">0</span>' +
          // Tombol tambah: panggil changeQty dengan delta +1
          '<button class="qty-btn" onclick="changeQty(\'' + p.id + '\', 1)">+</button>' +
        '</div>' +
      '</div>'
    );
  }).join("");
}


// ============================================================
//  BAGIAN 5: FUNGSI UBAH QUANTITY
//  Dipanggil setiap kali tombol + atau - diklik.
//
//  Parameter:
//    id    → id produk yang diklik (contoh: "a", "b", dll)
//    delta → +1 kalau tombol plus, -1 kalau tombol minus
//
//  Math.max(0, ...) memastikan quantity tidak pernah minus
// ============================================================

function changeQty(id, delta) {
  // Update quantity, tapi tidak boleh kurang dari 0
  quantities[id] = Math.max(0, quantities[id] + delta);

  // Update tampilan angka di layar
  document.getElementById("qty-" + id).textContent = quantities[id];

  // Hitung ulang semua total di ringkasan
  updateSummary();
}


// ============================================================
//  BAGIAN 6: HITUNG & UPDATE RINGKASAN (SUMMARY)
//  Ini adalah fungsi inti — dipanggil setiap kali ada perubahan.
//
//  Urutan kalkulasi:
//    1. Hitung subtotal (jumlah harga × qty semua produk)
//    2. Hitung pajak dari subtotal
//    3. Hitung diskon (jika ada promo aktif)
//    4. Hitung total akhir
// ============================================================

function updateSummary() {

  // --- LANGKAH 1: Hitung Subtotal ---
  // Loop semua produk, kalikan harga dengan quantity masing-masing
  var subtotal = 0;
  products.forEach(function(p) {
    subtotal += p.price * quantities[p.id];
    // Contoh: Parfum A (39.99) × 2 = 79.98
    //         Parfum Mix B (49.00) × 1 = 49.00
    //         subtotal = 79.98 + 49.00 = 128.98
  });

  // --- LANGKAH 2: Hitung Pajak ---
  var tax = subtotal * TAX_RATE;
  // Contoh: 128.98 × 0.13 = 16.77

  // --- LANGKAH 3: Hitung Diskon ---
  var discount = 0;

  if (activePromo !== null) {
    var promo = promoCodes[activePromo];

    if (promo.type === "percent") {
      // Diskon persen: subtotal × (nilai / 100)
      // Contoh KOUSUI10: 128.98 × (10/100) = 12.90
      discount = subtotal * (promo.value / 100);

    } else if (promo.type === "fixed") {
      // Diskon nominal: langsung dikurangi, tapi tidak boleh melebihi subtotal
      // Contoh FLAT5: diskon = CAD 5 (atau subtotal jika subtotal < 5)
      discount = Math.min(promo.value, subtotal);
    }
  }

  // --- LANGKAH 4: Hitung Total Akhir ---
  var total = subtotal + tax - discount;
  if (total < 0) total = 0; // total tidak boleh minus

  // --- UPDATE TAMPILAN DI LAYAR ---
  document.getElementById("s-sub").textContent   = "CAD " + subtotal.toFixed(2);
  document.getElementById("s-tax").textContent   = "CAD " + tax.toFixed(2);
  document.getElementById("s-total").textContent = "CAD " + total.toFixed(2);

  // Tampilkan atau sembunyikan baris diskon
  var discountRow = document.getElementById("discount-row");

  if (discount > 0) {
    // Ada diskon: tampilkan baris diskon
    discountRow.style.display = "flex";
    document.getElementById("s-disc").textContent       = "-CAD " + discount.toFixed(2);
    document.getElementById("disc-badge").textContent   = promoCodes[activePromo].label;
  } else {
    // Tidak ada diskon: sembunyikan baris diskon
    discountRow.style.display = "none";
  }
}


// ============================================================
//  BAGIAN 7: FUNGSI APPLY PROMO CODE
//  Dipanggil saat tombol "Pakai" diklik.
//
//  Langkah-langkahnya:
//    1. Ambil teks dari input, ubah jadi huruf besar (uppercase)
//    2. Cek apakah kode ada di dalam objek promoCodes
//    3. Kalau ada → set activePromo, tampilkan pesan sukses
//    4. Kalau tidak ada → activePromo null, tampilkan pesan error
//    5. Panggil updateSummary() untuk hitung ulang total
// ============================================================

function applyPromo() {
  // Ambil nilai input, hapus spasi di kiri/kanan, ubah ke huruf besar
  var code = document.getElementById("promo-input").value.trim().toUpperCase();
  var msg  = document.getElementById("promo-msg");

  // Kalau input kosong, hapus promo yang aktif
  if (code === "") {
    activePromo = null;
    msg.textContent = "";
    updateSummary();
    return; // berhenti di sini
  }

  // Cek apakah kode ada di daftar promoCodes
  if (promoCodes[code]) {
    // Kode valid!
    activePromo = code;
    msg.className   = "promo-msg promo-ok";
    msg.textContent = "✓ Kode berhasil! " + promoCodes[code].label;
  } else {
    // Kode tidak valid
    activePromo = null;
    msg.className   = "promo-msg promo-err";
    msg.textContent = "✗ Kode tidak valid atau sudah kadaluarsa";
  }

  // Hitung ulang summary dengan/tanpa diskon baru
  updateSummary();
}


// ============================================================
//  BAGIAN 8: FUNGSI CHECKOUT
//  Dipanggil saat tombol "Checkout" diklik.
//  Mengecek apakah ada produk dipilih, lalu tampilkan ringkasan.
// ============================================================

function checkout() {
  // Filter hanya produk yang quantity-nya lebih dari 0
  var selectedItems = products.filter(function(p) {
    return quantities[p.id] > 0;
  });

  // Kalau tidak ada produk dipilih, tampilkan peringatan
  if (selectedItems.length === 0) {
    alert("Belum ada produk yang dipilih!");
    return;
  }

  // Buat teks ringkasan pesanan
  var orderSummary = selectedItems.map(function(p) {
    return p.name + " ×" + quantities[p.id];
  }).join(", ");

  var total = document.getElementById("s-total").textContent;

  alert("Pesanan kamu:\n" + orderSummary + "\n\nTotal: " + total + "\n\nTerima kasih sudah berbelanja di Shop Kousui!");
}


// ============================================================
//  BAGIAN 9: INISIALISASI (JALANKAN SAAT HALAMAN DIMUAT)
//  Dua baris ini dipanggil pertama kali saat halaman dibuka:
//    1. renderProducts() → tampilkan daftar produk
//    2. updateSummary()  → pastikan summary tampil dengan nilai 0
// ============================================================

renderProducts();
updateSummary();

