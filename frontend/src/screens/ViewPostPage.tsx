import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import BackButton from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import { getUserDetails } from '../functions/HTTPRequests';
const fallbackProfilePicture = require("../../assets/profile.jpg");

const ViewPostPage = ({ route }) => {
    let post = route.params;
    let navigation = useNavigation();
    let [user, setUser] = React.useState({ username: "Unknown", profilePic: "" });

    useEffect(() => {
        let authorId = post.userId ? post.userId : post.author;
        async function setUserDetails() {
            setUser(await getUserDetails(authorId))
        }
        setUserDetails();
    }, [])

    return (
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View style={styles.headerLeftWrapper}>
                    <View><BackButton navigation={navigation} /></View>
                    <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>View Post</Text></View>
                </View>
            </View>
            <ScrollView style={{ padding: 10 }}>
            <View style={styles.userBar}>
                    <Image source={user.profilePic ? {uri: user.profilePic} : fallbackProfilePicture} style={styles.profilePicture} />
                    <Text style={styles.username}>{user.username}</Text>
                </View>
                <Image style={styles.image} source={{ uri: post.image }} />
                <Text style={styles.description}>{post.description}</Text>
            </ScrollView>
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:5,
        backgroundColor: '#fff',
    },
    image: {
        width: "100%",
        height: 300,
        alignSelf: "center",
        marginBottom: 10,
        borderRadius: 10
    },
    header: {
        color: "#000",
        fontSize: 20,
        fontWeight: "700",
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userBar: {
        display: "flex",
        margin: 10,
        flexDirection: "row",
        alignItems: 'center'
    },
    username: {
        margin: 10,
        color: "#000",
        fontSize: 20,
        fontWeight: "700",
    },
    headerWrapper: {
        alignItems: 'center',
        height: 60,
        backgroundColor: "white",
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 12,
    },
    headerLeftWrapper: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: "row",
    },
    headerTiltleWrapper: {
        marginLeft: 15
    },
    headerTiltle: {
        color: "#000",
        fontSize: 20,
        fontWeight: "700",
    },
    description: {
        fontSize: 20,
        margin: 10,
    }
});

export default ViewPostPage;