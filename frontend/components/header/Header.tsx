import React from "react";
import {View, Text, StyleSheet, Image, Pressable} from "react-native";

const Header = ({navigation}:any) =>{
    return(
        <View style={styles.container}>
            <Pressable style={({pressed}) => [{backgroundColor: pressed ? '#BDBDBD' : 'white',} ,styles.buttonContainer]} onPress={() => navigation.goBack()}>
                <Text style={styles.buttonText}>{`<<`}</Text>
            </Pressable>
            
            <View style={styles.logoContainer}>
                <Image source={require("../../assets/logo/Logo.png")} style={styles.logoImage}/>
            </View>
        </View>
        
    );
}
export default Header;

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    logoContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    logoImage: {
        width: 193,
        height: 61,
    },
    buttonContainer:{
        height: 60,
        width: 30,
        float:'left',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 'auto', 
    },
    buttonText: {
        fontSize:16,
        lineHeight:19,
        textAlign: 'center',
        fontWeight: "600",
    }
});