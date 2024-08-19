// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext({
//     user: undefined,
//     setUser: () => {},
//     loading: true,
//     setLoading: () => {},
// });

// export function AuthContextProvider({ children }) {
//     const [user, setUser] = useState();
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const localUser = localStorage.getItem("user");

//         if (localUser) {
//             const userData = JSON.parse(localUser);
//             setUser(userData);
//         }

//         setLoading(false);
//     }, []);

//     return (
//         <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }

// export function useAuth() {
//     const context = useContext(AuthContext);
//     return { ...context };
// }
