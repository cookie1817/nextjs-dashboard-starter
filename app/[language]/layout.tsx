import "@/styles/globals.css";
import type { Metadata } from 'next';
import clsx from "clsx";
import { dir } from "i18next";
import CssBaseline from "@mui/material/CssBaseline";
import "@/service/i18n/config";
import { languages } from "@/service/i18n/config";
import StoreLanguageProvider from "@/service/i18n/store-language-provider";
import InitColorSchemeScript from "@/components/theme/init-color-scheme-script";
import ThemeProvider from "@/components/theme/theme-provider";
import SnackbarProvider from "@/components/snackbar";

import { fontSans } from '@/config/fonts';


type Props = {
  params: { language: string };
};


export const metadata: Metadata = {
  title: 'Nextjs Dashboard starter',
  description: 'Nextjs Dashboard starter',
}


// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { t } = await getServerTranslation(params.language, "common");

//   return {
//     title: t("title"),
//   };
// }

export function generateStaticParams() {
  return languages.map((language) => ({ language }));
}

export default function RootLayout({
  children,
  params: { language },
}: {
  children: React.ReactNode
  params: { language: string };
}) {
  return (
    <html lang={language} dir={dir(language)}>
      <body className={clsx("font-sans antialiased", fontSans.className)}>
        <InitColorSchemeScript />
        <ThemeProvider>
          <CssBaseline />
          <SnackbarProvider maxSnack={3} autoHideDuration={3000} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
            <StoreLanguageProvider>
                {children}
            </StoreLanguageProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
