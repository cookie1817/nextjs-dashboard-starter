"use client";
import Box from "@mui/material/Box";

import { DarkModeSwitch } from "@/components/navbar/darkmodeswitch";
import LanguageSwitcher from '@/components/languageSwitcher';

function headerBar() {
  return (
    <div className="flex items-center justify-end">
        <Box className="px-12 pt-1" display="flex" alignItems="center">
            <LanguageSwitcher customStyle='mr-8'/>
            <DarkModeSwitch />
        </Box>
    </div>
  );
}
export default headerBar;
