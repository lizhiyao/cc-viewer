# CC-Viewer

15+ yıllık internet endüstrisi Ar-Ge deneyiminden damıtılmış, Claude Code üzerine inşa edilmiş bir Vibe Coding araç seti:

1. /ultraPlan ve /ultraReview'u yerel olarak çalıştırın, böylece kodunuzun Claude'un bulutuna tamamen ifşa edilmesi gerekmez;
2. Yerel ağınız üzerinden mobil programlamayı mümkün kılar (kullanıcı tarafından genişletilebilir);
3. Tam Claude Code payload yakalama ve analizi — günlükleme, hata ayıklama, öğrenme ve tersine mühendislik için harika;
4. Birikmiş çalışma notları ve uygulamalı deneyimle birlikte gelir (uygulama genelinde "?" simgelerine bakın), böylece birlikte keşfedip büyüyebiliriz;
5. Web kullanıcı arayüzü her boyut moduna uyum sağlar — tarayıcı uzantılarına, işletim sistemi bölünmüş görünümlerine ve herhangi bir gömme senaryosuna bırakın; yerel bir yükleyici de mevcuttur.

[English](../README.md) | [简体中文](./README.zh.md) | [繁體中文](./README.zh-TW.md) | [한국어](./README.ko.md) | [日本語](./README.ja.md) | [Deutsch](./README.de.md) | [Español](./README.es.md) | [Français](./README.fr.md) | [Italiano](./README.it.md) | [Dansk](./README.da.md) | [Polski](./README.pl.md) | [Русский](./README.ru.md) | [العربية](./README.ar.md) | [Norsk](./README.no.md) | [Português (Brasil)](./README.pt-BR.md) | [ไทย](./README.th.md) | Türkçe | [Українська](./README.uk.md)

## Kullanım

### Kurulum

```bash
npm install -g cc-viewer --registry=https://registry.npmjs.org
```

### Programlama Modu

ccv, claude için doğrudan bir yedek — Web Viewer başlatılırken tüm argümanlar claude'a aktarılır.

```bash
ccv                    # == claude (interactive mode)
ccv -c                 # == claude --continue (continue last conversation)
ccv -r                 # == claude --resume (resume a conversation)
ccv -p "hello"         # == claude --print "hello" (print mode)
ccv --d                # == claude --dangerously-skip-permissions (shortcut)
ccv --model opus       # == claude --model opus
```

Yazarın en çok kullandığı komut:
```
ccv -c --d             # == claude --continue --dangerously-skip-permissions
```

Programlama modunda başlatıldıktan sonra bir web sayfası otomatik olarak açılacaktır.

