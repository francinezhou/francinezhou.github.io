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

    // Initial values
    let contrast = fontContrastSlider.value;
    let serif = fontSerifSlider.value;

    function updateFontVariationSettings() {
        testerText.style.fontVariationSettings = `"xopq" ${contrast}, "SERF" ${serif}`;
    }

    // Update font contrast
    fontContrastSlider.addEventListener('input', (e) => {
        contrast = e.target.value;
        fontContrastValue.textContent = contrast;  // Update the displayed font weight value
        updateFontVariationSettings();
    });

    // Update serif value
    fontSerifSlider.addEventListener('input', (e) => {
        serif = e.target.value;
        fontSerifValue.textContent = serif;  // Update the displayed serif value
        updateFontVariationSettings();
    });

    // Initialize the font settings on load
    updateFontVariationSettings();
});
