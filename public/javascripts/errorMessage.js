let msg = {
    ru: `Произошла ошибка, попробуйте ещё раз через некоторое время.
    Если ошибка повторится обратитесь в тех поддержку.`,
    en: `An error has occurred, please try again after a while.
    If the error persists, contact technical support.`
};
export let errorMsg = document.querySelector('html').lang == 'ru' ? msg.ru : msg.en