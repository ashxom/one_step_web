const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    // The problem-section transition is reversible: scrolling back up restores
    // the original document cards rather than leaving them blurred.
    if (entry.target.classList.contains('clarity-message')) {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
      return;
    }
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const story = document.querySelector('.sticky-story');
const captions = [...document.querySelectorAll('.story-caption')];
const panels = [...document.querySelectorAll('.scene-panel')];
const storyPhone = document.querySelector('.story-phone');
const meter = document.querySelector('.story-meter');

function updateStory() {
  if (!story || reduceMotion) return;
  const rect = story.getBoundingClientRect();
  const distance = story.offsetHeight - window.innerHeight;
  const progress = Math.min(0.999, Math.max(0, -rect.top / Math.max(distance, 1)));
  const index = Math.min(2, Math.floor(progress * 3));
  captions.forEach((caption, i) => caption.classList.toggle('active', i === index));
  panels.forEach((panel, i) => panel.classList.toggle('active', i === index));
  storyPhone.style.transform = `translateY(${Math.sin(progress * Math.PI) * -8}px) rotate(${(progress - .5) * -2}deg)`;
  meter.style.setProperty('--story-progress', `${progress * 100}%`);
  meter.querySelector('.current').textContent = `0${index + 1}`;
}

let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) { window.requestAnimationFrame(() => { updateStory(); ticking = false; }); ticking = true; }
}, { passive: true });
updateStory();

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
});
