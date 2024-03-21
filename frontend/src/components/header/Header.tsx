import React from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import BackButton from "../BackButton";
import { useNavigation } from '@react-navigation/native';

const Header = ({ title }: any) => {
    let navigation = useNavigation();

    return (
        <View style={styles.headerWrapper}>
            <View style={styles.headerLeftWrapper}>
                <View><BackButton navigation={navigation} /></View>
                <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>{title}</Text></View>
            </View>
        </View>

    );
}
export default Header;

const styles = StyleSheet.create({
    headerWrapper: {
        alignItems: 'center',
        paddingTop: 10,
        height: 35,
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
        fontSize: 17,
        fontWeight: "700",
    },
});