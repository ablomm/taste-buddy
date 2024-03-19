import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image} from "react-native";
import {IconButton} from "react-native-paper";
import { getUserDetails } from '../../functions/HTTPRequests';
const fallbackProfilePicture = require("../../../assets/profile.jpg");

const PosterHeader = ({ userId, owner, editFunction }) => {
    let [user, setUser] = React.useState({ username: "Unknown", profilePic: "" });

    useEffect(() => {
        async function setUserDetails() {
            setUser(await getUserDetails(userId))
        }
        setUserDetails();
    }, [userId])
    
    return(
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Image source={user.profilePic ? {uri: user.profilePic} : fallbackProfilePicture} style={styles.profileImage}/>
                <Text style={styles.profileUsername}>{user.username}</Text>
            </View>
            { owner ?
                <View>
                    <IconButton icon="pencil"
                                size={16}
                                onPress={editFunction} />
                </View>
                :
                null
            }
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent: 'space-between',
        margin: 5,
        alignItems: 'center'
    },
    subContainer: {
        flexDirection:'row',
        alignItems: 'center'
    },
    profileImage: {
        width:35,
        height:35,
        borderRadius: 50,
        marginLeft:6
    },
    profileUsername:{
        marginLeft:5,
        fontWeight:'400',
        //fontFamily: 'Damion'
    }
});
export default PosterHeader;
