// Language toggle logic for the Budapest Bats site.
// Works together with translations.js — include both scripts on any page
// that has a language toggle button and data-i18n="key" attributes.

function setLanguage(lang) {
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    document.documentElement.lang = lang;
    localStorage.setItem("bb-lang", lang);

    document.querySelectorAll(".lang-toggle button").forEach(function (btn) {
        btn.classList.toggle("active-lang", btn.dataset.lang === lang);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const saved = localStorage.getItem("bb-lang") || "en";
    setLanguage(saved);
});
