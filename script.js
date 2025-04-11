<script>
  // Animation au scroll
  const elements = document.querySelectorAll('[data-animate]');

  const animateOnScroll = () => {
    elements.forEach(el => {
      const pos = el.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      if (pos < windowHeight - 100) {
        el.classList.add(el.dataset.animate);
      }
    });
  };

  window.addEventListener('scroll', animateOnScroll);
  window.addEventListener('load', animateOnScroll);
</script>
