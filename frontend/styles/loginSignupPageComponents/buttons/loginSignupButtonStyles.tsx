import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        //flex: 1,
        paddingHorizontal: 12,
        paddingVertical: 10,
        alignItems: 'center',
    },
    button:{
        height: 50,
        width: 340,
        borderRadius: 100,
        borderWidth: 2,
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize:16,
        lineHeight:19,
        fontWeight: "600"
    }
});

export default styles;
