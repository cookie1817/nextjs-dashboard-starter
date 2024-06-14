"use client";
import { PropsWithChildren } from "react";

import Image from 'next/image';
import Box from "@mui/material/Box";

import { DarkModeSwitch } from '@/components/navbar/darkmodeswitch';
import LanguageSwitcher from '@/components/languageSwitcher';

// assets
import Logo from '@/public/logo.png'; // Import your logo


function Provider(props: PropsWithChildren<{}>) {

  return (
    <div className="flex h-screen">
      <div className="flex-1 bg-gray-200 flex items-center justify-center" style={{ background: 'black' }}>
        <Image src={Logo} alt="Logo" className="w-86" />
      </div>
      <div className="flex-1 block">
        <div className="flex items-center justify-end">
          <Box className="px-12 pt-1" display="flex" alignItems="center">
            <LanguageSwitcher customStyle='mr-8'/>
            <DarkModeSwitch />
          </Box>
        </div>
        <div className="flex-1 flex items-center justify-center w-full h-5/6">
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default function welcomPageProvider(props: PropsWithChildren<{}>) {
  return (
    <Provider>
      {props.children}
    </Provider>
  );
}
