# harunkinik.com — Op. Dr. Abdullah Harun Kınık Kişisel Web Sitesi

Bu depo, `https://harunkinik.com` adresinde GitHub Pages üzerinden yayınlanan kişisel/akademik
web sitesinin kaynak kodunu içerir.

## 1. Kullanılan Teknoloji ve Neden Bu Yapı Seçildi

Site **sade HTML5, CSS3 ve bağımlılıksız (framework'süz) vanilla JavaScript** ile inşa edilmiştir.
Herhangi bir derleme (build) adımı, paket yöneticisi veya Node.js sunucusu **gerektirmez**.

**Neden Astro veya Next.js'e geçilmedi?**
Proje daha önce tek bir `index.html` dosyasından oluşuyordu — küçük, temiz ve bağımlılıksızdı.
Bu ölçekte bir siteyi bir framework'e taşımanın somut bir teknik faydası yoktur; aksine
build adımı, `node_modules`, sürüm uyumluluğu gibi yeni bakım yükleri getirir. Bu yüzden mevcut
statik yapı korunmuş, aynı prensiplerle (çerçevesiz, sade, hızlı) genişletilmiştir. Sonuç olarak:

- Build adımı yok → GitHub Pages'te "Deploy from a branch" ile doğrudan çalışır.
- `npm install` / derleme hatası riski yok.
- Sayfa başına birkaç KB CSS/JS; harici font, analytics veya reklam çağrısı yok.
- İçerik değişikliği yapmak için tek ihtiyacınız bir metin editörüdür.

İleride site büyür ve çok sayıda blog yazısı/çok dilli içerik yönetimi gerçek bir sorun haline
gelirse, mevcut HTML/CSS yapısı neredeyse değişiklik yapılmadan **Astro**'ya taşınabilir (Astro,
düz HTML/CSS'i doğrudan kabul eder). Bugün için buna gerek yoktur.

## 2. Klasör Yapısı

```
/
├── index.html                  Ana sayfa
├── hakkimda.html
├── ilgi-alanlari.html
├── akademik-calismalar.html     Araştırma alanları + Yayınlar bölümü
├── medya.html
├── bilgilendirme.html          Blog listesi
├── bilgilendirme/              Blog yazıları (her biri ayrı .html)
│   ├── hipospadias-nedir.html
│   ├── inmemis-testis.html
│   ├── sunnet-icin-dogru-zaman.html
│   ├── idrar-yolu-enfeksiyonu.html
│   ├── robotik-cerrahi-nedir.html
│   └── bobrek-tasi-tedavisi.html
├── iletisim.html
├── gizlilik.html / kvkk.html / cerez-politikasi.html
├── 404.html
├── assets/
│   ├── css/style.css           Tüm tasarım sistemi (tek dosya)
│   └── js/
│       ├── main.js             Nav, koyu mod, filtreler, lightbox, form vb.
│       └── config.js           Formspree endpoint yapılandırması
├── images/
│   ├── profile/  clinical/  research/  media/  blog/  seo/
├── favicon.svg, site.webmanifest, robots.txt, sitemap.xml, CNAME
```

Her HTML dosyası kendi başına bağımsızdır (navbar/footer her sayfada tekrar eder). Bunun nedeni
partial/include sistemi olmayan sade bir statik sitede paylaşılan şablon mekanizması bulunmamasıdır.
**Yeni bir menü öğesi eklerken tüm `.html` dosyalarındaki `<nav class="nav-links">` ve
`.mobile-menu-links` bloklarını güncellemeniz gerekir.**

## 3. Yerel Geliştirme

Bu site build gerektirmediği için "kurulum" tek bir adımdır: bir statik dosya sunucusu başlatmak.

> Neden `index.html`'i çift tıklayıp doğrudan tarayıcıda açmamalısınız? Site `/assets/...` gibi
> **kök-göreli (root-relative)** yollar kullanır. Bunlar `https://harunkinik.com/...` üzerinde
> sorunsuz çalışır, ama `file://` ile açtığınızda tarayıcı bunları diskin kökü sanır ve CSS/JS
> yüklenmez. Bu yüzden yerelde her zaman bir sunucu üzerinden önizleyin.

```bash
cd "Web Sitem"
python3 -m http.server 4173
```

Ardından tarayıcıda `http://localhost:4173` adresini açın.

## 4. Production Build

Yoktur — statik dosyalar zaten "production-ready"dir. Değişiklik yapıp commit/push etmeniz yeterlidir.

## 5. GitHub Repository ve Pages Ayarları

- Repo: `github.com/harunkinik/harunkinik.github.io` (kullanıcı sayfası reposu)
- Varsayılan dal: `main`
- GitHub Pages kaynağı: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/` (root)**
- Bu proje **statik olduğu için GitHub Actions workflow'u yoktur ve gerekmez.** Actions eklemek
  (build adımı olmadığı için) yalnızca gereksiz karmaşıklık ve gecikme ekler. `main` dalına yapılan
  her push, GitHub Pages tarafından birkaç saniye içinde otomatik yayınlanır.

## 6. Özel Alan Adı (harunkinik.com)

- `CNAME` dosyası kökte bulunur ve içeriği `harunkinik.com`'dur — **silmeyin**.
- GitHub → repo → **Settings → Pages → Custom domain** alanında `harunkinik.com` yazılı olmalı.
- Tüm asset yolları (`/assets/...`, `/images/...`) **kök-göreli**dir; herhangi bir repository
  base path (`/harunkinik.github.io/...` gibi) **kullanılmamıştır** — bu sayede özel alan adının
  kökünde sorunsuz çalışır.

### Cloudflare DNS Ayarları

Bu domainin isim sunucuları (nameserver) Cloudflare'e bağlıdır. Kayıtlar **Cloudflare Dashboard →
DNS** üzerinden yönetilir:

| Tür | Ad | İçerik | Proxy Durumu |
|---|---|---|---|
| A | @ | 185.199.108.153 | DNS only (gri bulut) |
| A | @ | 185.199.109.153 | DNS only |
| A | @ | 185.199.110.153 | DNS only |
| A | @ | 185.199.111.153 | DNS only |
| CNAME | www | harunkinik.github.io | DNS only |

> Cloudflare proxy'si (turuncu bulut) açıkken GitHub, domaini doğrudan göremediği için SSL
> sertifikası çıkaramaz. Sertifika alındıktan ve "Enforce HTTPS" aktif olduktan sonra isterseniz
> tekrar proxy'yi açabilirsiniz.

### HTTPS Etkinleştirme

1. DNS kayıtları doğru ayarlandıktan sonra GitHub birkaç dakika – birkaç saat içinde otomatik
   olarak bir Let's Encrypt sertifikası çıkarır.
2. GitHub → **Settings → Pages**'te **"Enforce HTTPS"** kutucuğu tıklanabilir hale geldiğinde işaretleyin.

## 7. İçerik Nasıl Güncellenir?

### Profil bilgileri (isim, unvan, biyografi)
`index.html` (hero bölümü) ve `hakkimda.html` (biyografi metni) içinde ilgili `<h1>`/`<p>` etiketlerini düzenleyin.

### Fotoğraf Ekleme
Şu an tüm görseller **soyut, nötr SVG placeholder'lardır** (gerçek fotoğraf değildir). Gerçek bir
fotoğraf eklemek için:
1. Fotoğrafı `images/<klasör>/` altına uygun isimle koyun (aşağıdaki tabloya bakın).
2. İlgili HTML dosyasındaki `<img src="...svg">` yolunu yeni dosyanıza (`.jpg`/`.webp`) güncelleyin.
3. `alt` metnini gerçek görseli tanımlayacak şekilde güncelleyin.

| Dosya | Önerilen Oran | Min. Çözünürlük | Kullanıldığı Yer |
|---|---|---|---|
| `images/profile/harun-kinik-portrait.svg` | 4:5 (dikey) | 1200×1500 | Ana sayfa hero |
| `images/profile/harun-kinik-secondary.svg` | 4:3 | 1200×900 | Hakkımda sayfası |
| `images/clinical/pediatric-urology.svg` | 5:4 | 1200×960 | İlgi Alanları — Çocuk Ürolojisi |
| `images/clinical/robotic-urology.svg` | 5:4 | 1200×960 | İlgi Alanları — Robotik Üroloji |
| `images/clinical/reconstructive-urology.svg` | 5:4 | 1200×960 | İlgi Alanları — Rekonstrüktif Üroloji |
| `images/clinical/endourology.svg` | 5:4 | 1200×960 | İlgi Alanları — Endoüroloji |
| `images/robotic-urology-feature.svg` | 2:1 (geniş) | 1920×960 | Ana sayfa — Robotik cerrahi bölümü |
| `images/research/featured-project.svg` | 4:3 | 1200×900 | Akademik Çalışmalar — Öne çıkan proje |
| `images/media/*.svg` | çeşitli (masonry) | min. 800px genişlik | Medya galerisi |
| `images/blog/*.svg` | 16:10 | 1200×750 | Bilgilendirme kapak görselleri |
| `images/seo/og-image.jpg` | 1200×630 | 1200×630 | Open Graph / sosyal medya paylaşım görseli (WhatsApp, LinkedIn, X). SVG kullanmayın — çoğu platform SVG önizlemesini göstermez. |

### Yayın (Publication) Ekleme
`akademik-calismalar.html` içindeki **Yayınlar** bölümünde (`id="yayinlar"`), `<!-- YAYIN: ... -->`
yorumuyla işaretli bir `<article class="pub-card">` bloğunu kopyalayıp bilgileri güncelleyin.
**Gerçek DOI/PubMed linkiniz yoksa o alanı `aria-disabled="true"` ile "eklenecek" olarak
bırakın — sahte link eklemeyin.**

### Blog Yazısı Ekleme
1. `bilgilendirme/` klasöründeki mevcut bir `.html` dosyasını kopyalayın.
2. Başlık, tarih, kategori, kapak görseli ve içerik (`<h2>`/`<p>`) alanlarını güncelleyin.
3. `bilgilendirme.html` içindeki blog kartları grid'ine yeni bir `<article class="blog-card">`
   kartı ekleyin (`data-category` ve `data-search` niteliklerini doğru doldurun).
4. `sitemap.xml`'e yeni sayfanın URL'sini ekleyin.

### Galeriye Görsel Ekleme
`medya.html` içindeki `.gallery-grid` bloğuna yeni bir `<figure class="gallery-item">` ekleyin;
`data-category`, `data-gallery-full`, `data-gallery-alt`, `data-gallery-caption` niteliklerini doldurun.

### Sosyal Bağlantı Güncelleme
Şu an LinkedIn, Instagram, Google Scholar, ORCID, ResearchGate, GitHub bağlantıları **henüz
sağlanmadığı için `href="#"` olarak bırakılmıştır** (sahte URL eklenmemiştir). Gerçek bağlantılarınız
hazır olduğunda şu dosyalardaki ilgili `<a>` etiketlerini güncelleyin: `hakkimda.html`,
`iletisim.html` ve her sayfanın footer'ındaki `.footer-social` bloğu.

### Formspree Yapılandırma (İletişim Formu)
İletişim formu, güvenlik amacıyla **varsayılan olarak devre dışıdır** (submit butonu pasif,
bir geliştirici notu gösterilir). Aktifleştirmek için:
1. [formspree.io](https://formspree.io) üzerinden ücretsiz bir hesap ve form oluşturun.
2. `assets/js/config.js` dosyasındaki `formspreeEndpoint` değerini kendi form adresinizle değiştirin.
3. `iletisim.html` içindeki `<form ... action="...">` alanındaki URL'yi de aynı adresle güncelleyin.

### Yeni Sayfa Ekleme
Mevcut bir `.html` dosyasını (örn. `hakkimda.html`) kopyalayın, `<title>`, `meta description`,
`canonical` ve `<main>` içeriğini güncelleyin; nav/footer bloklarını olduğu gibi bırakın. Yeni
sayfayı tüm diğer sayfaların nav/mobile-menu listelerine ve `sitemap.xml`'e ekleyin.

### Koyu Mod Sistemi
Koyu mod, `assets/css/style.css` içindeki CSS değişkenleri (`:root[data-theme="dark"]`) ile
yönetilir; kullanıcı tercihi `localStorage` içinde saklanır ve sayfa yüklenirken `<head>`
içindeki küçük satır-içi script ile yanıp sönmeden (flash olmadan) uygulanır. Yeni bir renk
eklerken CSS değişkeni tanımlayın, ham renk kodu yazmayın.

### Placeholder İçeriklerin Değiştirilmesi
Aşağıdaki listede "Henüz Sağlamanız Gerekenler" bölümüne bakın — tüm taslak/örnek içerikler
`[Örnek]`, "eklenecek" veya "taslak" ifadeleriyle açıkça işaretlenmiştir.

## 8. Erişilebilirlik ve Performans Notları

- Skip-to-content bağlantısı, `aria-label`'lar, klavye ile kullanılabilir lightbox ve mobil menü mevcuttur.
- `prefers-reduced-motion` tercihine tüm animasyonlar (`reveal`, marquee, scroll göstergesi) saygı gösterir.
- Harici font, analytics veya reklam script'i **yoktur** — sistem fontu kullanılır, bu da ekstra ağ
  isteği olmadan hızlı yükleme ve güçlü Türkçe karakter desteği sağlar.
- Tüm görseller `loading="lazy"` (hero hariç) ile yüklenir; SVG placeholder'lar dosya boyutu
  açısından çok hafiftir.

## 9. Henüz Sağlamanız Gereken Fotoğraflar

- Ana portre fotoğrafı (`images/profile/harun-kinik-portrait.svg` yerine)
- İkincil akademik/klinik fotoğraf (`images/profile/harun-kinik-secondary.svg` yerine)
- Klinik ilgi alanları için 4 görsel (`images/clinical/*.svg` yerine)
- Robotik cerrahi bölümü için geniş görsel
- Öne çıkan araştırma projesi görseli
- Medya galerisi için gerçek kongre/eğitim/ameliyathane fotoğrafları
- Blog yazıları için kapak görselleri

## 10. Henüz Sağlamanız Gereken Kişisel Bilgiler ve Bağlantılar

- Telefon numarası
- Instagram, LinkedIn, Google Scholar, ORCID, ResearchGate, GitHub bağlantıları
- Hastane/klinik adı ve adresi
- Google Maps konum bilgisi
- Gerçek yayınlar (başlık, yazarlar, dergi, yıl, DOI, PubMed linki)
- Gerçek akademik proje/araştırma detayları
- Formspree form endpoint'i (iletişim formunu aktifleştirmek için)

## 11. Placeholder Olarak Bırakılan İçerikler

- Akademik Çalışmalar sayfasındaki Yayınlar bölümünde 3 örnek yayın kartı (`[Örnek]` etiketli, sahte DOI/PubMed içermez)
- Akademik Çalışmalar sayfasındaki "Öne Çıkan Proje" kutusu (açıkça "örnek/taslak yapı" olarak işaretli)
- 6 adet bilgilendirme yazısı (genel/güvenli eğitici metinler; her birinin altında "taslak, hekim
  onayı gerektirir" notu bulunur)
- Tüm görseller (soyut SVG placeholder'lar)
- Akademik bağlantı etiketleri ("Google Scholar — yakında" vb.)

## 12. Doğrulama Sonuçları

Bu proje bir derleme/lint/TypeScript sistemi kullanmadığından (statik HTML/CSS/JS), aşağıdaki
manuel kontroller yapılmıştır:

- ✅ Tüm sayfalar yerel statik sunucu üzerinden `200 OK` döndürüyor (21 sayfa + statik dosyalar test edildi)
- ✅ Tüm `href`/`src` referansları diskteki gerçek dosyalarla eşleşiyor (kırık link/görsel yok)
- ✅ Konsol hatası yok (ana sayfa, medya, yayınlar, iletişim sayfalarında test edildi)
- ✅ Koyu mod doğru şekilde uygulanıyor ve kalıcı (localStorage)
- ✅ Mobil menü (390px genişlik) açılıyor, klavye/ESC ile kapanıyor
- ✅ Medya galerisi filtresi, lightbox (ok tuşları + ESC) çalışıyor
- ✅ Yayın filtresi ve özet aç/kapa çalışıyor
- ✅ İletişim formu, Formspree yapılandırılmadığı sürece güvenli şekilde devre dışı
- ✅ 375px–1440px arası genişliklerde yatay taşma tespit edilmedi
- ✅ Kullanıcıya görünen metinlerde İngilizce placeholder aranmadı, bulunmadı
- ✅ `CNAME` dosyası `harunkinik.com` içeriyor, kök-göreli asset yolları doğrulandı
- ✅ 404.html mevcut ve site tasarımıyla tutarlı

---

Sorularınız için: `hrnknk@gmail.com`
