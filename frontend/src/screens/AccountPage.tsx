import React from 'react';
import { View, Text } from 'react-native';
import LogoutButton from "../components/loginSignupPageComponents/buttons/LogoutButton";
import {UserContext} from "../providers/UserProvider";

const AccountPage = () => {
    const userContext = React.useContext(UserContext) as any;

    return (
        <View>
            <Text>
                Account Page
            </Text>
            <LogoutButton handlePress={userContext.logout} isButtonInteractable={true}/>
        </View>
    );
}

export default AccountPage;