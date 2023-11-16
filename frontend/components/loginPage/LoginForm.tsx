import {View, Text, StyleSheet, TextInput, Button} from "react-native";

const LoginForm = () =>{
    return(
        <View >
            <TextInput/>
            <TextInput/>
            <Button title = 'Log In'/>
        </View>
    );
}
export default LoginForm;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 43,
        paddingHorizontal: 12,
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
});