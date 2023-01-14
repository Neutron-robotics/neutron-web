import { createTheme } from "@mui/material";

const neutronMuiThemeDefault = createTheme({
    palette: {
        primary: {
            main: '#0033A0',
            dark: '#001070',
            light: '#525CD2'
        },
        secondary: {
            main: '#2A0087',
            dark: '#000059',
            light: '#6133B8'
        },
        warning: {
            main: '#ED6C02',
            dark: '#E65100',
            light: '#FF9800'
        },
        error: {
            main: '#D32F2F',
            dark: '#C62828',
            light: '#EF5350'
        },
        success: {
            main: '#2E7D32',
            dark: '#1B5E20',
            light: '#4CAF50'
        }
    }
})

export default neutronMuiThemeDefault