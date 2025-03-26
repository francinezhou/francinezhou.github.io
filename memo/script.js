document.addEventListener('DOMContentLoaded', (event) => {
    // Hover animation control
    const spans = document.querySelectorAll('.hover span');
    
    spans.forEach(span => {
        span.addEventListener('animationend', (e) => {
            if (e.animationName === 'toOutline') {
                e.target.style.animation = 'none';
            }
        });
    });

    spans.forEach(span => {
        span.addEventListener('mouseover', (e) => {
            if (!e.target.style.animation.includes('toOutline')) {
                e.target.style.animation = 'toOutline 1s linear forwards';
            }
        });
    });

    // Font weight control
    const fontWeightSlider = document.getElementById('fontWeightSlider');
    const fontWeightValue = document.getElementById('fontWeightValue');
    const testerText = document.querySelector('.testerText');

    fontWeightSlider.addEventListener('input', (e) => {
        const weight = e.target.value;
        fontWeightValue.textContent = weight;  // Update the displayed font weight value
        testerText.style.fontVariationSettings = `"wght" ${weight}`;
    });
});
