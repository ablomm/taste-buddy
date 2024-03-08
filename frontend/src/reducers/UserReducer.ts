export type UserState = {
    isSignedIn: boolean,
    username: string | null,
    userId: number | null
}

export type UserAction = {
    type: "LOGIN" | "LOGOUT"
    payload?: any
}

export const initialState = {
    isSignedIn: false,
    username: null,
    userId: null
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

const handleLogout = async(action: UserAction) => {
    await logout();
    return initialState;
}

const logout = async() => {
    try {
        let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/authorize/logout`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
        });

        if(response.status != 200) {
            console.log(`Status ${response.status}\nSomething went wrong!`);
        } else {
            console.log('Successfully logged out!');
        }
    } catch (error) {
        console.error(error);
    }
}

export default userReducer;
