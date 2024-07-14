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

    const fontContrastSlider = document.getElementById('fontContrastSlider');
    const fontContrastValue = document.getElementById('fontContrastValue');
    const fontSerifSlider = document.getElementById('fontSerifSlider');
    const fontSerifValue = document.getElementById('fontSerifValue');
    const testerText = document.querySelector('.testerText');

    // Update font contrast
    fontContrastSlider.addEventListener('input', (e) => {
        const contrast = e.target.value;
        fontContrastValue.textContent = contrast;  // Update the displayed font weight value
        testerText.style.fontVariationSettings = `"xopq" ${contrast}`;
    });

    // Update serif value
    fontSerifSlider.addEventListener('input', (e) => {
        const serif = e.target.value;
        fontSerifValue.textContent = serif;  // Update the displayed serif value
        testerText.style.fontVariationSettings = `"SERF" ${serif}`;
    });
});
