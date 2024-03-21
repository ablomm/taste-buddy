import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView , View, Image, Text} from 'react-native';
import Navigation from "../components/Navigation";
import UserProvider, { UserContext } from '../providers/UserProvider';
import LoadingIcon from './LoadingIcon';

const TasteBuddy = () => {
    const userContext = React.useContext(UserContext) as any;

    const checkJWT = async (userContext: any) => {
        try {
            let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/authorize`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            if (response.status !== 200) {
                console.log("account authenication failed; JWT invalid");
            } else {
                console.log("account authenication successful");
                const json = await response.json()
                userContext.login(json.username, json.id);
            }
        } catch (error: any) {
            console.error(error.stack);
        }
    }

    React.useEffect(() => {
        checkJWT(userContext);
    }, [])

    const username = userContext.state.username;

    return (
        <>
            <LoadingIcon />
            <SafeAreaView style={styles.container}>
                <Navigation />
                <StatusBar style="auto" />
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25, // This is to keep some space clear at the top, as phones usually have a status bar there
        flex: 1,
        backgroundColor: '#fff',
    },
});

export default TasteBuddy;
