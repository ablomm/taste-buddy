import { ActivityIndicator, StyleSheet } from "react-native";
import React from "react";
import { LoadingContext } from "../providers/LoadingProvider";

const LoadingIcon = (props) => {
    const loadingContext = React.useContext(LoadingContext) as any;

    return (
        <>
            {loadingContext.state && <ActivityIndicator style={styles.loading} color={"#fff"} />}
        </>
    )
}

const styles = StyleSheet.create({
    loading: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    }
})

export default LoadingIcon;