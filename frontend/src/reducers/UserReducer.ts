export type UserState = {
    isSignedIn: boolean,
    username: string | null,
}

export type UserAction = {
    type: "LOGIN" | "LOGOUT"
    payload?: any
}

export const initialState = {
    isSignedIn: false,
    username: null,
}

const userReducer = (state: UserState, action: UserAction) => {
    switch (action.type) {
        case "LOGIN":
            return handleLogin(action);
        case "LOGOUT":
            return handleLogout(action);
    }

}

const handleLogin = (action: UserAction) => {
    return {...action.payload, isSignedIn: true};
}

const handleLogout = (action: UserAction) => {
    return initialState;
}

export default userReducer;