# GOWEZ - Go With Electric Zone 🛵⚡

Aplikasi penyewaan sepeda listrik modern dengan antarmuka web yang interaktif dan backend Spring Boot yang robust.

## 📋 Deskripsi Proyek

GOWEZ adalah platform penyewaan sepeda listrik yang memungkinkan pengguna untuk:
- Melihat sepeda listrik yang tersedia
- Melakukan penyewaan dengan sistem pembayaran digital
- Mengelola rental aktif mereka
- Melihat riwayat penyewaan

## 🚀 Teknologi yang Digunakan

### Backend
- **Java 21** - Platform pengembangan utama
- **Spring Boot 3.5.0** - Framework aplikasi utama
- **Spring Data JPA** - Manajemen database dan ORM
- **Spring Security Crypto** - Enkripsi password
- **Spring Validation** - Validasi data input
- **Lombok** - Mengurangi boilerplate code
- **H2 Database** - Database in-memory untuk development
- **PostgreSQL** - Database production
- **Maven** - Build tool dan dependency management

### Frontend
- **HTML5** - Struktur halaman web
- **CSS3** - Styling dengan custom properties dan animasi
- **JavaScript (Vanilla)** - Interaktivitas dan komunikasi dengan API
- **Tailwind CSS** - Framework CSS utility-first
- **Google Fonts** - Typography (Montserrat, Poppins, Space Grotesk)
- **Animate.CSS** - Animasi CSS siap pakai

### Fitur UI/UX
- **Responsive Design** - Optimal di semua ukuran layar
- **Dark Theme** - Tema gelap dengan aksen neon
- **Abstract Background** - Elemen visual futuristik
- **Smooth Animations** - Transisi yang halus
- **Interactive Elements** - Hover effects dan feedback visual

## 📁 Struktur Proyek

```
gowez/
├── src/
│   ├── main/
│   │   ├── java/com/web/gowez/
│   │   │   ├── GowezApplication.java          # Main application class
│   │   │   ├── config/
│   │   │   │   └── WebConfig.java             # Konfigurasi web dan CORS
│   │   │   ├── controller/                    # REST API Controllers
│   │   │   │   ├── BikeController.java        # Endpoint sepeda
│   │   │   │   ├── RentalController.java      # Endpoint penyewaan
│   │   │   │   └── UserController.java        # Endpoint pengguna
│   │   │   ├── dto/                          # Data Transfer Objects
│   │   │   │   ├── RentalCreateRequest.java
│   │   │   │   └── RentalUpdateRequest.java
│   │   │   ├── model/                        # Entity models
│   │   │   │   ├── Bike.java                 # Model sepeda
│   │   │   │   ├── Rental.java               # Model penyewaan
│   │   │   │   ├── Role.java                 # Enum role pengguna
│   │   │   │   └── User.java                 # Model pengguna
│   │   │   ├── repository/                   # Data access layer
│   │   │   │   ├── BikeRepository.java
│   │   │   │   ├── RentalRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   └── service/                      # Business logic layer
│   │   │       ├── BikeService.java
│   │   │       ├── RentalService.java
│   │   │       └── UserService.java
│   │   └── resources/
│   │       ├── application.properties         # Konfigurasi aplikasi
│   │       └── static/                       # File statis web
│   │           ├── index.html                # Halaman utama
│   │           ├── auth/                     # Halaman autentikasi
│   │           │   ├── login.html
│   │           │   └── register.html
│   │           ├── css/                      # Stylesheet
│   │           │   ├── dashboard.css
│   │           │   ├── index.css
│   │           │   ├── login.css
│   │           │   └── register.css
│   │           ├── home/
│   │           │   └── dashboard.html        # Dashboard pengguna
│   │           └── js/
│   │               └── dashboard.js          # JavaScript dashboard
│   └── test/
│       └── java/com/web/gowez/
│           └── GowezApplicationTests.java    # Unit tests
├── pom.xml                                   # Maven configuration
└── README.md                                # Dokumentasi proyek
```

## 🛠️ Instalasi dan Setup

### Prasyarat
- Java 21 atau lebih tinggi
- Maven 3.6+
- Git

### Langkah Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd gowez
   ```

2. **Install dependencies**
   ```bash
   mvn clean install
   ```

3. **Jalankan aplikasi**
   ```bash
   mvn spring-boot:run
   ```

4. **Akses aplikasi**
   - Buka browser dan kunjungi: `http://localhost:8080`
   - H2 Console (development): `http://localhost:8080/h2-console`

## 🏗️ Arsitektur Aplikasi

### Model Data

#### User (Pengguna)
- `userId` - ID unik pengguna
- `namaLengkap` - Nama lengkap pengguna
- `email` - Email (unique)
- `password` - Password terenkripsi
- `noHp` - Nomor handphone
- `alamat` - Alamat lengkap
- `role` - Role pengguna (USER/ADMIN)

#### Bike (Sepeda)
- `id` - ID unik sepeda
- `name` - Nama sepeda
- `description` - Deskripsi sepeda
- `hourlyRate` - Tarif per jam
- `status` - Status sepeda (AVAILABLE/RENTED/MAINTENANCE)
- `createdAt/updatedAt` - Timestamp

