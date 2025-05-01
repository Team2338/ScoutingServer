import { Palette } from "@mui/icons-material";
import { IconButton, useColorScheme } from "@mui/material";

function ColorSchemeButton() {
    const { colorScheme, setColorScheme } = useColorScheme();

    const handleColorSchemeToggle = () => {
		setColorScheme(colorScheme == 'light' ? 'dark' : 'light');
	};

    return (
        <IconButton
            color="inherit"
            onClick={ handleColorSchemeToggle }
        >
            <Palette/>
        </IconButton>
    )
}

export default ColorSchemeButton;
