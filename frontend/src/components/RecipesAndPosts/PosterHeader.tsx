import React from 'react';
import { View, Text, StyleSheet, Image} from "react-native";
import {IconButton} from "react-native-paper";

const PosterHeader = ({ owner, editFunction }) => {
    return(
        <View style={styles.container}>
            <View style={styles.subContainer}>
                <Image source={require("../../../assets/no-image.png")} style={styles.profileImage}/>
                <Text style={styles.profileUsername}>username</Text>
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
