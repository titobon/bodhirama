// i18n.js

const translations = {};

const langMeta = {
    en: { abbr: 'EN', flag: '🇺🇸' },
    id: { abbr: 'ID', flag: '🇮🇩' }
};

// Function to set the language
async function setLanguage(lang) {
    localStorage.setItem('language', lang);
    await loadTranslations(lang);
    updateLangSwitcherUI(lang); // Update UI after language change
}

// Function to load translation files
async function loadTranslations(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${lang}.json`);
        }
        const data = await response.json();
        translations[lang] = data;
        translatePage(lang);
    } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English if the selected language fails to load
        if (lang !== 'en') {
            await setLanguage('en');
        }
    }
}

// Function to translate the page content
function translatePage(lang) {
    if (!translations[lang]) {
        console.error(`Translations for ${lang} not loaded.`);
        return;
    }
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[lang][key];
        if (translation) {
            const targetAttribute = element.getAttribute('data-i18n-target');
            if (targetAttribute) {
                element[targetAttribute] = translation;
            } else {
                element.innerHTML = translation;
            }
        }
    });
}

// Function to get the current language
function getCurrentLanguage() {
    return localStorage.getItem('language') || 'en';
}

// --- Language Switcher UI Logic ---

function updateLangSwitcherUI(lang) {
    const langData = langMeta[lang];
    if (!langData) return;

    const flagElement = document.getElementById('current-lang-flag');
    const abbrElement = document.getElementById('current-lang-abbr');

    if (flagElement) flagElement.textContent = langData.flag;
    if (abbrElement) abbrElement.textContent = langData.abbr;
}

function toggleLangMenu() {
    const menu = document.getElementById('lang-switcher-menu');
    if (menu) {
        menu.classList.toggle('hidden');
    }
}

function setupLangSwitcher() {
    const button = document.getElementById('lang-switcher-button');
    if (button) {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent click from closing the menu immediately
            toggleLangMenu();
        });
    }

    // Close menu if clicking outside
    document.addEventListener('click', (event) => {
        const menu = document.getElementById('lang-switcher-menu');
        const button = document.getElementById('lang-switcher-button');
        if (menu && button && !menu.classList.contains('hidden') && !button.contains(event.target)) {
            menu.classList.add('hidden');
        }
    });

    updateLangSwitcherUI(getCurrentLanguage());
}


// Main function to run on page load
async function initializeI18n() {
    const currentLang = getCurrentLanguage();
    await loadTranslations(currentLang);
    // The lang switcher is in the navbar, which is loaded asynchronously.
    // So we can't set it up here directly. We'll modify loadComponents.js
}

// DOMContentLoaded is the trigger
document.addEventListener('DOMContentLoaded', initializeI18n);

// Function to be called from the language switcher UI
async function changeLanguage(lang) {
    await setLanguage(lang);
    const menu = document.getElementById('lang-switcher-menu');
    if (menu && !menu.classList.contains('hidden')) { // Only add if not already hidden
        menu.classList.add('hidden'); 
    }
}
