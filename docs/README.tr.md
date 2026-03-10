# CC-Viewer

Claude Code istek izleme sistemi. Claude Code'un tüm API istek ve yanıtlarını gerçek zamanlı olarak yakalar ve görselleştirir (orijinal metin, kırpılmamış). Geliştiricilerin kendi Context'lerini izlemesine olanak tanır; böylece Vibe Coding sürecinde geri dönüp sorunları inceleyebilirsiniz.
CC-Viewer'ın en son sürümü ayrıca sunucu tabanlı web geliştirme çözümleri ve mobil programlama araçları sunar. Projelerinizde kullanmanızı bekliyoruz; gelecekte daha fazla eklenti desteği ve bulut dağıtımı da planlanmaktadır.

[English](../README.md) | [简体中文](./README.zh.md) | [繁體中文](./README.zh-TW.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [Deutsch](./README.de.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Italiano](./README.it.md) | [Dansk](./README.da.md) | [Polski](./README.pl.md) | [Русский](./README.ru.md) | [العربية](./README.ar.md) | [Norsk](./README.no.md) | [Português (Brasil)](./README.pt-BR.md) | [ไทย](./README.th.md) | Türkçe | [Українська](./README.uk.md)

## Kullanım

### Kurulum

```bash
npm install -g cc-viewer --registry=https://registry.npmjs.org
```

### İzleme Modu (Bu modda claude veya claude --dangerously-skip-permissions başlatıldığında, istekleri kaydetmek için otomatik olarak bir günlük süreci başlatılır)

```bash
ccv
```

### Programlama Modu

== claude

```bash
ccv -c
```

== claude --dangerously-skip-permissions

```bash
ccv -d
```

Programlama modu başlatıldıktan sonra web sayfası otomatik olarak açılır.

Web sayfasında doğrudan Claude'u kullanabilir, aynı zamanda tam istek mesajlarını görüntüleyebilir ve kod değişikliklerini inceleyebilirsiniz.

Daha da heyecan verici olanı, mobil cihazınızdan bile programlama yapabilirsiniz!

Bu komut, yerel Claude Code kurulum yöntemini (NPM veya Native Install) otomatik olarak algılar ve uyum sağlar.

- **NPM Kurulumu**: Claude Code'un `cli.js` dosyasına otomatik olarak yakalama betiği enjekte eder.
- **Native Kurulum**: `claude` ikili dosyasını otomatik olarak algılar, yerel şeffaf proxy yapılandırır ve Zsh Shell Hook ile trafiği otomatik yönlendirir.
- Bu proje için Claude Code'un npm ile kurulması önerilir.

### Yapılandırma Geçersiz Kılma (Configuration Override)

Özel bir API uç noktası kullanmanız gerekiyorsa (örneğin kurumsal proxy), `~/.claude/settings.json` dosyasında yapılandırın veya `ANTHROPIC_BASE_URL` ortam değişkenini ayarlayın. `ccv` bunu otomatik olarak algılar ve istekleri doğru şekilde yönlendirir.

### Sessiz Mod (Silent Mode)

Varsayılan olarak `ccv`, `claude`'u sararken sessiz modda çalışır ve terminal çıktınızın temiz kalmasını sağlar; yerel deneyimle tutarlıdır. Tüm günlükler arka planda yakalanır ve `http://localhost:7008` adresinden görüntülenebilir.

Yapılandırma tamamlandıktan sonra `claude` komutunu normal şekilde kullanabilirsiniz. İzleme arayüzünü görüntülemek için `http://localhost:7008` adresini ziyaret edin.

### Sorun Giderme (Troubleshooting)

Başlatma sorunlarıyla karşılaşırsanız, nihai bir çözüm yöntemi vardır:
Birinci adım: Herhangi bir dizinde Claude Code'u açın;
İkinci adım: Claude Code'a şu talimatı verin:
```
cc-viewer npm paketini kurdum ancak ccv çalıştırdıktan sonra düzgün çalışmıyor. cc-viewer'ın cli.js ve findcc.js dosyalarını incele, mevcut ortama göre yerel Claude Code dağıtım yöntemine uyum sağla. Uyarlama sırasında değişiklikleri mümkün olduğunca findcc.js ile sınırlı tut.
```
Claude Code'un hatayı kendi başına kontrol etmesi, herhangi birine danışmaktan veya herhangi bir belgeyi okumaktan çok daha etkilidir!

Yukarıdaki talimat tamamlandıktan sonra findcc.js güncellenecektir. Projeniz sık sık yerel dağıtım gerektiriyorsa veya fork edilmiş kodda kurulum sorunlarını sık sık çözmeniz gerekiyorsa, bu dosyayı saklayın. Bir dahaki sefere doğrudan kopyalayabilirsiniz. Şu anda birçok proje ve şirket Claude Code'u Mac üzerinde değil, sunucu tarafında barındırarak kullanmaktadır; bu nedenle yazar, cc-viewer kaynak kodu güncellemelerinin takibini kolaylaştırmak için findcc.js dosyasını ayırmıştır.

### Kaldırma

```bash
ccv --uninstall
```

### Sürüm Kontrolü

```bash
ccv -v
```

## Özellikler

### İstek İzleme (Orijinal Metin Modu)
<img width="1500" height="720" alt="image" src="https://github.com/user-attachments/assets/519dd496-68bd-4e76-84d7-2a3d14ae3f61" />

- Claude Code'un gönderdiği tüm API isteklerini gerçek zamanlı olarak yakalar; kırpılmış günlükler değil, orijinal metin olduğundan emin olur (bu çok önemli!!!)
- Main Agent ve Sub Agent isteklerini otomatik olarak tanır ve etiketler (alt türler: Plan, Search, Bash)
- MainAgent istekleri için Body Diff JSON desteği; önceki MainAgent isteğiyle farkları katlanmış şekilde gösterir (yalnızca değişen/yeni alanlar)
- Her istekte satır içi Token kullanım istatistikleri (giriş/çıkış Token, önbellek oluşturma/okuma, isabet oranı)
- Claude Code Router (CCR) ve diğer proxy senaryolarıyla uyumlu — API yol deseni eşleştirmesiyle istekleri yakalar

### Sohbet Modu

Sağ üst köşedeki "Sohbet Modu" düğmesine tıklayarak Main Agent'ın tam sohbet geçmişini sohbet arayüzüne dönüştürün:
<img width="1500" height="730" alt="image" src="https://github.com/user-attachments/assets/c973f142-748b-403f-b2b7-31a5d81e33e6" />

- Agent Team görüntüleme henüz desteklenmiyor
- Kullanıcı mesajları sağa hizalı (mavi balon), Main Agent yanıtları sola hizalı (koyu balon)
- `thinking` blokları varsayılan olarak katlanmış, Markdown olarak işlenir; düşünce sürecini görmek için tıklayarak açın; tek tıkla çeviri desteği (henüz kararlı değil)
- Kullanıcı seçim mesajları (AskUserQuestion) soru-cevap formatında gösterilir
- Çift yönlü mod senkronizasyonu: Sohbet moduna geçildiğinde seçili isteğe karşılık gelen sohbete otomatik konumlanır; orijinal metin moduna geri dönüldüğünde seçili isteğe otomatik konumlanır
- Ayarlar paneli: Araç sonuçları ve düşünce bloklarının varsayılan katlanma durumunu değiştirebilirsiniz
- Mobil sohbet görüntüleme: Mobil CLI modunda üst çubuktaki "Sohbet Görüntüleme" düğmesine tıklayarak salt okunur sohbet görünümünü açabilir ve mobilde tam sohbet geçmişine göz atabilirsiniz

### Programlama Modu

ccv -c veya ccv -d ile başlattıktan sonra şunu göreceksiniz:
<img width="1500" height="725" alt="image" src="https://github.com/user-attachments/assets/a64a381e-5a68-430c-b594-6d57dc01f4d3" />

Düzenleme tamamlandıktan sonra doğrudan kod diff'ini görüntüleyebilirsiniz:
<img width="1500" height="728" alt="image" src="https://github.com/user-attachments/assets/2a4acdaa-fc5f-4dc0-9e5f-f3273f0849b2" />

Dosyaları açıp manuel olarak kod yazabilirsiniz, ancak bu önerilmez — o eski usul programlama!

### Mobil Programlama

QR kodu tarayarak mobil cihazınızda programlama bile yapabilirsiniz:
<img width="3018" height="1460" alt="image" src="https://github.com/user-attachments/assets/8debf48e-daec-420c-b37a-609f8b81cd20" />

Mobil cihazda şunları görebilirsiniz:
<img width="1700" height="790" alt="image" src="https://github.com/user-attachments/assets/da3e519f-ff66-4cd2-81d1-f4e131215f6c" />

Mobil programlama hayalinizi gerçekleştirir.

### İstatistik Araçları

Header alanındaki "Veri İstatistikleri" kayan paneli:
<img width="1500" height="729" alt="image" src="https://github.com/user-attachments/assets/b23f9a81-fc3d-4937-9700-e70d84e4e5ce" />

- Önbellek oluşturma/okuma sayısını ve önbellek isabet oranını gösterir
- Önbellek yeniden oluşturma istatistikleri: nedene göre gruplandırılmış (TTL, sistem/araçlar/model değişikliği, mesaj kesme/değiştirme, anahtar değişikliği) sayı ve cache_creation token'larını gösterir
- Araç kullanım istatistikleri: her aracın çağrı sıklığını çağrı sayısına göre sıralı olarak gösterir
- Skill kullanım istatistikleri: her Skill'in çağrı sıklığını çağrı sayısına göre sıralı olarak gösterir
- Kavram yardımı (?) simgesi: tıklandığında MainAgent, CacheRebuild ve çeşitli araçlar için yerleşik belgeleri görüntüler

### Günlük Yönetimi

Sol üst köşedeki CC-Viewer açılır menüsü aracılığıyla:
<img width="1200" height="672" alt="image" src="https://github.com/user-attachments/assets/8cf24f5b-9450-4790-b781-0cd074cd3b39" />

- Yerel günlükleri içe aktar: projeye göre gruplandırılmış geçmiş günlük dosyalarına göz at, yeni pencerede aç
- Yerel JSONL dosyası yükle: doğrudan yerel bir `.jsonl` dosyası seçerek görüntüle (500MB'a kadar desteklenir)
- Mevcut günlüğü farklı kaydet: mevcut izleme JSONL günlük dosyasını indir
- Günlükleri birleştir: birden fazla JSONL günlük dosyasını birleşik analiz için tek bir oturumda birleştir
- Kullanıcı Prompt'larını görüntüle: tüm kullanıcı girdilerini çıkar ve görüntüle, üç görüntüleme modunu destekler — Ham mod (orijinal içerik), Bağlam modu (sistem etiketleri daraltılabilir), Metin modu (düz metin); eğik çizgi komutları (`/model`, `/context` vb.) bağımsız girişler olarak gösterilir; komutla ilgili etiketler Prompt içeriğinden otomatik olarak gizlenir
- Prompt'ları TXT olarak dışa aktar: kullanıcı Prompt'larını (düz metin, sistem etiketleri hariç) yerel bir `.txt` dosyasına aktar

### Çoklu Dil Desteği

CC-Viewer 18 dili destekler ve sistem yerel ayarına göre otomatik olarak geçiş yapar:

简体中文 | English | 繁體中文 | 한국어 | Deutsch | Español | Français | Italiano | Dansk | 日本語 | Polski | Русский | العربية | Norsk | Português (Brasil) | ไทย | Türkçe | Українська

### Otomatik Güncelleme

CC-Viewer başlatıldığında otomatik olarak güncelleme kontrolü yapar (en fazla 4 saatte bir). Aynı ana sürüm içinde (örneğin 1.x.x → 1.y.z) otomatik güncellenir ve bir sonraki başlatmada geçerli olur. Ana sürümler arası geçişlerde yalnızca bildirim gösterilir.

Otomatik güncelleme, Claude Code genel yapılandırmasını (`~/.claude/settings.json`) takip eder. Claude Code otomatik güncellemeyi devre dışı bıraktıysa (`autoUpdates: false`), CC-Viewer de otomatik güncellemeyi atlar.

## License

MIT
