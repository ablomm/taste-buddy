import React from "react";
import {View, Text, StyleSheet, Image, Pressable} from "react-native";
import BackButton from "../BackButton";

const Header = ({navigation}:any) =>{
    return(
        <View style={styles.container}>
            <BackButton navigation = {navigation}/>
            
            <View style={styles.logoContainer}>
                <Image source={require("../../../assets/logo/Logo.png")} style={styles.logoImage}/>
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
});