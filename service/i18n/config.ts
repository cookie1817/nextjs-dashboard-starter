export const fallbackLanguage = "zh" as const;
export const languages = [fallbackLanguage, 'en'] as const;

type LanguageLabelType = {
  key: string;
  label: string;
};

export const languageLabels: LanguageLabelType[] = [
  {key: 'zh', label: '中文'},
  {key: 'en', label: 'English'}
]
export const defaultNamespace = "common";
export const cookieName = "i18next";

export function getOptions(
  language: string = fallbackLanguage,
  namespace = defaultNamespace
) {
  return {
    debug: process.env.NODE_ENV === "development",
    supportedLngs: languages,
    fallbackLng: fallbackLanguage,
    lng: language,
    fallbackNS: defaultNamespace,
    defaultNS: defaultNamespace,
    ns: namespace,
  };
}
