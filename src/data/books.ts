import { Book, BookGenre } from '../types/library';

export const HERO_LIBRARY_IMAGE =
  '/src/assets/images/hero_library_reading_room_1794550181499.jpg';

export const BOOKS_CATALOG: Book[] = [
  {
    id: 'senja-sunda-kelapa',
    accessionNumber: 'PA-2026-001',
    title: 'Senja di Pelabuhan Sunda Kelapa',
    subtitle: 'Kisah Nakhoda Pinisi dan Peta Laut yang Hilang',
    author: 'Rendra Pratama',
    genre: BookGenre.SASTRA,
    year: 2024,
    pages: 264,
    totalReadMinutes: 18,
    language: 'Bahasa Indonesia',
    publisher: 'Balai Pustaka Baru',
    featured: true,
    coverImage: '/src/assets/images/cover_sunda_kelapa_1794550181502.jpg',
    coverPalette: {
      bg: '#1E293B',
      accent: '#D97706',
      text: '#F8FAFC',
      border: '#334155',
    },
    synopsis:
      'Di penghujung abad kesembilan belas, seorang juru mudi muda asal Makassar menemukan sebuah gulungan peta kayu cendana di ruang palka kapal pinisi tua. Novel ini menelusuri persahabatan para pelaut Nusantara, pergulatan menjaga tradisi bahari di tengah gelombang modernisasi pelabuhan, dan arti pulang bagi jiwa yang terbiasa hidup di atas ombak.',
    chapters: [
      {
        id: 'ssk-1',
        number: 1,
        title: 'Dermaga Kayu Ulin',
        readMinutes: 6,
        pullQuote:
          'Laut tidak pernah menyimpan dendam, ia hanya memulangkan apa yang tidak cukup kokoh menahan angin barat.',
        paragraphs: [
          'Angin muson timur berembus pelan menyusuri deretan tiang layar di Sunda Kelapa ketika matahari mulai merendah di balik gudang-gudang garam tua. Bau ter kayu, cengkeh basah, dan asin air muara bercampur menjadi aroma yang telah dikenal Daeng Baco sejak usianya belum genap sepuluh tahun. Di atas geladak Bintang Fajar, ia memeriksa tali temali haluan dengan jari-jari yang sudah terbiasa membaca ketegangan serat rami tanpa perlu melihatnya.',
          'Pelabuhan sore itu tidak seramai biasanya. Tiga kapal uap berbendera asing berlabuh jauh di perairan dalam, meninggalkan gelombang kecil yang memukul lambung perahu-perahu layar rakyat. Orang-orang di kedai kopi dermaga membicarakan jadwal pelayaran baru yang serba pasti dengan mesin batu bara, seolah angin tidak lagi berhak menentukan kapan sebuah kapal boleh berangkat.',
          'Namun di dalam kabin buritan yang remang, Nakhoda Kareng justru sedang membuka sebuah peti besi berlapis kuningan yang selama empat dasawarsa hanya berpindah tangan secara rahasia. Di dalamnya tersimpan peta kulit domba dengan garis tinta merah marun yang menunjukkan gugusan karang di sebelah utara Laut Flores—jalur pintas yang konon hanya berani dilalui para pelaut Bugis sebelum kompas modern dikenal luas.',
          'Ketika Kareng memanggil Baco masuk, lampu minyak di tengah meja bergoyang mengikuti ayunan air pasang. Tidak ada kata pembuka yang panjang. Sang nakhoda hanya meletakkan sehelai kompas tembaga di atas peta itu dan berkata bahwa pelayaran esok subuh bukan sekadar mengantar kayu besi ke Surabaya, melainkan mencari jejak kapal saudara mereka yang hilang tujuh tahun silam.',
        ],
      },
      {
        id: 'ssk-2',
        number: 2,
        title: 'Catatan di Balik Kompas',
        readMinutes: 6,
        pullQuote:
          'Setiap garis pada peta lama sesungguhnya adalah ingatan tentang keberanian seseorang menaklukkan ketidakpastian.',
        paragraphs: [
          'Malam sebelum layar dibentangkan, Baco duduk sendirian di ujung dermaga sambil menyalin ulang simbol-simbol bintang dari peta Kareng ke dalam buku catatan bersampul kulit kambing. Ayahnya dahulu sering berpesan bahwa seorang pelaut sejati harus mampu membaca langit bahkan ketika awan mendung menutup separuh cakrawala.',
          'Di sudut peta itu terdapat tiga baris aksara lontara yang tintanya hampir pudar oleh garam laut. Dengan bantuan cahaya lentera, Baco mengeja setiap suku kata dengan hati-hati. Kalimat tersebut tidak menyebut lokasi harta karun atau rempah berharga, melainkan peringatan tentang arus bawah yang berbalik arah setiap bulan purnama di Selat Selayar.',
          'Menjelang tengah malam, seorang juru tulis pelabuhan bernama Aris datang membawakan surat izin berlayar yang baru saja diteken syahbandar. Berbeda dari pelaut lain yang memandang rendah pegawai darat, Baco selalu menghargai Aris karena lelaki berkacamata bulat itu kerap meminjaminya buku-buku catatan pelayaran dari perpustakaan kota.',
          'Keduanya berbincang hingga lonceng menara pelabuhan berdentang dua kali. Aris menyerahkan sebuah teropong kuningan kecil milik mendiang pamannya sebagai pinjaman untuk perjalanan kali ini, berharap Baco kelak kembali membawa kisah baru yang layak ditulis ulang untuk generasi mendatang.',
        ],
      },
      {
        id: 'ssk-3',
        number: 3,
        title: 'Menembus Kabut Selat',
        readMinutes: 6,
        pullQuote:
          'Saat cakrawala menghilang di balik kabut pagi, ketenangan nakhoda menjadi satu-satunya mercusuar bagi seluruh awak kapal.',
        paragraphs: [
          'Tiga hari setelah meninggalkan muara Ciliwung, langit berubah menjadi kelabu pucat. Gelombang dari Laut Jawa mulai meninggi, mengangkat haluan Bintang Fajar lalu menjatuhkannya dengan bunyi berderak yang menguji setiap pasak kayu ulin. Para kelasi bekerja dalam diam yang terlatih, mengikat muatan dan menurunkan layar utama separuh tiang.',
          'Di anjungan kemudi, Baco bergantian memegang roda kayu bersama Nakhoda Kareng. Hujan rintik turun membasahi papan geladak, membuat permukaan kayu licin seperti kaca. Namun tidak satu pun dari mereka menunjukkan kepanikan; setiap perintah disampaikan dengan isyarat tangan dan peluit pendek yang mampu menembus deru angin.',
          'Menjelang fajar hari keempat, kabut tipis di sebelah timur perlahan tersibak oleh cahaya keemasan. Di kejauhan tampak siluet pulau karang yang bentuknya persis seperti sketsa di tepi peta tua Kareng. Sorak syukur pecah dari haluan ketika seekor burung laut melintas rendah, pertanda daratan dangkal dan teluk teduh hanya berjarak beberapa mil laut di depan mereka.',
          'Saat jangkar akhirnya jatuh ke dasar teluk yang jernih, Baco menatap air tenang di sekeliling lambung kapal. Ia menyadari bahwa peta terbaik bukanlah yang paling lengkap menggambar garis pantai, melainkan keberanian untuk terus membaca tanda-tanda alam dengan penuh rasa hormat.',
        ],
      },
    ],
  },
  {
    id: 'jejak-rempah-nusantara',
    accessionNumber: 'PA-2026-002',
    title: 'Jejak Rempah Nusantara',
    subtitle: 'Dari Kepulauan Banda hingga Jalur Sutra Maritim',
    author: 'Prof. Hendra Wijaya',
    genre: BookGenre.SEJARAH,
    year: 2025,
    pages: 312,
    totalReadMinutes: 20,
    language: 'Bahasa Indonesia',
    publisher: 'Pustaka Sejarah Maritim',
    featured: true,
    coverImage: '/src/assets/images/cover_jejak_rempah_1794550182019.jpg',
    coverPalette: {
      bg: '#3F2E21',
      accent: '#B45309',
      text: '#FEF3C7',
      border: '#5C4033',
    },
    synopsis:
      'Sebuah penelusuran sejarah mendalam tentang bagaimana pala, cengkeh, dan lada dari kepulauan timur Indonesia mengubah peta perdagangan dunia, mempertemukan peradaban Asia, Timur Tengah, dan Eropa dalam jaringan pelayaran lintas samudra.',
    chapters: [
      {
        id: 'jrn-1',
        number: 1,
        title: 'Aroma yang Menggerakkan Layar Dunia',
        readMinutes: 7,
        pullQuote:
          'Sebelum emas dari benua baru ditemukan, butiran kecil pala dan cengkeh menjadi penentu kekayaan kerajaan-kerajaan maritim.',
        paragraphs: [
          'Pada abad kelima belas, sebutir buah pala dari Kepulauan Banda atau sekuntum bunga cengkeh kering dari Ternate memiliki nilai tukar yang melampaui logam mulia di pasar-pasar Konstantinopel dan Venesia. Bagi masyarakat Eropa abad pertengahan, rempah-rempah bukan sekadar penyedap hidangan, melainkan penanda status sosial sekaligus bahan utama pengawet pangan dan ramuan pengobatan.',
          'Jauh sebelum kapal-kapal karavel Portugis memutari Tanjung Harapan, jalur perdagangan rempah telah berdenyut kuat melalui tangan para pelaut Nusantara, pedagang Gujarat, saudagar Tiongkok, dan perantara Arab. Pelabuhan-pelabuhan seperti Sriwijaya, Majapahit, Samudera Pasai, dan Malaka tumbuh menjadi kosmopolitan maritim tempat berbagai bahasa, mata uang, dan pengetahuan navigasi bertemu.',
          'Keunggulan utama para pelaut Nusantara terletak pada pemahaman mendalam terhadap pola angin muson. Setiap setengah tahun sekali, angin berubah arah secara teratur—membawa perahu dagang dari Maluku menuju barat pada musim kemarau, dan mengantar kembali kain tenun, keramik biru-putih, serta perkakas besi ke kepulauan timur saat musim penghujan tiba.',
          'Jaringan ini menunjukkan bahwa Nusantara bukanlah wilayah pinggiran dalam sejarah dunia, melainkan poros utama yang menghubungkan peradaban Timur dan Barat melalui pertukaran budaya yang berlangsung damai selama berabad-abad.',
        ],
      },
      {
        id: 'jrn-2',
        number: 2,
        title: 'Bandaneira dan Kartografi Kuno',
        readMinutes: 7,
        pullQuote:
          'Peta-peta laut kuno sering kali menyembunyikan letak pulau rempah demi menjaga rahasia dagang selama puluhan tahun.',
        paragraphs: [
          'Gugusan kepulauan vulkanik Banda di Laut Maluku dahulu menjadi satu-satunya tempat di muka bumi tempat pohon pala (Myristica fragrans) tumbuh subur secara alami. Tanah abu vulkanik yang kaya mineral serta kelembapan angin laut menciptakan ekosistem mikro yang sulit ditiru di belahan dunia lain.',
          'Para kartografer masa lampau menggambar kepulauan rempah dengan penuh imajinasi berdasarkan cerita lisan para pelaut. Sering kali garis pantai sebuah pulau sengaja digeser atau disamarkan pada peta resmi kerajaan agar pesaing dagang tidak menemukan jalur masuk menuju teluk-teluk penghasil panen terbaik.',
          'Kehadiran para pedagang dari berbagai penjuru dunia melahirkan sistem diplomasi adat yang unik di kalangan tetua negeri di Banda dan Maluku. Perjanjian dagang disepakati bukan hanya di atas perkamen, melainkan melalui upacara adat yang mengikat kehormatan kedua belah pihak untuk menjaga keseimbangan pasokan.',
          'Ketika persaingan monopoli mulai masuk pada abad ketujuh belas, benteng-benteng batu dibangun menghadap selat, menandai peralihan era dari perdagangan bebas berbasis jaringan maritim menjadi era perebutan teritorial yang mengubah wajah sejarah kepulauan.',
        ],
      },
      {
        id: 'jrn-3',
        number: 3,
        title: 'Warisan Kuliner dan Bahasa',
        readMinutes: 6,
        pullQuote:
          'Di setiap dapur Nusantara hari ini, masih tersisa gema perjalanan seribu mil laut yang diwariskan oleh nenek moyang.',
        paragraphs: [
          'Jejak jalur rempah tidak hanya dapat dibaca melalui arsip pelabuhan dan bangkai kapal karam di dasar laut, melainkan hidup setiap hari dalam kosakata bahasa serta kekayaan kuliner masyarakat Indonesia. Kata-kata serapan dari bahasa Sanskerta, Arab, Persia, Tamil, Hokkien, hingga Portugis melebur mulus dalam istilah dagang dan nama-nama bumbu dapur.',
          'Masakan seperti rendang dari Minangkabau, coto dari Makassar, hingga semur dari Betawi dan Jawa adalah bukti nyata persilangan pengetahuan botani dan teknik memasak lintas samudra. Ketumbar, jintan, kapulaga, dan kayu manis berpadu harmonis dengan rempah asli seperti lengkuas, serai, kunyit, dan daun salam.',
          'Mempelajari kembali sejarah rempah memberi kita perspektif baru tentang keterbukaan bangsa bahari. Nenek moyang kita tidak pernah menutup diri dari dunia luar; mereka mengolah pengaruh asing dengan kearifan lokal hingga melahirkan identitas budaya yang tangguh dan kaya warna.',
        ],
      },
    ],
  },
  {
    id: 'kosmos-observatorium-bosscha',
    accessionNumber: 'PA-2026-003',
    title: 'Kosmos dari Observatorium Bosscha',
    subtitle: 'Membaca Langit Khatulistiwa dan Misteri Bintang Ganda',
    author: 'Dr. Bagus Santoso',
    genre: BookGenre.SAINS,
    year: 2025,
    pages: 228,
    totalReadMinutes: 15,
    language: 'Bahasa Indonesia',
    publisher: 'Lembaga Sains Semesta',
    featured: true,
    coverImage: '/src/assets/images/cover_kosmos_bosscha_1794550182724.jpg',
    coverPalette: {
      bg: '#0F172A',
      accent: '#3B82F6',
      text: '#F1F5F9',
      border: '#1E293B',
    },
    synopsis:
      'Mengapa langit di garis khatulistiwa menjadi jendela istimewa bagi para astronom dunia? Buku sains populer ini mengajak pembaca masuk ke kubah teleskop refraktor ganda di Lembang dan memahami sejarah alam semesta dengan bahasa yang jernih.',
    chapters: [
      {
        id: 'kob-1',
        number: 1,
        title: 'Keistimewaan Langit Khatulistiwa',
        readMinutes: 5,
        pullQuote:
          'Berdiri di dekat garis ekuator berarti memiliki kursi kehormatan untuk menyaksikan tarian bintang belahan utara dan selatan sekaligus.',
        paragraphs: [
          'Pada malam yang cerah di dataran tinggi Lembang, udara dingin pegunungan membawa kejernihan yang sangat didambakan para pengamat bintang. Dari titik tujuh derajat lintang selatan, kubah putih Observatorium Bosscha menghadap hamparan langit yang jarang dimiliki observatorium besar di Eropa maupun Amerika Utara.',
          'Sebagian besar observatorium modern abad kedua puluh awal dibangun di belahan bumi utara, sehingga gugusan bintang paling terang di langit selatan—termasuk pusat Galaksi Bima Sakti di rasi Sagitarius—sering berada terlalu rendah di cakrawala mereka. Dari tanah Pasundan, pusat galaksi kita melintas tinggi hampir tepat di atas kepala.',
          'Posisi geografis yang strategis inilah yang membuat teleskop refraktor ganda Zeiss berdiameter enam puluh sentimeter dipasang di Lembang pada tahun 1928. Selama hampir satu abad, instrumen optik presisi tinggi ini telah merekam ribuan pelat foto kaca yang mendokumentasikan gerak bintang-bintang ganda di belahan langit selatan.',
          'Setiap titik cahaya yang tampak diam di mata telanjang sesungguhnya bergerak dalam kecepatan luar biasa menembus ruang hampa. Tugas astronomi modern adalah mengukur jarak, komposisi cahaya, serta usia benda langit tersebut menggunakan hukum fisika yang berlaku universal.',
        ],
      },
      {
        id: 'kob-2',
        number: 2,
        title: 'Menimbang Massa Bintang Ganda',
        readMinutes: 5,
        pullQuote:
          'Dua bintang yang saling mengorbit adalah laboratorium gravitasi paling jujur yang disediakan oleh alam semesta.',
        paragraphs: [
          'Tahukah Anda bahwa lebih dari separuh bintang yang tampak tunggal di langit malam sebenarnya adalah pasangan bintang ganda yang saling mengitari pusat massa bersama? Matahari kita termasuk minoritas yang menempuh perjalanan kosmik sendirian.',
          'Bagi para ilmuwan, bintang ganda adalah hadiah terindah untuk memahami evolusi kosmos. Dengan mengamati periode orbit dan jarak pisah antara kedua bintang tersebut melalui hukum gravitasi Newton dan Kepler, astronom dapat menghitung massa bintang secara akurat—sesuatu yang mustahil diukur langsung pada bintang tunggal.',
          'Mengetahui massa sebuah bintang sama pentingnya dengan mengetahui cetak biru kehidupannya. Bintang bermassa besar membakar bahan bakar nuklirnya dengan sangat boros dan berakhir dalam ledakan supernova spektakuler dalam hitungan jutaan tahun, sedangkan bintang kecil seperti katai merah dapat bersinar tenang hingga triliunan tahun.',
          'Di ruang arsip observatorium, ribuan piringan kaca fotografi lama kini didigitalisasi agar generasi peneliti masa kini dapat membandingkan posisi bintang seabad lalu dengan pengukuran satelit ruang angkasa masa sekarang.',
        ],
      },
      {
        id: 'kob-3',
        number: 3,
        title: 'Menjaga Gelapnya Langit Malam',
        readMinutes: 5,
        pullQuote:
          'Polusi cahaya bukan sekadar persoalan lampu kota yang terlalu terang, melainkan hilangnya warisan budaya manusia menatap jagat raya.',
        paragraphs: [
          'Tantangan terbesar astronomi masa kini bukan lagi keterbatasan lensa atau cermin teleskop, melainkan pendar cahaya kota yang kian merambah hingga ke lereng-lereng gunung. Langit malam yang dahulu hitam pekat kini sering berubah menjadi jingga kusam yang menenggelamkan cahaya redup galaksi jauh.',
          'Upaya pelestarian langit gelap di sekitar kawasan observatorium menjadi gerakan kolaboratif antara ilmuwan, pemerintah daerah, dan warga sekitar. Pengaturan tudung lampu jalan agar cahayanya mengarah ke bawah—bukan memancar ke langit—terbukti mampu menghemat energi listrik sekaligus mengembalikan kejernihan Bima Sakti.',
          'Melindungi langit malam berarti menjaga rasa ingin tahu manusia. Dari zaman nenek moyang pelaut yang memakai rasi Biduk sebagai penunjuk arah hingga pelajar masa kini yang mengarahkan teleskop kecil dari halaman rumah, langit selalu menjadi buku teks terbuka paling tua milik umat manusia.',
        ],
      },
    ],
  },
  {
    id: 'etika-ruang-sunyi',
    accessionNumber: 'PA-2026-004',
    title: 'Etika Ruang Sunyi',
    subtitle: 'Renungan Filsafat tentang Waktu, Perhatian, dan Keheningan',
    author: 'Ratna Dewanti',
    genre: BookGenre.FILSAFAT,
    year: 2024,
    pages: 184,
    totalReadMinutes: 14,
    language: 'Bahasa Indonesia',
    publisher: 'Penerbit Karsa Cendekia',
    featured: true,
    coverImage: '/src/assets/images/cover_ruang_sunyi_1794550182979.jpg',
    coverPalette: {
      bg: '#44403C',
      accent: '#A8A29E',
      text: '#FAFAF9',
      border: '#57534E',
    },
    synopsis:
      'Kumpulan esai filosofis tentang bagaimana manusia modern memaknai keheningan di tengah arus informasi yang tidak pernah tidur. Mengajak pembaca membangun jeda batin sebagai ruang lahirnya kebijaksanaan.',
    chapters: [
      {
        id: 'ers-1',
        number: 1,
        title: 'Mengapa Kita Takut pada Hening',
        readMinutes: 5,
        pullQuote:
          'Keheningan sering terasa menakutkan karena di dalamnya tidak ada kebisingan yang bisa menutupi pertanyaan kita sendiri.',
        paragraphs: [
          'Cobalah duduk selama sepuluh menit di sebuah ruangan tanpa menyalakan layar gawai, tanpa memutar musik, dan tanpa membuka buku apa pun. Pada menit pertama, pikiran kita biasanya segera mencari rangsangan baru—teringat pesan yang belum dibalas, daftar pekerjaan esok hari, atau keinginan memeriksa berita terbaru.',
          'Fenomena ini bukan sekadar kebiasaan buruk, melainkan cerminan bagaimana budaya kontemporer mendefinisikan nilai manusia melalui kecepatan respons. Kita sering keliru menyamakan kesibukan dengan kebermaknaan, dan menganggap jeda sebagai waktu yang terbuang percuma.',
          'Dalam tradisi filsafat klasik maupun kebijaksanaan Nusantara, ruang sunyi justru dipandang sebagai prasyarat bagi kejernihan nalar. Sebagaimana air keruh di dalam bejana hanya akan menjadi jernih apabila dibiarkan diam, pikiran manusia membutuhkan ketenangan agar mampu membedakan mana hal yang mendesak dan mana hal yang sungguh penting.',
          'Keheningan sejati bukanlah ketiadaan suara secara fisik, melainkan keadaan batin yang tidak terburu-buru menghakimi setiap sensasi yang lewat.',
        ],
      },
      {
        id: 'ers-2',
        number: 2,
        title: 'Perhatian sebagai Bentuk Kasih Sayang',
        readMinutes: 5,
        pullQuote:
          'Kualitas hidup kita tidak ditentukan oleh seberapa banyak hal yang kita miliki, melainkan kepada apa kita memberikan perhatian penuh.',
        paragraphs: [
          'Filsuf Prancis Simone Weil pernah menuliskan bahwa perhatian yang murni dan tidak terbagi adalah bentuk kemurahan hati paling langka yang dapat diberikan seorang manusia kepada sesamanya. Ketika kita mendengarkan lawan bicara tanpa sibuk menyusun sanggahan di kepala, di situlah martabat dialog terbentuk.',
          'Di era ekonomi perhatian, setiap detik fokus kita diperebutkan oleh ribuan algoritma yang dirancang untuk memicu reaksi emosional instan. Akibatnya, kemampuan kita untuk membaca teks panjang, menyimak musik secara utuh, atau sekadar menikmati percakapan sore hari perlahan menyusut.',
          'Melatih kembali otot perhatian dimulai dari langkah-langkah sederhana: membaca satu bab buku tanpa berpindah jendela layar, berjalan kaki tanpa penyuara telinga untuk mendengar suara angin di dedaunan, serta hadir sepenuhnya ketika sedang makan bersama keluarga.',
          'Ketika perhatian kembali menjadi milik kita, waktu yang tadinya terasa melesat terlalu cepat perlahan kembali memiliki kedalaman dan tekstur.',
        ],
      },
      {
        id: 'ers-3',
        number: 3,
        title: 'Membangun Pendopo dalam Batin',
        readMinutes: 4,
        pullQuote:
          'Arsitektur tradisional Jawa mengajarkan ruang terbuka yang teduh: tempat tamu disambut, tetapi ketenangan rumah tetap terjaga.',
        paragraphs: [
          'Rumah adat Nusantara memiliki pembagian ruang yang sangat filosofis antara ruang luar yang terbuka bagi perjumpaan sosial dan ruang dalam yang menjaga keteduhan keluarga. Konsep ini dapat kita terapkan dalam menata kehidupan mental sehari-hari.',
          'Kita memerlukan pendopo batin untuk berinteraksi dengan pekerjaan, dunia digital, dan dinamika masyarakat. Namun kita juga wajib memelihara ruang dalam yang tidak dapat dimasuki oleh hiruk-pikuk tuntutan luar begitu saja.',
          'Membaca buku sastra, menulis jurnal singkat sebelum tidur, atau merawat tanaman di teras rumah adalah cara-cara memelihara ruang sunyi tersebut. Dari ruang yang tenang itulah keputusan-keputusan hidup yang matang dan berempati akan lahir.',
        ],
      },
    ],
  },
  {
    id: 'bintang-langit-flores',
    accessionNumber: 'PA-2026-005',
    title: 'Bintang Kecil di Langit Flores',
    subtitle: 'Dongeng Kunang-Kunang dan Pohon Beringin Penjaga Lembah',
    author: 'Taufik Hidayat',
    genre: BookGenre.DONGENG,
    year: 2025,
    pages: 124,
    totalReadMinutes: 12,
    language: 'Bahasa Indonesia',
    publisher: 'Taman Cerita Anak',
    featured: true,
    coverImage: '/src/assets/images/cover_hutan_flores_1794550183630.jpg',
    coverPalette: {
      bg: '#14532D',
      accent: '#FACC15',
      text: '#FEFCE8',
      border: '#166534',
    },
    synopsis:
      'Kisah hangat tentang Nara, seekor kunang-kunang kecil yang kehilangan cahaya ekornya dan harus mendaki bukit menuju pohon beringin tua bersama sahabat barunya, burung hantu pemalu dan landak pengumpul embun.',
    chapters: [
      {
        id: 'blf-1',
        number: 1,
        title: 'Lentera yang Meredup',
        readMinutes: 4,
        pullQuote:
          'Cahaya yang paling terang tidak selalu datang dari ukuran yang paling besar, melainkan dari hati yang mau berbagi jalan.',
        paragraphs: [
          'Di sebuah lembah hijau di Flores yang dikelilingi bukit-bukit berkabut, hiduplah ribuan kunang-kunang yang setiap malam menari di antara rumput ilalang. Ketika bulan sabit muncul di balik puncak gunung, mereka menyalakan cahaya keemasan untuk membantu anak-anak kelinci menemukan jalan pulang ke sarangnya.',
          'Namun di antara mereka semua, ada seekor kunang-kunang kecil bernama Nara yang malam itu tampak murung. Seharian hujan turun deras, dan saat Nara berusaha menolong seekor siput yang terjebak di genangan air, sayapnya basah kuyup sehingga pendar cahayanya mendadak redup hampir padam.',
          'Teman-temannya mencoba menyemangati Nara, tetapi ia merasa malu karena tidak lagi bisa menerangi jalan setapak. Kakek Jangkrik yang bijaksana lalu berbisik dari balik batu berlumut bahwa di puncak bukit terdapat Pohon Beringin Tua yang menyimpan embun cahaya bintang dari langit malam.',
          'Tanpa menunggu esok hari, Nara mengeringkan kedua sayapnya yang tipis dan bertekad mendaki bukit sebelum fajar menyingsing.',
        ],
      },
      {
        id: 'blf-2',
        number: 2,
        title: 'Sahabat di Tengah Kabut',
        readMinutes: 4,
        pullQuote:
          'Perjalanan mendaki bukit yang curam menjadi terasa separuh lebih ringan ketika ada sahabat yang berjalan di sampingmu.',
        paragraphs: [
          'Di tengah perjalanan mendaki jalan setapak yang dipenuhi akar pohon pakis, kabut malam turun menyelimuti lereng bukit. Nara sempat kehilangan arah sampai ia mendengar suara gemerisik lembut dari balik semak kayu manis. Rupanya itu adalah Lino, seekor landak kecil yang sedang membawa kendi daun berisi embun pagi.',
          'Tidak lama kemudian, hinggap pula Tara, seekor burung hantu muda yang selama ini pemalu karena suaranya sangat pelan. Melihat Nara kesulitan menembus kabut, Tara menawarkan penglihatan malamnya yang tajam, sementara Lino membagikan setetes embun manis untuk memulihkan tenaga Nara.',
          'Mereka bertiga berjalan bersama melewati jembatan bambu kecil di atas sungai yang bernyanyi. Sepanjang jalan, Nara menceritakan kisah-kisah indah tentang lembah di bawah sana, membuat Tara tidak lagi merasa canggung dan Lino tertawa gembira sepanjang tanjakan.',
          'Keberanian mereka saling melengkapi kekurangan masing-masing membuat kabut tebal terasa seperti selimut hangat alih-alih rintangan yang menakutkan.',
        ],
      },
      {
        id: 'blf-3',
        number: 3,
        title: 'Hadiah Pohon Beringin Tua',
        readMinutes: 4,
        pullQuote:
          'Ternyata cahaya itu tidak pernah hilang; ia hanya menunggu kita menemukan alasan baru untuk menyalakannya.',
        paragraphs: [
          'Ketika mereka bertiga akhirnya tiba di puncak bukit, Pohon Beringin Tua berdiri megah dengan akar gantungnya yang menyerupai tirai perak di bawah sinar bulan. Dari sela-sela daunnya, jutaan titik cahaya bintang memantul seperti butiran mutiara.',
          'Nara menghampiri sehelai daun beringin yang menampung embun bening. Namun sebelum ia sempat meminumnya, tiba-tiba terdengar suara tangis halus seekor anak rusa yang tersesat di balik batu besar dan takut melangkah dalam gelap.',
          'Tanpa ragu, Nara menyerahkan tetes embun bercahaya itu agar anak rusa dapat melihat jalan kembali ke induknya. Ajaibnya, tepat saat Nara mengutamakan keselamatan anak rusa itu, cahaya keemasan di tubuhnya sendiri kembali menyala terang, bahkan lebih hangat daripada sebelumnya.',
          'Malam itu, Pohon Beringin Tua tersenyum dalam desiran angin. Nara, Lino, dan Tara menuruni bukit bersama sambil menerangi jalan bagi seluruh penghuni lembah yang sedang pulang.',
        ],
      },
    ],
  },
  {
    id: 'surat-kota-hujan',
    accessionNumber: 'PA-2026-006',
    title: 'Surat-Surat dari Kota Hujan',
    subtitle: 'Antologi Epistolari tentang Perpustakaan Tua dan Kenangan',
    author: 'Nadia Kusuma',
    genre: BookGenre.SASTRA,
    year: 2023,
    pages: 196,
    totalReadMinutes: 14,
    language: 'Bahasa Indonesia',
    publisher: 'Pustaka Lembah Aksara',
    coverPalette: {
      bg: '#1E3A8A',
      accent: '#93C5FD',
      text: '#F8FAFC',
      border: '#1D4ED8',
    },
    synopsis:
      'Melalui dua belas pucuk surat yang ditemukan terselip di antara buku-buku tua di sebuah toko buku bekas di Bogor, dua orang sahabat pena dari generasi berbeda merangkai kisah tentang kehilangan, kesetiaan pada kata-kata, dan harapan.',
    chapters: [
      {
        id: 'skh-1',
        number: 1,
        title: 'Amplop di Halaman Seratus Dua Puluh',
        readMinutes: 5,
        pullQuote:
          'Buku bekas selalu menyimpan dua cerita: satu yang dicetak oleh penerbit, dan satu lagi yang ditinggalkan pembacanya di tepi halaman.',
        paragraphs: [
          'Hujan sore di Bogor turun tanpa aba-aba, memaksa Aruna berteduh di bawah kanopi hijau sebuah toko buku bekas di sudut jalan berbatu. Di dalam ruangan sempit yang harum oleh aroma kertas tua dan kayu kamper, ia mengambil sebuah antologi puisi terbitan tahun 1984 yang sampul linennya sudah mulai pudar.',
          'Ketika membuka halaman seratus dua puluh, selembar amplop berwarna gading jatuh perlahan ke lantai kayu. Di sudut kiri atas tertulis alamat pengirim di sebuah rumah berhalaman luas dekat kebun raya, bertanggal Oktober 1998, tanpa prangko karena agaknya surat itu tidak pernah benar-benar dikirim melalui pos.',
          'Dengan rasa ingin tahu yang bercampur segan, Aruna meminta izin kepada pemilik toko untuk membaca surat itu. Tinta birunya masih jelas, ditulis dengan tulisan tangan miring yang rapi dan penuh pertimbangan pada setiap jeda kalimat.',
          'Surat pertama itu berkisah tentang seorang mahasiswa botani yang sering menyalin catatan kuliah di bawah pohon damar sambil menunggu kereta sore menuju Jakarta—dan tentang janjinya untuk mengembalikan sebuah buku catatan yang tidak pernah sempat ditepati.',
        ],
      },
      {
        id: 'skh-2',
        number: 2,
        title: 'Balasan untuk Pembaca Masa Depan',
        readMinutes: 5,
        pullQuote:
          'Menulis surat di atas kertas adalah cara terbaik memperlambat rindu agar sempat menemukan kata yang tepat.',
        paragraphs: [
          'Sejak sore itu, Aruna mulai menelusuri rak-rak lain di toko buku yang sama. Ternyata bukan hanya satu amplop yang tersimpan di sana. Di dalam buku sejarah arsitektur kolonial dan kamus botani tua, ia menemukan tiga surat lanjutan yang saling terhubung seperti potongan mozaik.',
          'Rupanya kedua sahabat pena tersebut sepakat menitipkan surat balasan mereka di dalam buku-buku tertentu di toko buku itu sebagai permainan kecil di masa kuliah. Setiap kali salah seorang selesai membaca sebuah buku, ia menyelipkan surat baru untuk ditemukan oleh sahabatnya di minggu berikutnya.',
          'Membaca surat-surat itu membuat Aruna merasa seolah sedang duduk di tahun-tahun akhir abad kedua puluh, menyaksikan bagaimana dua anak muda berbicara tentang mimpi mendirikan perpustakaan keliling desa dengan keyakinan penuh.',
          'Di halaman terakhir buku ketiga, terdapat catatan pensil pendek bertuliskan alamat sebuah rumah baca kecil di pinggiran kota yang ternyata masih berdiri hingga hari ini.',
        ],
      },
      {
        id: 'skh-3',
        number: 3,
        title: 'Rumah Baca di Ujung Gang',
        readMinutes: 4,
        pullQuote:
          'Beberapa janji memang butuh waktu puluhan tahun untuk sampai ke alamatnya, namun tidak pernah sia-sia bila dijaga dengan tulus.',
        paragraphs: [
          'Akhir pekan berikutnya, Aruna membawa seluruh buku bersampul linen itu ke alamat yang tertera di catatan pensil. Di balik pagar tanaman teh-tehan yang rapi, berdirilah sebuah paviliun kayu sederhana dengan papan nama kecil bertuliskan Taman Bacaan Hujan.',
          'Seorang perempuan berambut perak yang sedang menyusun buku cerita anak di rak depan tersenyum menyambut kedatangan Aruna. Ketika Aruna menunjukkan amplop berwarna gading dari halaman seratus dua puluh, mata perempuan itu berbinar hangat mengenali tulisan tangan sahabat lamanya.',
          'Rupanya sahabatnya telah lama pindah ke luar pulau untuk mengajar di sekolah terpencil, namun rumah baca impian mereka berdua tetap terwujud dan kini dikunjungi puluhan anak sekolah setiap sore.',
          'Sebelum pulang, Aruna menitipkan selembar kartu pos kosong di dalam buku puisi itu—berharap dua puluh tahun lagi ada pembaca baru yang menemukan kembali kehangatan cerita yang sama.',
        ],
      },
    ],
  },
  {
    id: 'arsitektur-kayu-jawa',
    accessionNumber: 'PA-2026-007',
    title: 'Arsitektur Kayu di Tanah Jawa',
    subtitle: 'Kearifan Struktur Joglo, Pasak Tanpa Paku, dan Iklim Tropis',
    author: 'Larasati Nugroho',
    genre: BookGenre.SEJARAH,
    year: 2024,
    pages: 240,
    totalReadMinutes: 15,
    language: 'Bahasa Indonesia',
    publisher: 'Balai Kajian Tradisi',
    coverPalette: {
      bg: '#78350F',
      accent: '#FDE68A',
      text: '#FFFBEB',
      border: '#92400E',
    },
    synopsis:
      'Kajian arsitektur tradisional yang mengulas kecerdasan struktur rangka kayu jati rumah joglo dan limasan—bagaimana teknik sambungan purus dan pasak mampu meredam guncangan gempa bumi sekaligus menjaga kesejukan alami.',
    chapters: [
      {
        id: 'akj-1',
        number: 1,
        title: 'Pelajaran dari Soko Guru',
        readMinutes: 5,
        pullQuote:
          'Bangunan tradisional tidak melawan alam dengan beton kaku, melainkan menari bersama guncangan melalui kelenturan sambungan kayu.',
        paragraphs: [
          'Jika kita masuk ke dalam sebuah pendopo joglo berusia ratusan tahun, perhatian kita segera tertuju pada empat tiang utama di tengah ruangan yang disebut soko guru. Keempat tiang kayu jati kokoh tersebut menopang tumpang sari—susunan balok berundak yang mengerucut ke atas membentuk langit-langit yang megah.',
          'Secara rekayasa sipil modern, sistem rangka joglo merupakan contoh brilian dari struktur tahan gempa berbasis sendi lentur. Alih-alih mengunci balok menggunakan paku besi yang mudah mematahkan serat kayu saat terjadi getaran tektonik, para undagi (arsitek tradisional) menggunakan sistem purus-lubang dan pasak kayu.',
          'Ketika tanah bergetar, setiap sambungan memiliki ruang gerak mikroskopis yang menyerap energi kinetik gempa dan menyebarkannya secara merata ke seluruh rangka atap. Tiang-tiang soko guru pun tidak ditanam ke dalam tanah, melainkan bertumpu di atas batu umpak yang berfungsi sebagai peredam getar alami.',
          'Prinsip desain seperti ini membuktikan bahwa masyarakat Nusantara telah menguasai fisika bangunan tropis jauh sebelum istilah teknik gempa modern dirumuskan di perguruan tinggi.',
        ],
      },
      {
        id: 'akj-2',
        number: 2,
        title: 'Atap sebagai Penjaga Udara Sejuk',
        readMinutes: 5,
        pullQuote:
          'Kemiringan atap joglo bukan sekadar estetika siluet, melainkan mesin pendingin alami yang bekerja tanpa listrik.',
        paragraphs: [
          'Iklim tropis lembap menuntut bangunan mampu menghadapi dua hal ekstrem sekaligus: curah hujan lebat dan terik matahari sepanjang tahun. Bentuk atap limasan dan joglo yang menjulang tinggi di bagian tengah menciptakan volume udara besar di atas kepala penghuni.',
          'Udara panas yang masuk ke ruangan secara alami naik ke puncak atap, lalu keluar melalui celah-celah genteng tanah liat yang berpori serta ukiran angin-angin di dinding kayu. Sementara itu, tritisan atap yang lebar melindungi dinding kayu dan teras dari tampias hujan maupun sinar matahari langsung.',
          'Bahan genteng tanah liat dan kayu jati juga memiliki kapasitas penyimpanan panas yang jauh lebih rendah dibandingkan dinding bata beton. Begitu matahari terbenam, suhu di dalam rumah tradisional turun dengan cepat mengikuti kesejukan angin malam.',
          'Belajar dari arsitektur vernakular memberi inspirasi bagi arsitek masa kini untuk merancang hunian hemat energi yang selaras dengan iklim khatulistiwa.',
        ],
      },
      {
        id: 'akj-3',
        number: 3,
        title: 'Ukiran sebagai Bahasa Doa',
        readMinutes: 5,
        pullQuote:
          'Setiap guratan pahat pada balok kayu tidak pernah bersifat hiasan kosong; ia membawa pesan tentang harmoni hidup.',
        paragraphs: [
          'Ornamen sulur tumbuhan, bunga teratai, dan motif geometris pada tumpang sari bukan semata-mata pertunjukan keterampilan memahat. Dalam pandangan hidup Jawa, rumah adalah cerminan mikrokosmos yang menghubungkan manusia, alam sekitar, dan Sang Pencipta.',
          'Pemasangan struktur utama rumah bahkan diiringi pembacaan doa dan rasa syukur atas pohon-pohon jati yang telah tumbuh puluhan tahun untuk menjadi tempat bernaung keluarga. Kayu tua yang dipakai kembali dari bangunan leluhur dianggap membawa kesinambungan nilai antar generasi.',
          'Melestarikan rumah kayu tradisional bukan berarti membekukan masa lalu di museum, melainkan merawat kecerdasan ekologis agar tetap relevan bagi masa depan kota-kota kita.',
        ],
      },
    ],
  },
  {
    id: 'algoritma-nalar-manusia',
    accessionNumber: 'PA-2026-008',
    title: 'Algoritma dan Nalar Manusia',
    subtitle: 'Memahami Logika Komputasi dari Sempoa hingga Kecerdasan Mesin',
    author: 'Dimas Prasetyo',
    genre: BookGenre.SAINS,
    year: 2025,
    pages: 256,
    totalReadMinutes: 16,
    language: 'Bahasa Indonesia',
    publisher: 'Pustaka Informatika',
    coverPalette: {
      bg: '#0F766E',
      accent: '#99F6E4',
      text: '#F0FDFA',
      border: '#115E59',
    },
    synopsis:
      'Pengantar jernih dan bebas jargon mengenai bagaimana komputer berpikir dalam langkah-langkah logis, batas kemampuan mesin dibandingkan intuisi manusia, dan mengapa literasi komputasi menjadi bahasa baru abad ke-21.',
    chapters: [
      {
        id: 'anm-1',
        number: 1,
        title: 'Resep Masak dan Kelahiran Algoritma',
        readMinutes: 5,
        pullQuote:
          'Algoritma bukan milik eksklusif insinyur perangkat lunak; ia hadir setiap kali kita menyusun langkah teratur untuk memecahkan masalah.',
        paragraphs: [
          'Banyak orang langsung merasa gentar mendengar kata algoritma, membayangkan deretan rumus matematika rumit di layar hitam penuh angka. Padahal, konsep dasarnya sangat akrab dengan kehidupan sehari-hari. Ketika Anda mengikuti resep membuat nasi goreng—memanaskan minyak, menumis bawang, memasukkan telur, lalu mengaduk nasi—Anda sebenarnya sedang menjalankan sebuah algoritma.',
          'Istilah algoritma sendiri berasal dari nama ilmuwan Persia abad kesembilan, Muhammad ibn Musa al-Khwarizmi, yang karyanya memperkenalkan metode sistematis menyelesaikan persamaan angka. Inti dari algoritma adalah kejelasan instruksi: setiap langkah harus pasti, berurutan, dan memiliki titik berhenti yang jelas.',
          'Komputer modern pada dasarnya adalah mesin yang sangat patuh namun tidak memiliki akal sehat. Ia hanya dapat mengeksekusi jutaan instruksi sederhana seperti penjumlahan dan perbandingan dalam hitungan milidetik, selama manusia mampu menerjemahkan persoalan nyata menjadi langkah-langkah logis yang tepat.',
          'Memahami cara kerja algoritma melatih kita berpikir terstruktur: memecah masalah besar yang tampak mustahil menjadi bagian-bagian kecil yang dapat diselesaikan satu per satu.',
        ],
      },
      {
        id: 'anm-2',
        number: 2,
        title: 'Seni Mencari di Tumpukan Data',
        readMinutes: 6,
        pullQuote:
          'Cara Anda menyusun rak buku menentukan seberapa cepat Anda menemukan satu judul di tengah ribuan koleksi.',
        paragraphs: [
          'Bayangkan Anda berada di sebuah perpustakaan dengan satu juta buku yang diletakkan secara acak tanpa katalog. Untuk menemukan satu buku sejarah tertentu, Anda mungkin harus memeriksa satu per satu rak dari pintu masuk hingga ujung ruangan—sebuah cara yang dalam ilmu komputer disebut pencarian linear.',
          'Sekarang bayangkan jika seluruh buku tersebut sudah diurutkan berdasarkan abjad judulnya. Anda cukup membuka bagian tengah rak: jika judul yang dicari lebih awal secara abjad, Anda langsung mengabaikan separuh kanan ruangan. Dengan metode pencarian biner ini, satu buku di antara satu juta koleksi dapat ditemukan dalam paling banyak dua puluh langkah saja.',
          'Perbedaan antara satu juta langkah dan dua puluh langkah inilah yang membuat mesin pencari digital mampu menjawab pertanyaan kita dalam sekejap mata. Efisiensi bukan soal mempercepat prosesor semata, melainkan kecerdikan memilih struktur data yang rapi.',
          'Di dunia nyata pun prinsip yang sama berlaku: kerapian dalam mengatur informasi jauh lebih menentukan produktivitas dibandingkan sekadar bekerja lebih keras secara membabi buta.',
        ],
      },
      {
        id: 'anm-3',
        number: 3,
        title: 'Di Mana Mesin Berhenti dan Manusia Bermula',
        readMinutes: 5,
        pullQuote:
          'Mesin unggul dalam menemukan pola masa lalu, namun hanya manusia yang mampu mempertanyakan apakah pola itu adil bagi masa depan.',
        paragraphs: [
          'Perkembangan pembelajaran mesin memungkinkan komputer mengenali wajah, menerjemahkan bahasa, dan memprediksi cuaca dengan ketepatan mengagumkan. Namun di balik kecanggihan itu, sistem statistik tidak pernah benar-benar memahami makna penderitaan, keindahan puisi, atau dilema moral.',
          'Sebuah model komputasi bekerja dengan memproyeksikan probabilitas berdasarkan data historis yang pernah diberikan kepadanya. Apabila data masa lalu mengandung bias atau ketidakadilan, mesin justru berisiko memperbesar bias tersebut secara otomatis jika tidak diawasi dengan nalar kritis.',
          'Karena itu, masa depan teknologi membutuhkan kolaborasi erat antara ilmu teknik dan humaniora. Kita memerlukan generasi pembaca dan pembuat teknologi yang tidak hanya cakap menulis kode, tetapi juga memiliki kepekaan etika serta empati sosial.',
        ],
      },
    ],
  },
  {
    id: 'dialog-pohon-bodhi',
    accessionNumber: 'PA-2026-009',
    title: 'Dialog di Bawah Pohon Bodhi',
    subtitle: 'Kebijaksanaan Timur tentang Keseimbangan dan Jalan Tengah',
    author: 'Surya Mahendra',
    genre: BookGenre.FILSAFAT,
    year: 2023,
    pages: 172,
    totalReadMinutes: 13,
    language: 'Bahasa Indonesia',
    publisher: 'Pustaka Dharma Aksara',
    coverPalette: {
      bg: '#312E81',
      accent: '#C7D2FE',
      text: '#EEF2FF',
      border: '#3730A3',
    },
    synopsis:
      'Percakapan imajiner antara seorang pengembara muda dan seorang guru tua tentang arti jalan tengah, melepaskan keterikatan yang berlebihan, serta menjaga ketenangan hati di tengah perubahan hidup yang tak terhindarkan.',
    chapters: [
      {
        id: 'dpb-1',
        number: 1,
        title: 'Senar Kecapi yang Terlalu Kencang',
        readMinutes: 4,
        pullQuote:
          'Jika senar kecapi ditarik terlalu kencang ia akan putus; jika terlalu kendur ia tidak berbunyi. Harmoni lahir dari ketepatan nada.',
        paragraphs: [
          'Pada suatu senja yang tenang di halaman wihara tua, seorang pemuda bernama Sena datang menemui Guru Aryo dengan wajah letih. Selama bertahun-tahun Sena mengejar kesempurnaan dalam setiap pekerjaannya, memaksa dirinya bekerja hingga larut malam tanpa jeda karena takut dianggap gagal.',
          'Guru Aryo tidak langsung memberi nasihat panjang. Ia mengambil sebuah kecapi kayu tua, lalu memutar pasak senarnya hingga tegang sekali dan memetiknya. Bunyi yang keluar melengking tajam hingga nyaris putus. Kemudian ia mengendurkan senar itu sampai nyaris lepas, dan saat dipetik suaranya sumbang tak bernada.',
          'Barulah ketika senar disetel dengan ketegangan yang pas—tidak terlalu kaku dan tidak terlalu longgar—alunan nada yang jernih dan menenangkan bergema di bawah rindang daun bodhi.',
          'Begitulah jalan tengah dalam menjalani hidup: berusaha dengan sungguh-sungguh tanpa menyiksa jiwa, dan beristirahat tanpa kehilangan arah tujuan.',
        ],
      },
      {
        id: 'dpb-2',
        number: 2,
        title: 'Sungai yang Tak Pernah Sama',
        readMinutes: 5,
        pullQuote:
          'Penderitaan sering kali bukan berasal dari perubahan itu sendiri, melainkan dari keinginan kita memaksa sungai berhenti mengalir.',
        paragraphs: [
          'Keesokan paginya mereka berjalan menuju tepi sungai yang mengalir deras menuruni lembah berbatu. Sena mengeluhkan bagaimana banyak hal dalam hidupnya berubah terlalu cepat—sahabat masa kecil yang menjauh, pekerjaan yang berganti wajah, dan masa muda yang perlahan berlalu.',
          'Guru Aryo meminta Sena mencelupkan tangannya ke air sungai yang sejuk. Ia bertanya apakah air yang menyentuh jari Sena detik ini masih sama dengan air yang menyentuhnya satu tarikan napas lalu. Tentu saja tidak, karena air itu terus mengalir menuju muara.',
          'Segala sesuatu di alam semesta bersifat dinamis. Pohon menggugurkan daun tuanya agar tunas baru dapat tumbuh pada musim hujan berikutnya. Menolak perubahan sama artinya dengan menolak kehidupan itu sendiri.',
          'Dengan menerima sifat sementara dari suka maupun duka, kita belajar menikmati hari ini secara utuh tanpa terlalu takut kehilangan hari esok.',
        ],
      },
      {
        id: 'dpb-3',
        number: 3,
        title: 'Menyalakan Pelita Sendiri',
        readMinutes: 4,
        pullQuote:
          'Guru sejati tidak meminjamkan matanya kepadamu; ia hanya membantu membersihkan debu di cerminmu sendiri.',
        paragraphs: [
          'Sebelum Sena melanjutkan perjalanannya kembali ke kota, ia bertanya bekal apa yang paling penting untuk menghadapi dunia yang penuh ketidakpastian. Guru Aryo menunjuk sebuah pelita minyak kecil di serambi kayu.',
          'Jangan menggantungkan ketenangan batinmu pada pujian orang lain atau keadaan yang selalu berjalan sesuai rencana, pesan sang guru. Jadilah pelita bagi dirimu sendiri melalui kesadaran penuh dalam ucapan, perbuatan, dan niat baik setiap hari.',
          'Saat Sena melangkah keluar dari gerbang batu, langkahnya terasa jauh lebih ringan. Pohon bodhi di belakangnya tetap berdiri tenang, menyaksikan generasi demi generasi datang mencari jawaban yang sebenarnya sudah bersemayam di dalam diri mereka sendiri.',
        ],
      },
    ],
  },
  {
    id: 'seni-merawat-fokus',
    accessionNumber: 'PA-2026-010',
    title: 'Seni Merawat Fokus di Era Bising',
    subtitle: 'Panduan Praktis Kerja Mendalam dan Keseimbangan Digital',
    author: 'Karina Halim',
    genre: BookGenre.PENGEMBANGAN,
    year: 2025,
    pages: 210,
    totalReadMinutes: 16,
    language: 'Bahasa Indonesia',
    publisher: 'Akademi Karsa Mandiri',
    coverPalette: {
      bg: '#164E63',
      accent: '#A5F3FC',
      text: '#ECFEFF',
      border: '#155E75',
    },
    synopsis:
      'Buku panduan praktis yang memadukan temuan psikologi kognitif dan kebiasaan kerja kreatif untuk membantu pelajar, penulis, dan profesional menghasilkan karya bermutu tanpa kelelahan mental.',
    chapters: [
      {
        id: 'smf-1',
        number: 1,
        title: 'Mitos Multitugas yang Menguras Energi',
        readMinutes: 4,
        pullQuote:
          'Otak manusia tidak benar-benar melakukan banyak tugas sekaligus; ia hanya melompat cepat dari satu hal ke hal lain sambil membayar pajak konsentrasi.',
        paragraphs: [
          'Banyak pekerja modern merasa bangga ketika mampu membalas pesan singkat sembari mengikuti rapat daring dan menyunting laporan di layar yang sama. Kita mengira kemampuan berpindah-pindah ini adalah tanda kecerdasan produktif.',
          'Padahal penelitian ilmu saraf menunjukkan hal sebaliknya. Setiap kali kita mengalihkan perhatian dari satu tugas ke tugas lain, sebagian sisa perhatian kita masih tertinggal pada tugas sebelumnya—fenomena yang dikenal sebagai residu atensi. Akibatnya, kecepatan berpikir menurun drastis dan tingkat kesalahan meningkat.',
          'Solusi pertama untuk memulihkan ketajaman berpikir bukanlah membeli aplikasi manajemen tugas terbaru, melainkan menyederhanakan lingkungan kerja kita. Tutup tab peramban yang tidak berkaitan, matikan notifikasi non-darurat, dan beri izin diri Anda mengerjakan satu hal penting secara tuntas.',
          'Satu jam bekerja dalam konsentrasi penuh sering kali menghasilkan kemajuan lebih besar dibandingkan empat jam bekerja dalam keadaan terpecah-pecah.',
        ],
      },
      {
        id: 'smf-2',
        number: 2,
        title: 'Ritual Memulai Kerja Mendalam',
        readMinutes: 4,
        pullQuote:
          'Disiplin tidak selalu membutuhkan tekad baja; ia lebih sering lahir dari lingkungan dan ritual kecil yang konsisten.',
        paragraphs: [
          'Mengapa halaman kosong terasa begitu menakutkan bagi penulis, atau buku tebal terasa berat dibuka oleh mahasiswa? Karena otak kita secara alami enggan memulai pekerjaan yang menuntut energi kognitif tinggi tanpa kepastian batas waktu.',
          'Membangun ritual pembuka selama lima menit dapat mengurangi hambatan mental tersebut secara drastis. Misalnya, menyeduh secangkir teh hangat, merapikan meja kerja, menuliskan satu tujuan spesifik di secarik kertas, lalu menyalakan pengatur waktu selama empat puluh lima menit.',
          'Dengan menyepakati awal dan akhir sesi fokus secara jelas, pikiran kita tahu bahwa setelah waktu selesai akan ada masa istirahat yang sah. Konsistensi harian yang ringan jauh lebih berkelanjutan dibandingkan begadang semalam suntuk menjelang tenggat waktu.',
        ],
      },
      {
        id: 'smf-3',
        number: 3,
        title: 'Istirahat Berkualitas Tanpa Layar',
        readMinutes: 4,
        pullQuote:
          'Mengganti layar laptop dengan layar ponsel bukanlah waktu istirahat; otak Anda tetap memproses banjir informasi yang sama.',
        paragraphs: [
          'Salah satu kesalahan paling umum saat mengambil jeda kerja adalah langsung membuka media sosial selama lima belas menit. Alih-alih segar kembali, mata dan korteks visual otak justru semakin lelah dibanjiri video singkat serta perbandingan sosial.',
          'Istirahat yang benar-benar memulihkan daya cipta adalah aktivitas yang melibatkan gerak tubuh ringan dan pandangan jarak jauh: menatap pepohonan di luar jendela, meregangkan bahu, berjalan ke dapur mengambil air minum, atau memejamkan mata sejenak.',
          'Banyak gagasan paling cemerlang justru muncul di momen-momen tenang seperti saat mandi atau berjalan kaki santai, ketika jaringan mode bawaan otak bekerja menyambungkan potongan pengetahuan yang kita baca sebelumnya.',
        ],
      },
      {
        id: 'smf-4',
        number: 4,
        title: 'Membaca Panjang sebagai Latihan Kognitif',
        readMinutes: 4,
        pullQuote:
          'Membaca buku secara utuh adalah bentuk latihan kebugaran terbaik bagi daya nalar yang sabar.',
        paragraphs: [
          'Kebiasaan membaca paragraf panjang tanpa terburu-buru melatih kemampuan otak mengikuti alur argumen yang kompleks. Keterampilan ini sangat langka di tengah budaya cuplikan berita singkat berdurasi tiga puluh detik.',
          'Mulailah dengan target yang masuk akal, seperti membaca dua puluh menit setiap pagi sebelum menyentuh pesan kerja, atau satu bab sebelum tidur. Catat satu kalimat yang paling berkesan di buku catatan Anda untuk direnungkan keesokan harinya.',
          'Lama-kelamaan, fokus bukan lagi beban yang harus dipaksakan, melainkan ruang nyaman tempat Anda menikmati proses belajar sepanjang hayat.',
        ],
      },
    ],
  },
  {
    id: 'catatan-penulis-muda',
    accessionNumber: 'PA-2026-011',
    title: 'Catatan Perjalanan Penulis Muda',
    subtitle: 'Merangkai Cerita dari Pasar Pagi, Kereta Ekonomi, dan Kedai Kopi',
    author: 'Fajar Ramadhan',
    genre: BookGenre.PENGEMBANGAN,
    year: 2024,
    pages: 168,
    totalReadMinutes: 12,
    language: 'Bahasa Indonesia',
    publisher: 'Pustaka Kata Merdeka',
    coverPalette: {
      bg: '#4C1D95',
      accent: '#DDD6FE',
      text: '#F5F3FF',
      border: '#5B21B6',
    },
    synopsis:
      'Kumpulan esai ringan tentang seni mengamati kehidupan sehari-hari, menemukan karakter unik di ruang publik, dan mengubah catatan saku sederhana menjadi karya tulis yang hidup dan jujur.',
    chapters: [
      {
        id: 'cpm-1',
        number: 1,
        title: 'Buku Saku dan Pensil Tumpul',
        readMinutes: 4,
        pullQuote:
          'Ide cerita terbaik jarang datang saat kita duduk menatap layar kosong; ia menyapa ketika kita berjalan dengan mata terbuka.',
        paragraphs: [
          'Setiap penulis pemula hampir selalu bertanya dari mana harus mencari inspirasi yang luar biasa agar tulisannya layak dibaca. Pengalaman bertahun-tahun keliling antarkota justru mengajarkan saya jawaban sebaliknya: hal-hal paling menyentuh selalu bersembunyi di peristiwa paling biasa.',
          'Di gerbong kereta pagi yang penuh oleh pedagang sayur, pelajar mengantuk, dan pekerja kantor, terdapat puluhan drama manusia dalam bentuk gestur kecil. Cara seorang ibu menyisihkan kue untuk anaknya, atau percakapan dua pensiunan tentang kebun pisang mereka, menyimpan kejujuran emosi yang tidak bisa dibuat-buat.',
          'Membiasakan diri membawa buku saku kecil melatih kita menangkap detail sensorik sebelum menguap dari ingatan: suara peluit kondektur, aroma kopi tubruk di stasiun kecil, hingga warna langit seusai gerimis.',
        ],
      },
      {
        id: 'cpm-2',
        number: 2,
        title: 'Keberanian Menulis Draf Pertama yang Buruk',
        readMinutes: 4,
        pullQuote:
          'Tidak ada tulisan hebat yang langsung lahir sempurna pada ketukan pertama; semua karya bagus adalah hasil penyuntingan yang sabar.',
        paragraphs: [
          'Musuh terbesar dari ratusan naskah yang tidak pernah selesai adalah perfeksionisme prematur. Kita sering kali ingin kalimat pembuka langsung terdengar seindah karya sastrawan besar, sehingga baru menulis dua baris kita sudah menghapusnya kembali.',
          'Izinkan diri Anda menulis draf pertama dengan bebas tanpa menghakimi pilihan kata. Tugas draf pertama hanyalah menuangkan gagasan dari kepala ke atas kertas. Penyuntingan, pemangkasan kata mubazir, dan penghalusan irama kalimat adalah pekerjaan draf kedua dan ketiga.',
          'Ketika beban harus langsung sempurna dilepaskan, menulis kembali menjadi kegembiraan bercerita seperti saat kita berkirim cerita kepada sahabat karib.',
        ],
      },
      {
        id: 'cpm-3',
        number: 3,
        title: 'Menyunting dengan Telinga',
        readMinutes: 4,
        pullQuote:
          'Jika sebuah kalimat membuat napasmu tersendat saat dibaca lantang, pembaca pun akan tersandung di titik yang sama.',
        paragraphs: [
          'Teknik paling ampuh untuk menguji kejernihan sebuah esai atau cerpen adalah membacanya dengan suara lantang di ruang sepi. Telinga kita jauh lebih peka menangkap kalimat yang terlalu panjang, kata ulang yang membosankan, maupun perpindahan paragraf yang melompat.',
          'Potonglah kata sifat yang berlebihan jika kata kerjanya sudah cukup kuat menggambarkan tindakan. Biarkan pembaca merasakan suasana melalui gambaran konkret alih-alih diberi tahu harus merasa sedih atau gembira.',
          'Menulis pada akhirnya adalah jembatan sunyi antara satu jiwa dengan jiwa lainnya melintasi ruang dan waktu.',
        ],
      },
    ],
  },
  {
    id: 'kancil-penjaga-hutan',
    accessionNumber: 'PA-2026-012',
    title: 'Petualangan Kancil dan Penjaga Hutan',
    subtitle: 'Dongeng Kecerdikan, Kejujuran, dan Gotong Royong Rimba',
    author: 'Ibu Sekar Sari',
    genre: BookGenre.DONGENG,
    year: 2024,
    pages: 112,
    totalReadMinutes: 11,
    language: 'Bahasa Indonesia',
    publisher: 'Taman Cerita Anak',
    coverPalette: {
      bg: '#065F46',
      accent: '#A7F3D0',
      text: '#ECFDF5',
      border: '#047857',
    },
    synopsis:
      'Versi segar dongeng klasik Nusantara di mana Kancil belajar bahwa kecerdikan sejati bukanlah untuk mengakali teman, melainkan untuk bekerja sama menyelamatkan mata air hutan dari musim kemarau panjang.',
    chapters: [
      {
        id: 'kph-1',
        number: 1,
        title: 'Mata Air yang Menyusut',
        readMinutes: 4,
        pullQuote:
          'Kepandaian baru terasa manis apabila digunakan untuk menolong sesama, bukan sekadar membanggakan diri sendiri.',
        paragraphs: [
          'Musim kemarau tahun itu datang lebih awal dari biasanya di Hutan Rimba Damai. Sungai jernih tempat gajah, rusa, dan tapir biasa minum perlahan menyusut hingga menyisakan batu-batu sungai yang hangat oleh terik matahari.',
          'Kancil yang dikenal cerdik segera berlari menyusuri hulu sungai untuk mencari tahu mengapa aliran air mendadak mengecil. Ternyata sebuah batu besar yang runtuh akibat hujan lebat bulan lalu telah menyumbat celah mata air utama di balik tebing lumut.',
          'Kancil mencoba mendorong batu itu sekuat tenaga, tetapi tubuhnya yang kecil tentu tidak mampu menggesernya sedikit pun. Ia pun sadar bahwa kali ini akal cerdiknya harus digunakan untuk mengajak penghuni hutan bekerja bersama.',
        ],
      },
      {
        id: 'kph-2',
        number: 2,
        title: 'Rencana Jembatan Tuas Bambu',
        readMinutes: 4,
        pullQuote:
          'Batu seberat bukit sekalipun dapat digeser bila setiap tenaga diarahkan pada titik yang tepat secara serempak.',
        paragraphs: [
          'Kancil mengumpulkan Gajah yang kuat, Beruang Madu yang cekatan, serta keluarga Berang-Berang yang ahli memotong ranting dan batang bambu kering. Awalnya beberapa hewan ragu karena mereka pernah berselisih paham soal pembagian buah hutan.',
          'Dengan rendah hati, Kancil meminta maaf atas keisengannya di masa lalu dan menggambar rancangan tuas kayu sederhana di atas tanah pasir. Berang-Berang menyusun ganjalan batu di bawah batang pohon tumbang, sementara Gajah bersiap menekan ujung batang panjang tersebut.',
          'Dalam hitungan ketiga, seluruh penghuni hutan mendorong dan menarik bersama-sama. Perlahan namun pasti, batu penyumbat itu berderak, terangkat, lalu berguling ke sisi tebing yang aman.',
        ],
      },
      {
        id: 'kph-3',
        number: 3,
        title: 'Air Jernih Kembali Mengalir',
        readMinutes: 3,
        pullQuote:
          'Hutan yang lestari adalah rumah bersama yang hanya bisa dijaga dengan hati yang rukun.',
        paragraphs: [
          'Seketika itu juga, mata air pegunungan memancar deras dan bening mengisi kembali alur sungai yang sempat mengering. Sorak gembira burung-burung rangkong menggema dari puncak kanopi menyambut kembalinya kesejukan rimba.',
          'Sejak hari itu, Kancil tidak lagi dikenal hanya sebagai hewan yang lihai menghindar dari bahaya, melainkan sahabat yang selalu dipercaya menjaga kerukunan penghuni hutan.',
          'Mereka pun bersepakat menanam bibit pohon beringin dan bambu baru di sekitar hulu mata air agar cadangan air hutan tetap terjaga hingga anak cucu mereka kelak.',
        ],
      },
    ],
  },
];
