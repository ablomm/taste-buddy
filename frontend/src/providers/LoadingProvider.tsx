import LoadingReducer from "../reducers/LoadingReducer";
import userReducer, { initialState, UserState } from "../reducers/UserReducer";
import React, { createContext, useReducer } from "react";

export const LoadingContext = createContext(false);

const LoadingProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(LoadingReducer, false);

    const value = {
        state: state,

        enable: () => {
            dispatch({
                type: "ENABLE",
            });
        },

        disable: () => {
            dispatch({
                type: 'DISABLE',
            });
        }

    }

    return <LoadingContext.Provider value={value as any}>{children}</LoadingContext.Provider>;
};

export default LoadingProvider;
