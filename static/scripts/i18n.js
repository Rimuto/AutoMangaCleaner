$(function () {
  // use plugins and options as needed, for options, detail see
  // https://www.i18next.com
  i18next
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(i18nextBrowserLanguageDetector)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
      debug: false,
      fallbackLng: 'ru',
      resources: {
        en: {
            translation: {
                menu: {
                    feedback: "Feedback or issue",
                    feedbackLink: "https://github.com/Rimuto/AutoMangaCleaner/issues",
                    windows: "Windows version",
                    videoTutorial: "Video tutorial",
                    selectFile: "Select a file",
                    uploadFontFile: "Upload font file"
                },
                label: {
                    font: "Font:",
                    size: "Size:",
                    height: "Height:",
                    color: "Color:",
                    angle: "Angle:"
                },
                button: {
                    "toggleTheme": "Toggle theme",
                    "apply": "Apply",
                    "delete": "Delete",
                    "add": "Add",
                    "foreground": "To the foreground",
                    "group": "Group",
                    "ungroup":"Ungroup",
                    "background": "As a background",
                    "fixPosition": "Fix position",
                    "drawingMode": "Drawing Mode",
                    "saveRaw": "Save raw images",
                    "saveCurrent": "Save current",
                    "saveProcessed": "Save processed"
                }
            }
        },
        ru: {
            translation: {
                menu: {
                    feedback: "Обратная связь",
                    feedbackLink: "https://forms.gle/847JnQbsEF1RTejk9",
                    windows: "Версия для Windows",
                    videoTutorial: "Видео инструкция",
                    selectFile: "ФВыберите файл",
                    uploadFontFile: "Загрузить файл шрифта",
                },
                label: {
                    font: "Шрифт:",
                    size: "Размер:",
                    height: "Высота:",
                    color: "Цвет:",
                    angle: "Угол:"
                },
                button: {
                    "toggleTheme": "Переключить тему",
                    "apply": "Подать заявление",
                    "delete": "Удалить",
                    "add": "Добавлять",
                    "foreground": "На передний план",
                    "group": "Группа",
                    "ungroup":"Разгруппировать",
                    "background": "В качестве фона",
                    "fixPosition": "Исправить положение",
                    "drawingMode": "Режим рисования",
                    "saveRaw": "Сохраняйте необработанные изображения",
                    "saveCurrent": "Сохранить текущий",
                    "saveProcessed": "Сохранить обработано"
                }
            }
        }
      }
    }, (err, t) => {
      if (err) return console.error(err);

      // for options see
      // https://github.com/i18next/jquery-i18next#initialize-the-plugin
      jqueryI18next.init(i18next, $, { useOptionsAttr: true });

      // start localizing, details:
      // https://github.com/i18next/jquery-i18next#usage-of-selector-function
      $('body').localize();
    });
});