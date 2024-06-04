import React from "react";
import { useTheme as useNextTheme } from "next-themes";
import { useColorScheme } from "@mui/material/styles";
import { Switch } from "@nextui-org/react";

export const DarkModeSwitch = () => {
  const { setTheme, resolvedTheme } = useNextTheme();
  const { setMode } = useColorScheme();

  return (
    <Switch
      isSelected={resolvedTheme === "dark" ? true : false}
      onValueChange={(e) => {
        setTheme(e ? "dark" : "light")
        setMode(e ? "dark" : "light");
      }}
    />
  );
};
