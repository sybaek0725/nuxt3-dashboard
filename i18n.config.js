import math_ko from '@/locales/math/ko.json';
import math_en from '@/locales/math/en.json';
import math_jp from '@/locales/math/jp.json';
import eng_ko from '@/locales/eng/ko.json';
import eng_en from '@/locales/eng/en.json';
import eng_jp from '@/locales/eng/jp.json';

const path = window.location.pathname;
const i18n = useCookie('i18n_redirected');

export default defineI18nConfig(() => ({
    legacy: false,
    locale: i18n.value || 'ko',
    messages: {
        ko: path.indexOf('/math') >= 0 ? math_ko : eng_ko,
        en: path.indexOf('/math') >= 0 ? math_en : eng_en,
        jp: path.indexOf('/math') >= 0 ? math_jp : eng_jp
    }
}));
