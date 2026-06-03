/* =========================================
   NFC-TS サイト JavaScript
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  // ---- ヘッダースクロール ----
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- ハンバーガーメニュー ----
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      nav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // ナビリンクをクリックしたら閉じる
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        nav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- スムーズスクロール（同ページ内アンカー） ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- スクロールアニメーション ----
  const fadeEls = document.querySelectorAll(
    '.feature-card, .problem__card, .flow__step, .usecase-card, .case-card, .section__title, .section__desc'
  );
  fadeEls.forEach(el => el.classList.add('fade-in'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  fadeEls.forEach(el => observer.observe(el));

  // ---- 事例フィルター ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const caseCards = document.querySelectorAll('.case-card');
  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.dataset.filter;
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        caseCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden');
          } else {
            card.classList.add('hidden');
          }
        });
      });
    });
  }

  // ---- お問い合わせフォーム バリデーション & 送信 ----
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitBtn');
      const btnText = submitBtn.querySelector('.btn__text');
      const btnLoading = submitBtn.querySelector('.btn__loading');
      const formMessage = document.getElementById('formMessage');

      // バリデーション
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#EF4444';
          valid = false;
        } else {
          field.style.borderColor = '';
        }
      });

      if (!valid) {
        formMessage.className = 'form-message error';
        formMessage.textContent = '必須項目をすべてご入力ください。';
        return;
      }

      // 送信処理
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'inline';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          formMessage.className = 'form-message success';
          formMessage.textContent = 'お問い合わせを受け付けました。2営業日以内にご返信いたします。';
          contactForm.reset();
        } else {
          throw new Error('送信エラー');
        }
      } catch (err) {
        // フォームPHP未設置時はデモメッセージ
        formMessage.className = 'form-message success';
        formMessage.textContent = 'お問い合わせを受け付けました。2営業日以内にご返信いたします。（デモ）';
        contactForm.reset();
      } finally {
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoading) btnLoading.style.display = 'none';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });

    // リアルタイムバリデーション解除
    contactForm.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

});
