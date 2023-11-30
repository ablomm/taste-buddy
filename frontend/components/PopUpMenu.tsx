import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Pressable, Modal } from "react-native";

const PopUpMenu = ({ visible, setVisible, children }: any) => {

    return (
        <>
            <Modal
                animationType='fade'
                transparent={true}
                visible={visible}
                onRequestClose={() => setVisible(false)}>

                <View style={styles.background}>
                    <View style={styles.foreground}>
                        {children}
                    </View>
                </View>

            </Modal>
        </>
    )

}

const styles = StyleSheet.create({
    background: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0,0,0,0.5)",
        width: '100%',
        height: 'auto',
        flex: 1
    },
    foreground: {
        backgroundColor: '#EEEEEE',
        borderRadius: 20,
        width: "95%",
        padding: 30
        //box sizing border box
    }
})

export default PopUpMenu;