import { GoogleTranslator } from '/@translate-tools/core/translators/GoogleTranslator';

const translator = new GoogleTranslator();

async function translatePage(targetLang) {
    const elementsToTranslate = document.querySelectorAll("h1, p, button, span");

    elementsToTranslate.forEach(async (el) => {
        if (!el.dataset.originalText) {
            el.dataset.originalText = el.innerText.trim();
        }

        const originalText = el.dataset.originalText;
        const translatedText = await translator.translate(originalText, "auto", targetLang);
        el.innerText = translatedText;
    });
}

// Listen for language selection changes
document.getElementById("language-select").addEventListener("change", (event) => {
    translatePage(event.target.value);
});

