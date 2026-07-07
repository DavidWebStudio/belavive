document.addEventListener('DOMContentLoaded', () => {

  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (cursor && follower) {
    let fx = 0, fy = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      cursor.style.left = cx + 'px';
      cursor.style.top  = cy + 'px';
    });
    function animFollower() {
      fx += (cx - fx) * .1;
      fy += (cy - fy) * .1;
      follower.style.left = fx + 'px';
      follower.style.top  = fy + 'px';
      requestAnimationFrame(animFollower);
    }
    animFollower();
    document.querySelectorAll('a, button, .service-card, .dep-card, .diff-item').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.width  = '20px';
        cursor.style.height = '20px';
        cursor.style.background = 'var(--rose-m)';
        follower.style.width  = '52px';
        follower.style.height = '52px';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.width  = '12px';
        cursor.style.height = '12px';
        cursor.style.background = 'var(--rose-d)';
        follower.style.width  = '36px';
        follower.style.height = '36px';
      });
    });
  }

  const header = document.querySelector('header');
  const btnTop = document.querySelector('.btn-top');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 60);
    if (btnTop) btnTop.classList.toggle('show', y > 400);
  }, { passive: true });

  if (btnTop) {
    btnTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      nav.classList.toggle('open');
      const spans = hamburger.querySelectorAll('span');
      const open = nav.classList.contains('open');
      hamburger.setAttribute('aria-expanded', open);
      hamburger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      spans[0].style.transform = open ? 'rotate(45deg) translate(4px, 5px)' : '';
      spans[1].style.opacity   = open ? '0' : '1';
      spans[2].style.transform = open ? 'rotate(-45deg) translate(4px, -5px)' : '';
    });
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = '1'; });
      });
    });
  }

  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), e.target.dataset.delay || 0);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .12 });
  reveals.forEach((el, i) => {
    el.dataset.delay = (i % 4) * 100;
    observer.observe(el);
  });

  const counters = document.querySelectorAll('.counter-num');
  const cObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = +el.dataset.target;
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();
        function animate(now) {
          const progress = Math.min((now - start) / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(ease * target) + suffix;
          if (progress < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
        cObserver.unobserve(el);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => cObserver.observe(c));

  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        i.querySelector('.faq-a').style.maxHeight = '0';
      });
      if (!isOpen) {
        item.classList.add('open');
        const ans = item.querySelector('.faq-a');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  document.querySelectorAll('.masonry-ph').forEach((el, i) => {
    const heights = [220, 300, 240, 360, 280, 320, 200, 340, 260];
    el.style.height = heights[i % heights.length] + 'px';
  });


  const filterBtns = document.querySelectorAll('.filter-btn');
  const prodCards  = document.querySelectorAll('.service-card[data-cat]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      prodCards.forEach(card => {
        const show = cat === 'all' || card.dataset.cat === cat;
        card.style.transition = 'opacity .4s, transform .4s';
        card.style.opacity = show ? '1' : '0';
        card.style.transform = show ? 'none' : 'scale(.95)';
        card.style.pointerEvents = show ? 'all' : 'none';
      });
    });
  });

});
