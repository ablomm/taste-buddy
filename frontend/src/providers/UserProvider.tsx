import userReducer, { initialState, UserState } from "../reducers/UserReducer";
import React, { createContext, useReducer } from "react";

export const UserContext = createContext(undefined);

const UserProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(userReducer, initialState);

    const value = {
        state: state,

        login: (username: string, userId: number) => {
            dispatch({
                type: "LOGIN",
                payload: { username, userId }
            });
        },

        logout: () => {
            dispatch({
                type: 'LOGOUT',
            });
        }

    }

    return <UserContext.Provider value={value as any}>{children}</UserContext.Provider>;
};

export default UserProvider;
