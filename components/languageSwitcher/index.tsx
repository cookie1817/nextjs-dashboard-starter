import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useTranslation } from "react-i18next";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

import useLanguage from "@/service/i18n/use-language";
import useStoreLanguageActions from "@/service/i18n/use-store-language-actions";
import { fallbackLanguage, languageLabels } from "@/service/i18n/config";



export default function LanguageSwitcher() {
    const currentPathname = usePathname();
    const router = useRouter();
    const language = useLanguage();
    const { setLanguage: setCookie } = useStoreLanguageActions();
    const { i18n } = useTranslation();


    const onToggleLanguageClick = (nextLocale: string) => {
        const currentLocale = language;
        // redirect to the new locale path
        if (
          currentLocale === fallbackLanguage &&
          !nextLocale
        ) {
          router.push('/' + nextLocale + currentPathname);
          i18n.changeLanguage(nextLocale);
          setCookie(nextLocale);
        } else {
          router.push(
            currentPathname.replace(`/${currentLocale}`, `/${nextLocale}`)
          );
        }
        router.refresh();
      };

    return (
        <Select className='mr-8' onChange={(event) => onToggleLanguageClick(event.target.value as string)} value={language}>
          {languageLabels.map((languageLabel) =>  
            <MenuItem
              key={languageLabel.key}
              value={languageLabel.key}
            >
            {languageLabel.label}
          </MenuItem>)}
        </Select>
    );
  }