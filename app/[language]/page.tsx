import type { NextPage } from "next";
import { redirect } from "next/navigation";
// import { SessionProvider } from "next-auth/react"
import App, { AppContext } from 'next/app'
import type { AppProps } from "next/app"

import useLanguage from "@/service/i18n/use-language";

import Login from "./login/page"

const Home = ({ Component, pageProps: pageProps  }: AppProps) => {
  
  // return redirect('/' + fallbackLanguage || 'zh' + 'login');

  return(
    // <SessionProvider session={session}>
      <div className="h-full">
        <Component {...pageProps} />
      </div>
    // </SessionProvider>
  );
};

Home.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const language = useLanguage();
  const appProps = await App.getInitialProps(appContext)

  console.log('appContext', appContext)

  if (appContext.ctx.res?.statusCode === 404) {
    appContext.ctx.res.writeHead(302, { Location: `${language}/login` })
    appContext.ctx.res.end()
    return
  }

  return { ...appProps }
}

export default Home;
