const en = require('./en.json');
const hr = require('./hr.json');

function carouselFix() {
  $('.carousel').each(function (i, x) {
    new bootstrap.Carousel(x);
  });
}

function i18nInit() {
  i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
      debug: true,
      fallbackLng: 'en',
      resources: {
        en: {
          translation: en
        },
        hr: {
          translation: hr
        }
      }
    }, (err, t) => {
      if (err) return console.error(err);
      jqueryI18next.init(i18next, $, { useOptionsAttr: true });

      $(`#${i18next.resolvedLanguage}`).addClass('nav-link-language-active');

      $("#hr").on("click", () => changeLocale('hr', i18next));
      $("#en").on("click", () => changeLocale('en', i18next));

      rerender(i18next.resolvedLanguage);
    });
}

function rerender(locale) {
  $('.nav-link-language-active').removeClass('nav-link-language-active');
  $(`#${locale}`).addClass('nav-link-language-active');
  $('body').localize();
}

function changeLocale(locale, i18next) {
  i18next.changeLanguage(locale, () => {
    rerender(locale);
    document.documentElement.lang = locale;
    localStorage.setItem('i18nextLng', locale)
  });
}

function galleryInit() {
  const lightbox = GLightbox({
    selector: '.glightbox',
    touchNavigation: true,
    loop: true,
    zoomable: true,
    autoplayVideos: true
  });
}

$(function () {
  i18nInit();
  carouselFix();
  galleryInit();
  $(".nav-link").on("click", () => $("#navbarCollapse").collapse('hide'));
});