#### Rental (Penyewaan)
- `id` - ID unik penyewaan
- `rentalCode` - Kode unik penyewaan
- `user` - Relasi ke User
- `bike` - Relasi ke Bike
- `startDateTime` - Waktu mulai sewa
- `endDateTime` - Waktu selesai sewa
- `actualReturnDateTime` - Waktu pengembalian aktual
- `durationHours` - Durasi dalam jam
- `hourlyRate` - Tarif per jam saat penyewaan
- `totalCost` - Total biaya
- `paymentMethod` - Metode pembayaran (GOPAY/OVO/DANA)
- `status` - Status penyewaan (ACTIVE/COMPLETED)
- `notes` - Catatan tambahan

### API Endpoints

#### User Management
- `POST /api/users/register` - Registrasi pengguna baru
- `POST /api/users/login` - Login pengguna
- `GET /api/users/getUser` - Informasi pengguna

#### Bike Management
- `GET /api/bikes` - Daftar semua sepeda
- `GET /api/bikes/available` - Daftar sepeda tersedia
- `GET /api/bikes/{id}` - Detail sepeda berdasarkan ID

#### Rental Management
- `GET /api/rentals/user/{userId}/active` - Rental aktif pengguna
- `GET /api/rentals/{id}` - Detail rental berdasarkan ID
- `GET /api/rentals/{id}/user/{userId}` - Detail rental untuk pengguna tertentu
- `POST /api/rentals` - Buat rental baru
- `PUT /api/rentals/{id}` - Update rental
- `POST /api/rentals/{id}/complete` - Selesaikan rental

## 💰 Sistem Pembayaran

Aplikasi mendukung tiga metode pembayaran digital:
- **GoPay** - Integrasi dengan GoPay
- **OVO** - Integrasi dengan OVO
- **DANA** - Integrasi dengan DANA

## 🎨 Fitur UI/UX

### Design System
- **Color Palette**:
  - Abstract Dark: `#0f0e17` (Background utama)
  - Abstract Dark 2: `#1a1a2e` (Background sekunder)
  - Neon Pink: `#ff2a6d` (Aksen primer)
  - Electric Blue: `#05d9e8` (Aksen sekunder)
  - Electric Yellow: `#d1f7ff` (Highlight)
  - Electric Purple: `#a600ff` (Gradient)

### Komponen UI
- **Abstract Background** - Elemen geometris animasi
- **Bike Cards** - Kartu sepeda dengan hover effects
- **Payment Options** - Radio button styling custom
- **Modal Dialogs** - Modal penyewaan dan receipt
- **Cost Calculator** - Kalkulasi biaya real-time
- **Responsive Grid** - Layout adaptif

### Animasi
- **Float Animation** - Elemen background bergerak
- **Hover Effects** - Scale dan shadow pada interaksi
- **Modal Transitions** - Animasi masuk/keluar modal
- **Loading States** - Feedback visual saat proses

## 🔧 Konfigurasi

### Database
- **Development**: H2 in-memory database
- **Production**: PostgreSQL (sesuaikan di `application.properties`)

### Security
- Password menggunakan BCrypt encryption
- CORS dikonfigurasi untuk development (`origins = "*"`)

### Environment Variables
Sesuaikan konfigurasi di `src/main/resources/application.properties`:
```properties
# Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# JPA configuration
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.show-sql=true

# H2 Console
spring.h2.console.enabled=true
```

## 🧪 Testing

Jalankan unit tests:
```bash
mvn test
```

## 📈 Tampilan

### Landing Page
![Image](https://github.com/user-attachments/assets/bb702ad3-c60e-4ede-b2f4-9f3a32a6f0be)

### Login 
![Image](https://github.com/user-attachments/assets/2b03edc5-5c20-4ab5-8995-e339292ffe8b)

### Register
![Image](https://github.com/user-attachments/assets/e1d1ae99-7df6-47db-a43c-7988535ee647)

### Dashboard
![Image](https://github.com/user-attachments/assets/503dbc55-6eb8-4bc6-9559-53a163c7b0f0)

### List Sepeda
![Image](https://github.com/user-attachments/assets/f0b256b5-0136-4266-812d-391a9a44af46)

### Create Data
![Image](https://github.com/user-attachments/assets/c995ffdd-8f88-4534-a855-b25c8aa0c57f)

### Read Data
![Image](https://github.com/user-attachments/assets/b8dc2476-a57d-4765-ad82-28e7c183806e)

### Update Data
![Image](https://github.com/user-attachments/assets/cbb29595-7728-46d9-9765-ea9d1d54fe44)

### Delete Data
![Image](https://github.com/user-attachments/assets/99b920e5-d692-49b0-8575-59fc1c7ad1e9)

### Struk Pembayaran
![Image](https://github.com/user-attachments/assets/8689f442-f701-432e-8f07-c8d5650d439a)

## 🤝 Kontribusi

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 👥 Tim Pengembang

- Himam Bashiran (2311110055)
- Leonardus Ananto Widodo (2311110058)
- Muhammad Rasikh Azfa Riyyasy (211110005)

---

**GOWEZ** - *Go With Electric Zone* 🛵⚡
*Masa depan transportasi dimulai dari sini.*
