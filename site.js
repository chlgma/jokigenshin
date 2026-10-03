var ICONS = {
  wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/><g transform="translate(6.6 6.6) scale(.5)"><path stroke-width="3.2" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></g></svg>',
  tiktok: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M15 3c.4 2.6 2 4.2 5 4.5"/></svg>',
  ig: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><path d="M17.5 6.5h.01"/></svg>'
};

function waLink(text) {
  return "https://wa.me/" + CONFIG.WA_NUMBER + "?text=" + encodeURIComponent(text);
}

/* Ikon kontak di pojok kanan atas */
var social = document.getElementById("social");
if (social) {
  [["wa", "WhatsApp", waLink("Halo Eyy, mau tanya joki Genshin")],
   ["tiktok", "TikTok", CONFIG.TIKTOK],
   ["ig", "Instagram", CONFIG.INSTAGRAM]].forEach(function (x) {
    var a = document.createElement("a");
    a.className = "icon-btn";
    a.href = x[2];
    a.target = "_blank";
    a.rel = "noopener";
    a.title = x[1];
    a.setAttribute("aria-label", x[1]);
    a.innerHTML = ICONS[x[0]];
    social.appendChild(a);
  });
}

/* Tombol chat WhatsApp biasa */
document.querySelectorAll("a.wa").forEach(function (a) {
  a.href = waLink("Halo Eyy, mau tanya joki Genshin");
  a.target = "_blank";
  a.rel = "noopener";
});

/* Bintang berkedip */
var sky = document.getElementById("stars");
for (var i = 0; i < 90; i++) {
  var s = document.createElement("i");
  var size = 1 + Math.random() * 2;
  s.style.cssText = "left:" + Math.random() * 100 + "%;top:" + Math.random() * 100 + "%;width:" + size + "px;height:" + size + "px;animation-delay:" + Math.random() * 4 + "s;animation-duration:" + (3 + Math.random() * 4) + "s";
  sky.appendChild(s);
}

/* Ornamen latar: bulan sabit dan planet bercincin */
var deco = document.createElement("div");
deco.className = "deco";
deco.setAttribute("aria-hidden", "true");
deco.innerHTML =
  '<svg class="d-moon" viewBox="0 0 100 100"><mask id="cm"><rect width="100" height="100" fill="#fff"/><circle cx="64" cy="40" r="34" fill="#000"/></mask><circle cx="50" cy="50" r="40" fill="#eef1ff" mask="url(#cm)"/></svg>' +
  '<svg class="d-wind" viewBox="0 0 120 80" fill="none" stroke="#b7c0ee" stroke-width="3" stroke-linecap="round"><path d="M5 30C35 8 80 8 92 30c9 17-16 24-20 10-3-10 12-12 14-5"/><path d="M5 52C30 40 60 44 78 54"/><path d="M20 68c20-6 40-4 56 4"/></svg>' +
  '<svg class="d-spark" viewBox="-12 -12 24 24"><path d="M0-11Q1-1 11 0Q1 1 0 11Q-1 1-11 0Q-1-1 0-11Z" fill="#ffd98a"/></svg>';
document.body.insertBefore(deco, document.body.firstChild);

/* Form order (hanya di order.html) */
var form = document.getElementById("orderForm");
if (form) {
  var status = document.getElementById("status");
  var pre = new URLSearchParams(location.search).get("svc");
  if (pre) form.layanan.value = pre;

  function summary() {
    var d = new FormData(form);
    return "Halo Eyy, saya " + d.get("nama") + ". Mau order: " + d.get("layanan") +
      ". UID: " + (d.get("uid") || "-") + ", server: " + d.get("server") +
      ". Catatan: " + (d.get("catatan") || "-") + ". Kontak: " + d.get("kontak");
  }

  document.getElementById("waBtn").addEventListener("click", function () {
    if (!form.reportValidity()) return;
    window.open(waLink(summary()), "_blank", "noopener");
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (CONFIG.ORDER_ENDPOINT.indexOf("XXXX") > -1) {
      status.textContent = "Form belum diaktifkan. Pakai tombol WhatsApp dulu ya.";
      return;
    }
    status.textContent = "Mengirim...";
    fetch(CONFIG.ORDER_ENDPOINT, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        status.textContent = "Order terkirim. Kami hubungi kamu lewat kontak yang kamu isi.";
      })
      .catch(function () {
        status.textContent = "Gagal mengirim. Coba lagi, atau pakai tombol WhatsApp.";
      });
  });
}
