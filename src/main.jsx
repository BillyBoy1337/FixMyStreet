import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import { extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@material-tailwind/react";
import { PrimeReactProvider } from 'primereact/api';
// import 'primeflex/primeflex.css';
// import 'primereact/resources/primereact.css';
// import 'primereact/resources/themes/lara-light-indigo/theme.css';
// import 'primeicons/primeicons.css';

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const theme = extendTheme({ config });

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <PrimeReactProvider>
                <ThemeProvider>
                    <ChakraProvider theme={theme}>
                        <App />
                    </ChakraProvider>
                </ThemeProvider>
            </PrimeReactProvider>
        </BrowserRouter>
    </React.StrictMode>
);