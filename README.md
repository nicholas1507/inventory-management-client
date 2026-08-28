# Web Warehouse Inventory - Frontend

Repositori ini berisi kode sumber untuk antarmuka pengguna (Frontend) dari sistem manajemen gudang (Warehouse Inventory). Aplikasi ini dirancang sebagai dasbor interaktif berbasis komponen yang terhubung langsung dengan API Backend untuk mengelola data stok, produk, dan permintaan barang secara visual dan responsif.

---

## Tautan Proyek
* **Aplikasi Web (Live Demo):** https://invenio-stock.netlify.app/login
* **Repositori API (Backend):** https://inventory-management-api-xsv4.onrender.com

---

## Fitur Utama (UI/UX)
* **Dashboard & Charts Interaktif:** Menampilkan visualisasi data analitik pergerakan stok barang menggunakan komponen grafik Chart.js.
* **Manajemen Kontrol Akses (RBAC UI):** Antarmuka dinamis yang otomatis menyembunyikan atau menampilkan menu berdasarkan verifikasi token JWT hasil dekripsi `jwt-decode`.
* **Cetak Laporan PDF:** Dilengkapi dengan fitur ekspor data laporan mutasi gudang langsung ke dalam dokumen PDF unduhan secara instan.
* **Notifikasi Responsif:** Manajemen pesan galat, konfirmasi transaksi, dan status sukses menggunakan pop-up interaktif dari SweetAlert2.

---

## Teknologi Utama
* **Framework:** React 19 & React Router DOM 7
* **Build Tool:** Vite 7
* **UI Template & Components:** CoreUI React 5 & CoreUI Icons
* **Styling:** Bootstrap 5
* **HTTP Client:** Axios

---

## Cara Menjalankan Proyek

Ikuti langkah-langkah di bawah ini untuk menjalankan aplikasi frontend di lingkungan lokal Anda:

### 1. Clone Repositori
```bash
git clone https://github.com/nicholas1507/inventory-management-client
cd inventory-management-client
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment (.env)
1. Buat file baru bernama `.env` di root folder proyek frontend Anda.
2. Tambahkan URL endpoint backend Anda agar Axios dapat terhubung ke server API. Contoh pengisian:
   ```env
   VITE_API_URL=http://localhost:3000
   ```

### 4. Jalankan Aplikasi
* **Mode Pengembangan (Development):**
  ```bash
  npm run dev
  ```
* **Mode Produksi (Build & Preview):**
  ```bash
  npm run build
  npm run preview
  ```

Buka tautan lokal yang tertera pada terminal Anda (biasanya `http://localhost:5173`) di browser.