CC-Viewer ayrıca yerel bir masaüstü uygulaması olarak da gönderilir — platformunuz için derlemeyi GitHub'dan alın.
[İndirme sayfası](https://github.com/weiesky/cc-viewer/releases)


### Logger Modu

Hâlâ yerel claude aracını veya VS Code uzantısını tercih ediyorsanız, bu modu kullanın.

Bu modda, `claude` başlatıldığında otomatik olarak istek günlüklerini ~/.claude/cc-viewer/*yourproject*/date.jsonl dosyasına kaydeden bir günlükleme süreci başlar

Logger modunu etkinleştirin:
```bash
ccv -logger
```

Konsol belirli portu yazdıramadığında, varsayılan ilk port 127.0.0.1:7008'dir. Birden fazla örnek 7009, 7010 gibi sıralı portları kullanır.

Logger modunu kaldırın:
```bash
ccv --uninstall
```

### Sorun Giderme

cc-viewer'ı başlatırken sorunlarla karşılaşırsanız, işte nihai sorun giderme yaklaşımı:

Adım 1: Herhangi bir dizinde Claude Code'u açın.

Adım 2: Claude Code'a şu talimatı verin:

```
I have installed the cc-viewer npm package, but after running ccv it still doesn't work properly. Please check cc-viewer's cli.js and findcc.js, and adapt them to the local Claude Code deployment based on the specific environment. Keep the scope of changes as constrained as possible within findcc.js.
```

Claude Code'un sorunu kendisi teşhis etmesine izin vermek, herhangi birine sormaktan veya herhangi bir dokümantasyonu okumaktan daha etkilidir!

Yukarıdaki talimat tamamlandıktan sonra, `findcc.js` güncellenecektir. Projeniz sıklıkla yerel dağıtım gerektiriyorsa veya çatallanmış (forked) kod sıklıkla kurulum sorunlarını çözmesi gerekiyorsa, bu dosyayı tutmak, bir sonraki seferde onu basitçe kopyalamanıza olanak tanır. Şu anda, Claude Code kullanan birçok proje ve şirket Mac üzerinde değil, sunucu tarafında barındırılan ortamlarda dağıtım yapıyor, bu nedenle yazar, ileride cc-viewer kaynak kodu güncellemelerini takip etmeyi kolaylaştırmak için `findcc.js`'yi ayırmıştır.


### Diğer Komutlar

Bakınız:

```bash
ccv -h
```

### Sessiz Mod

Varsayılan olarak, `ccv`, `claude`'u sardığında sessiz modda çalışır ve terminal çıktınızı yerel deneyimle tutarlı ve temiz tutar. Tüm günlükler arka planda yakalanır ve `http://localhost:7008` adresinden görüntülenebilir.

Yapılandırıldıktan sonra, `claude` komutunu normal şekilde kullanın. İzleme arayüzüne erişmek için `http://localhost:7008` adresini ziyaret edin.


## Özellikler


### Programlama Modu

ccv ile başlattıktan sonra şunları görebilirsiniz:

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/ab353a2b-f101-409d-a28c-6a4e41571ea2" />


Düzenlemeden sonra doğrudan kod farklarını (diff) görüntüleyebilirsiniz:

<img width="1500" height="728" alt="image" src="https://github.com/user-attachments/assets/2a4acdaa-fc5f-4dc0-9e5f-f3273f0849b2" />

Dosyaları ve kodu manuel olarak açabilirsiniz, ancak manuel kodlama önerilmez — bu eski usul kodlamadır!

### Mobil Programlama

Mobil cihazınızdan kodlamak için bir QR kodu bile tarayabilirsiniz:

<img width="3018" height="1460" alt="image" src="https://github.com/user-attachments/assets/8debf48e-daec-420c-b37a-609f8b81cd20" />
<img width="1700" height="790" alt="image" src="https://github.com/user-attachments/assets/da3e519f-ff66-4cd2-81d1-f4e131215f6c" />

Mobil programlama hayalinizi gerçekleştirin. Ayrıca bir plugin mekanizması da var — kodlama alışkanlıklarınıza göre özelleştirmeniz gerekiyorsa, plugin hook güncellemelerini takip edin.


### Logger Modu (Tam Claude Code Oturumlarını Görüntüleme)

<img width="1500" height="768" alt="image" src="https://github.com/user-attachments/assets/a8a9f3f7-d876-4f6b-a64d-f323a05c4d21" />


- Claude Code'dan tüm API isteklerini gerçek zamanlı olarak yakalar ve ham metni sağlar — düzenlenmiş günlükleri değil (bu önemli!!!)
- Main Agent ve Sub Agent isteklerini otomatik olarak tanımlar ve etiketler (alt tipler: Plan, Search, Bash)
- MainAgent istekleri Body Diff JSON'u destekler ve önceki MainAgent isteğinden katlanmış farkları gösterir (yalnızca değişen/yeni alanlar)
- Her istek satır içi Token kullanım istatistiklerini gösterir (girdi/çıktı tokenları, önbellek oluşturma/okuma, isabet oranı)
- Claude Code Router (CCR) ve diğer proxy senaryolarıyla uyumludur — API yol deseni eşleştirmesine geri döner

### Sohbet Modu

Main Agent'ın tam sohbet geçmişini bir sohbet arayüzüne ayrıştırmak için sağ üst köşedeki "Conversation Mode" düğmesine tıklayın:

<img width="1500" height="764" alt="image" src="https://github.com/user-attachments/assets/725b57c8-6128-4225-b157-7dba2738b1c6" />

- Agent Team gösterimi henüz desteklenmemektedir
- Kullanıcı mesajları sağa hizalanır (mavi balonlar), Main Agent yanıtları sola hizalanır (koyu balonlar)
- `thinking` blokları varsayılan olarak katlanmıştır, Markdown olarak render edilir — düşünme sürecini genişletmek ve görüntülemek için tıklayın; tek tıkla çeviri desteklenir (özellik hala stabil değildir)
- Kullanıcı seçim mesajları (AskUserQuestion) Soru-Cevap formatında görüntülenir
- Çift yönlü mod senkronizasyonu: sohbet moduna geçmek, seçili isteğe karşılık gelen sohbete otomatik olarak kaydırır; ham moda geri dönmek, seçili isteğe otomatik olarak kaydırır
- Ayarlar paneli: araç sonuçları ve thinking blokları için varsayılan katlama durumunu açıp kapatın
- Mobil sohbet tarama: mobil CLI modunda, mobil cihazda tam sohbet geçmişine göz atmak için salt okunur bir sohbet görünümünü kaydırarak açmak üzere üst çubuktaki "Conversation Browse" düğmesine dokunun

### Günlük Yönetimi

Sol üst köşedeki CC-Viewer açılır menüsü aracılığıyla:

<img width="1500" height="760" alt="image" src="https://github.com/user-attachments/assets/33295e2b-f2e0-4968-a6f1-6f3d1404454e" />

**Günlük Sıkıştırma**
Günlüklerle ilgili olarak, yazar resmi Anthropic tanımlarının değiştirilmediğini ve günlük bütünlüğünün sağlandığını açıklamak ister. Ancak, 1M Opus modelindeki bireysel günlük girdileri sonraki aşamalarda son derece büyük hale gelebileceğinden, MainAgent için belirli günlük optimizasyonları sayesinde, gzip olmadan en az 66% boyut azaltması sağlanmaktadır. Bu sıkıştırılmış günlüklerin ayrıştırma yöntemi mevcut depodan çıkarılabilir.

### Daha Fazla Kullanışlı Özellik

<img width="1500" height="767" alt="image" src="https://github.com/user-attachments/assets/add558c5-9c4d-468a-ac6f-d8d64759fdbd" />

Kenar çubuğu araçlarını kullanarak prompt'larınızı hızlıca bulabilirsiniz.

---

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/82b8eb67-82f5-41b1-89d6-341c95a047ed" />

İlginç KV-Cache-Text özelliği, Claude'un tam olarak ne gördüğünü görmenizi sağlar.

---

<img width="1500" height="765" alt="image" src="https://github.com/user-attachments/assets/54cdfa4e-677c-4aed-a5bb-5fd946600c46" />

Resim yükleyebilir ve ihtiyaçlarınızı tanımlayabilirsiniz — Claude'un görüntü anlama yeteneği inanılmaz derecede güçlüdür. Ve bildiğiniz gibi, resimleri doğrudan Ctrl+V ile yapıştırabilirsiniz ve tam içeriğiniz sohbette görüntülenecektir.

---

<img width="600" height="370" alt="image" src="https://github.com/user-attachments/assets/87d332ea-3e34-4957-b442-f9d070211fbf" />

Eklentileri özelleştirebilir, tüm CC-Viewer süreçlerini yönetebilirsiniz ve CC-Viewer üçüncü taraf API'lere sıcak geçişi destekler (evet, GLM, Kimi, MiniMax, Qwen, DeepSeek kullanabilirsiniz — ancak yazar bu noktada hepsini oldukça zayıf olarak değerlendirmektedir).

---

<img width="1500" height="746" alt="image" src="https://github.com/user-attachments/assets/b1f60c7c-1438-4ecc-8c64-193d21ee3445" />

Keşfedilmeyi bekleyen daha fazla özellik... Örneğin: sistem Agent Team'i destekler ve yerleşik bir Code Reviewer'a sahiptir. Codex Code Reviewer entegrasyonu yakında geliyor (yazar, Claude Code'un kodunu gözden geçirmek için Codex kullanmayı şiddetle tavsiye eder).

## Lisans

MIT
