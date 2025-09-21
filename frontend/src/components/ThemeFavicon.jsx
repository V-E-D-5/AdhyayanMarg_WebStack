import { useEffect } from "react";
import { useTheme } from "../contexts/ThemeContext";

const ThemeFavicon = () => {
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const updateFavicon = () => {
      const favicon = document.querySelector('link[rel="icon"]');
      if (favicon) {
        favicon.href = isDarkMode ? "/favicon-dark.svg" : "/favicon.svg";
      }
    };

    updateFavicon();
  }, [isDarkMode]);

  return null; // This component doesn't render anything
};

export default ThemeFavicon;
