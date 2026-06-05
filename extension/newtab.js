// ---- 时钟 ----
function updateClock() {
  var now = new Date();
  var elTime = document.getElementById('time');
  var elDate = document.getElementById('date');
  if (elTime) elTime.textContent = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  if (elDate) elDate.textContent = now.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' });
}
updateClock();
setInterval(updateClock, 1000);

// ---- 搜索按钮状态 ----
function toggleBtn() {
  var btn = document.getElementById('btn');
  if (document.getElementById('query').value.trim()) {
    btn.classList.add('has-query');
  } else {
    btn.classList.remove('has-query');
  }
}

// ---- 搜索（打开新标签页） ----
document.getElementById('searchForm').addEventListener('submit', function (e) {
  e.preventDefault();
  var q = document.getElementById('query').value.trim();
  if (!q) return;
  window.open('https://www.bing.com/search?q=' + encodeURIComponent(q), '_blank');
});

// ---- 网络检测与切换（默认在线，仅确认无网络才切离线）----
var iframe = document.getElementById('online-view');
var offlineView = document.getElementById('offline-view');

// 离线视图初始隐藏（CSS 已设 display:none），iframe 直接加载远程页面

function showOffline() {
  iframe.style.display = 'none';
  offlineView.classList.add('active');
}

// 用 fetch 探测网络（带超时）
var controller = new AbortController();
var timer = setTimeout(function () { controller.abort(); }, 5000);

fetch('https://search.ruanftrix.cn', { method: 'HEAD', mode: 'no-cors', cache: 'no-store', signal: controller.signal })
  .then(function () {
    clearTimeout(timer);
    // 有网络，保持 iframe 显示，什么都不用做
  })
  .catch(function () {
    clearTimeout(timer);
    showOffline();
  });

// 监听网络恢复
window.addEventListener('online', function () { location.reload(); });
