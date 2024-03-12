
export type LoadingAction = {
    type: "ENABLE" | "DISABLE"
}

const loadingReducer = (state: boolean, action: LoadingAction) => {
    switch (action.type) {
        case "ENABLE":
            return true;
        case "DISABLE":
            return false;
    }

}

export default loadingReducer;
