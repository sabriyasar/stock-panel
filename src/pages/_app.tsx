import 'antd/dist/reset.css' // Next.js 15 için reset.css
import "@/styles/globals.css";
import "@/styles/dashboard.scss";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
