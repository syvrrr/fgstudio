document.addEventListener('DOMContentLoaded', () => {
    ScrollReveal().reveal('.project-card', {
        delay: 200,
        distance: '20px',
        origin: 'bottom',
        interval: 100
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});