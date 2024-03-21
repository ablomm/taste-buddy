import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image} from "react-native";
import { getUserDetails } from '../../functions/HTTPRequests';
import { UserContext } from '../../providers/UserProvider';

const fallbackProfilePicture = require("../../../assets/profile.jpg");

const PosterHeader = ({ userId, personalComponent}) => {
    let [user, setUser] = useState({ username: "Unknown", profilePic: "" });
    let [owner, setOwner] = useState<boolean>(false);

    const userContext = React.useContext(UserContext) as any;
    
    useEffect(() => {
        async function setUserDetails() {
            setUser(await getUserDetails(userId))
        }
        setOwner(userId==userContext.state.userId);
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
                    {personalComponent()}
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
