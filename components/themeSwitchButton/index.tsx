import DayNightToggle from 'react-day-and-night-toggle'
import { useColorScheme } from "@mui/material/styles";
import { useTheme as useNextTheme } from "next-themes";


const ThemeSwitchButton = () => {
  const { colorScheme, setMode } = useColorScheme();
  const { setTheme, resolvedTheme } = useNextTheme();

  return (
    <DayNightToggle
      size={26}
      onChange={() => {
        setMode(colorScheme === "light" ? "dark" : "light");
        setTheme(resolvedTheme === "light" ? "dark" : "light")
      }}
      checked={colorScheme === "dark"}
    />
  );
};

export default ThemeSwitchButton;
