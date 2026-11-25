const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');
const carousel = document.querySelector('.carousel');
const list = document.querySelector('.list');
const runningTimeEl = document.querySelector('.carousel .timeRunning');

const transitionDuration = 3000; // must be >= CSS transition on .item (1s) but gives buffer
const autoNextInterval = 7000;   // autoplay interval, matches CSS runningTime duration

let isAnimating = false;   // prevents overlapping transitions
let autoPlayTimer = null;
let autoPlay = false;       // set false to disable autoplay entirely

nextBtn.addEventListener('click', () => showSlider('next'));
prevBtn.addEventListener('click', () => showSlider('prev'));

function showSlider(type) {
  if (isAnimating) return; // ignore clicks mid-transition
  isAnimating = true;

  const items = list.querySelectorAll('.item');

  if (type === 'next') {
    list.appendChild(items[0]);
    carousel.classList.add('next');
  } else {
    list.prepend(items[items.length - 1]);
    carousel.classList.add('prev');
  }

  resetTimeAnimation();
  restartAutoPlay();

  setTimeout(() => {
    carousel.classList.remove('next', 'prev');
    isAnimating = false;
  }, transitionDuration);
}

function resetTimeAnimation() {
  runningTimeEl.style.animation = 'none';
  void runningTimeEl.offsetHeight; // force reflow so animation restarts
  runningTimeEl.style.animation = `runningTime ${autoNextInterval / 1000}s linear 1 forwards`;
}

// ---- Autoplay ----
function startAutoPlay() {
  if (!autoPlay) return;
  autoPlayTimer = setInterval(() => showSlider('next'), autoNextInterval);
}

function stopAutoPlay() {
  clearInterval(autoPlayTimer);
}

function restartAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

// Pause on hover, resume on mouse leave
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

// ---- Keyboard navigation ----
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') showSlider('next');
  if (e.key === 'ArrowLeft') showSlider('prev');
});

// ---- Touch / swipe support ----
let touchStartX = 0;
let touchEndX = 0;
const swipeThreshold = 50; // min px distance to count as a swipe

carousel.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

carousel.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  const delta = touchEndX - touchStartX;
  if (Math.abs(delta) < swipeThreshold) return;
  if (delta < 0) showSlider('next'); // swiped left -> next
  else showSlider('prev');           // swiped right -> prev
}, { passive: true });

// ---- Init ----
resetTimeAnimation();
startAutoPlay();

