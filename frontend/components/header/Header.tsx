import React from "react";
import {View, Text, StyleSheet, Image} from "react-native";

const Header = () =>{
    return(
        <View style={styles.logoContainer}>
            <Image source={require("../../assets/logo/Logo.png")} height={61} width={193}/>
        </View>
    );
}
export default Header;

const styles = StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
});