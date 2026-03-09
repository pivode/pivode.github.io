'use strict';

(function () {
  var shareBtn = document.getElementById('share-btn');
  var popover  = document.getElementById('share-popover');
  var copyBtn  = document.getElementById('copy-link-btn');
  var tweetBtn = document.getElementById('tweet-btn');
  var toast    = document.getElementById('copy-toast');

  // --- Share popover toggle ---
  if (shareBtn && popover) {
    shareBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = popover.classList.toggle('hidden');
      shareBtn.setAttribute('aria-expanded', !popover.classList.contains('hidden'));
    });

    document.addEventListener('click', function (e) {
      if (!popover.contains(e.target) && e.target !== shareBtn) {
        popover.classList.add('hidden');
        shareBtn.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !popover.classList.contains('hidden')) {
        popover.classList.add('hidden');
        shareBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Copy link ---
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      var link = document.querySelector('link[rel="canonical"]');
      var url = link ? link.href : window.location.href;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(function () { showToast('Link copied!'); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast('Link copied!');
      }
      popover.classList.add('hidden');
    });
  }

  // --- Share on X ---
  if (tweetBtn) {
    tweetBtn.addEventListener('click', function () {
      var link = document.querySelector('link[rel="canonical"]');
      var url = link ? link.href : window.location.href;
      var title = encodeURIComponent(document.title);
      var urlParam = encodeURIComponent(url);
      window.open('https://x.com/intent/tweet?text=' + title + '&url=' + urlParam, '_blank', 'width=550,height=420');
      popover.classList.add('hidden');
    });
  }

  var toastTimer;
  function showToast(msg) {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.classList.add('visible');
    toastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 2000);
  }
})();
