import DayNightToggle from 'react-day-and-night-toggle'
import { useColorScheme } from "@mui/material/styles";



const ThemeSwitchButton = () => {
  const { colorScheme, setMode } = useColorScheme();

  return (
    <DayNightToggle
      size={26}
      onChange={() => setMode(colorScheme === "light" ? "dark" : "light")}
      checked={colorScheme === "dark"}
    />
  );
};

export default ThemeSwitchButton;
