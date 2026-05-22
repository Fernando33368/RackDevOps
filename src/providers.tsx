import { type ReactNode, createContext, useState } from 'react';


type ThemeType = "dark" | "light";

export const AppContext = createContext({
    theme: "dark" as ThemeType,
    toggleTheme: ()=>{},
});


export function AppProviders({
    children
}:{
    children: ReactNode
}){

    const [theme,setTheme]=useState<ThemeType>("dark");

    const toggleTheme=()=>{
        setTheme(
            theme==="dark"
            ? "light"
            : "dark"
        );
    };

    return(

        <AppContext.Provider
            value={{
                theme,
                toggleTheme
            }}
        >

            <div className={theme}>
                {children}
            </div>

        </AppContext.Provider>

    );

}