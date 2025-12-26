
import React, { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CONFIG from '../config';

// 从独立文件中导入组件
import MusicPlayer from './MusicPlayer';
import Pio from './Pio';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * 基础布局，处理`<head>`，全局脚本和基本页面结构
 * @param {*} props
 * @returns
 */
const Layout = (props) => {
  const { children, meta } = props;
  const router = useRouter();

  const pageTitle = meta?.title ? `${meta.title} - ${CONFIG.MIZUKI_NAV_TITLE}` : `${CONFIG.MIZUKI_NAV_TITLE} - ${"Subtitle from config"}`;
  const description = meta?.description || pageTitle;

  useEffect(() => {
    console.log("Layout.js mounted - 可以在这里初始化客户端脚本");

    const handleRouteChange = (url) => {
      console.log(`页面切换到: ${url}. 可以在这里执行页面清理和初始化。`);
    };

    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router.events]);

  return (
    <div>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {CONFIG.MIZUKI_PIO_WIDGET && <link rel="stylesheet" href="/pio/static/pio.css" />}
      </Head>

      <div className="mizuki-theme">
        <Navbar />

        <main id="main-grid">
          {children}
        </main>
        
        <Footer />
        
        {CONFIG.MIZUKI_WIDGET_MUSIC.ENABLE && <MusicPlayer />}
        {CONFIG.MIZUKI_PIO_WIDGET && <Pio />}

      </div>
    </div>
  );
};

export default Layout;
