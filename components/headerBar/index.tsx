"use client";
import Box from "@mui/material/Box";

import ThemeSwitchButton from '@/components/themeSwitchButton';
import LanguageSwitcher from '@/components/languageSwitcher';

function headerBar() {
  return (
    <div className="flex items-center justify-end">
        <Box className="px-12 pt-1" display="flex" alignItems="center">
            <LanguageSwitcher />
            <ThemeSwitchButton />
        </Box>
    </div>
  );
}
export default headerBar;
