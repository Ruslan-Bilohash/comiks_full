/* Комікс·Lab — написи застосунку мовою «no».
   Збирається з tools/lang/app/<код>.json через node tools/app-i18n.js build.
   Вантажиться лише тим, хто обрав цю мову інтерфейсу (див. assets/boot.js), а
   модулі беруть звідси свої рядки через KL_T_FILL: ключа немає — лишається
   англійський, тож неповний словник нічого не ламає. */
window.KL_T = Object.assign(window.KL_T || {}, {"english.js:QTIP":{"no":{"who":"Hvem sier dette?","panel":"Hvilket bilde er denne linjen fra?","listen":"Lytt og velg ordet","picture":"Hva er dette?","blank":"Hvilket ord mangler?","emoji":"Hva er dette? Velg det engelske ordet"}}});
window.KL_T_HAVE = (window.KL_T_HAVE || []).concat('no');
if (window.KL_T_APPLY) window.KL_T_APPLY();
