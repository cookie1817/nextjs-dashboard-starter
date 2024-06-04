import App, { AppContext } from 'next/app'
import type { AppProps } from "next/app"

import useLanguage from "@/service/i18n/use-language";


const Home = ({ Component, pageProps: pageProps  }: AppProps) => {
  

  return(
      <div className="h-full">
        <Component {...pageProps} />
      </div>
  );
};

Home.getInitialProps = async (appContext: AppContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const language = useLanguage();
  const appProps = await App.getInitialProps(appContext)

  if (appContext.ctx.res?.statusCode === 404) {
    appContext.ctx.res.writeHead(302, { Location: `${language}/login` })
    appContext.ctx.res.end()
    return
  }

  return { ...appProps }
}

export default Home;
