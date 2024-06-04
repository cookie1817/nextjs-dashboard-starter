import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decode } from 'jsonwebtoken';
import acceptLanguage from "accept-language";
import {
  fallbackLanguage,
  languages,
  cookieName,
} from "@/service/i18n/config";

acceptLanguage.languages([...languages]);

const authRoutes = ['login', 'forgotpassword', 'signup']



export function middleware(req: NextRequest) {
  // for public routes, we don't need to check for a token
  const pathname = req.nextUrl.pathname;
  const currentPathname = req.nextUrl.pathname.replace(/^\/\w+\//, "").toLocaleLowerCase();
  const isAuthRoutes = authRoutes.some((authRoute) => authRoute === currentPathname)
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/static") || // exclude static files
    pathname.startsWith("/api")  || // exclude API routes
    isAuthRoutes
  )
    return NextResponse.next();

  let language;
  if (req.cookies.has(cookieName))
    language = acceptLanguage.get(req.cookies.get(cookieName)?.value);
  if (!language)
    language = acceptLanguage.get(req.headers.get("Accept-Language"));
  if (!language || !languages.some((lang) => lang === language)) language = fallbackLanguage;



  // Redirect if language in path is not supported
  let redirectURL;
  if (
    !languages.some((loc) => req.nextUrl.pathname.startsWith(`/${loc}/`)) &&
    !req.nextUrl.pathname.startsWith("/_next")
  ) {
    redirectURL = `/${language}/login`
  }

  const AUTH_TOKEN_KEY = process.env.AUTH_TOKEN_KEY || "auth-token-data";

  // check if token in cookie is present
  const auth = req.cookies.get(AUTH_TOKEN_KEY);
  const token = auth?.value;

  console.log('token', token)

  if (!auth && !authRoutes.some((authRoute) => authRoute === currentPathname) ||
  (!token?.accessToken || token?.accessToken === "")) {
    redirectURL = `/${language}/login`
  }


  // verify token
  let decodedToken;
  try {
    const accessToken = JSON.parse(token).accessToken
    decodedToken = decode(accessToken)
    console.log('decodedToken', decodedToken)
    if (decodedToken && !decodedToken.isEmailVerified) {
      return NextResponse.rewrite(new URL(`/${language}/verifyEmail`, req.url));
    }

    // redirect to each page by auth status: isEmailVerify, resetPassword
  } catch (err) {
    console.log('err', err)
    // redirectURL = `/${language}/login`
    // return NextResponse.redirect(
    //   new URL(
    //     redirectURL,
    //     req.url
    //   )
    // );
  }

  // if token is not valid, redirect to login page
  // if (!decodedToken) {
  //   console.log("Token is null or undefined");
  //   // return NextResponse.rewrite(new URL(`/${language}/login`, req.url));
  // }

  // return NextResponse.next();

  // TODO: redirecrt to dashboard or login page if url path not found

  if (redirectURL) {
    // return NextResponse.redirect(
    //   new URL(
    //     redirectURL,
    //     req.url
    //   )
    // );
  }

  
  // // if (
  // //   req.nextUrl.pathname.indexOf("icon") > -1 ||
  // //   req.nextUrl.pathname.indexOf("chrome") > -1
  // // ) {
  // //   return NextResponse.next();
  // // }

  return NextResponse.next();
}