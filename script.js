const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', isOpen);
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});


const revealTargets = document.querySelectorAll(
  '.section-eyebrow, .section-title, .about-text, .skill-card, .receipt, .timeline-item, .contact-card'
);
revealTargets.forEach(el => el.classList.add('reveal'));

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealTargets.forEach(el => el.classList.add('in'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('in'), i * 60);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealTargets.forEach(el => observer.observe(el));
}


const terminalBody = document.getElementById('terminalBody');

const script = [
  { type: 'prompt', text: 'whoami' },
  { type: 'output', text: 'marcus_bautista', highlight: true },
  { type: 'prompt', text: 'cat role.txt' },
  { type: 'output', text: 'IT Student · Front-End Developer' },
  { type: 'prompt', text: 'cat focus.txt' },
  { type: 'output', text: 'POS systems, inventory tools, web UI' },
  { type: 'prompt', text: 'status --check' },
  { type: 'output', text: '[ONLINE] open to internships & junior roles', highlight: true },
];

async function typeLine(el, text, speed = 28) {
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await new Promise(r => setTimeout(r, speed));
  }
}

async function runTerminal() {
  if (!terminalBody) return;

  if (prefersReducedMotion) {
    script.forEach(line => {
      const row = document.createElement('div');
      row.className = 'term-line';
      if (line.type === 'prompt') {
        row.innerHTML = `<span class="term-prompt">$</span> ${line.text}`;
      } else {
        row.innerHTML = `<span class="${line.highlight ? 'term-highlight' : 'term-output'}">${line.text}</span>`;
      }
      terminalBody.appendChild(row);
    });
    return;
  }

  for (const line of script) {
    const row = document.createElement('div');
    row.className = 'term-line';
    terminalBody.appendChild(row);

    if (line.type === 'prompt') {
      const prompt = document.createElement('span');
      prompt.className = 'term-prompt';
      prompt.textContent = '$ ';
      row.appendChild(prompt);
      const cmd = document.createElement('span');
      row.appendChild(cmd);
      await typeLine(cmd, line.text, 32);
      await new Promise(r => setTimeout(r, 250));
    } else {
      const out = document.createElement('span');
      out.className = line.highlight ? 'term-highlight' : 'term-output';
      row.appendChild(out);
      await typeLine(out, line.text, 14);
      await new Promise(r => setTimeout(r, 350));
    }
  }

  const cursor = document.createElement('span');
  cursor.className = 'term-cursor';
  const finalRow = document.createElement('div');
  finalRow.className = 'term-line';
  const promptEnd = document.createElement('span');
  promptEnd.className = 'term-prompt';
  promptEnd.textContent = '$ ';
  finalRow.appendChild(promptEnd);
  finalRow.appendChild(cursor);
  terminalBody.appendChild(finalRow);
}

const termObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      runTerminal();
      termObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const terminalEl = document.getElementById('terminal');
if (terminalEl) termObserver.observe(terminalEl);

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    nav.style.borderBottomColor = 'var(--border)';
  } else {
    nav.style.borderBottomColor = 'var(--border-soft)';
  }
});

document.getElementById('year').textContent = new Date().getFullYear();
