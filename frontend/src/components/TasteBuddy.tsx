import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, SafeAreaView } from 'react-native';
import Navigation from "../components/Navigation";
import UserProvider, { UserContext } from '../providers/UserProvider';

const checkJWT = async (userContext: any) => {
    try {
        let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL}/authorize`, {
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
            userContext.login('placeholder');
        }
    } catch (error: any) {
        console.error(error.stack);
    }
}

const TasteBuddy = () => {
    const userContext = React.useContext(UserContext) as any;

    React.useEffect(() => {
        checkJWT(userContext);
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <Navigation />
            <StatusBar style="auto" />
        </SafeAreaView>
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