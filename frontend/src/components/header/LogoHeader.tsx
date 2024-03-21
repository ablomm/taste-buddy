import React from "react";
import { View, Image } from "react-native";

const LogoHeader = () => {
    return (
        <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center'}}>
            <Image
                source={require("../../../assets/logo/Logo.png")}
                style={{ height: 42.7, width: 135.1, marginTop: 5}}
            />
        </View>
    )

};
export default LogoHeader;
