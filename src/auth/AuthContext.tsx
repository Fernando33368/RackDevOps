import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

interface Usuario {

    id:number;

    nombre:string;

    correo:string;

}

interface AuthContextType{

    user:Usuario | null;

    token:string | null;

    login:(usuario:Usuario,token:string)=>void;

    logout:()=>void;

    register:(usuario:Usuario,token:string)=>void;

}

const AuthContext=createContext<AuthContextType | null>(null);

export function AuthProvider({children}:{children:React.ReactNode}){

    const [user,setUser]=useState<Usuario | null>(null);

    const [token,setToken]=useState<string | null>(null);

    useEffect(()=>{

        const savedToken=localStorage.getItem("token");

        const savedUser=localStorage.getItem("user");

        if(savedToken && savedUser){

            setToken(savedToken);

            setUser(JSON.parse(savedUser));

        }

    },[]);

    const login=(usuario:Usuario,nuevoToken:string)=>{

        setUser(usuario);

        setToken(nuevoToken);

        localStorage.setItem("token",nuevoToken);

        localStorage.setItem("user",JSON.stringify(usuario));

    };

    const register=(usuario:Usuario,nuevoToken:string)=>{

        login(usuario,nuevoToken);

    };

    const logout=()=>{

        setUser(null);

        setToken(null);

        localStorage.removeItem("token");

        localStorage.removeItem("user");

    };

    return(

        <AuthContext.Provider

            value={{

                user,

                token,

                login,

                logout,

                register

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth(){

    const context=useContext(AuthContext);

    if(!context){

        throw new Error("useAuth debe usarse dentro de AuthProvider");

    }

    return context;

}