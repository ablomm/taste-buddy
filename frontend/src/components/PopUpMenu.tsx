import React from 'react';
import { View, StyleSheet } from "react-native";
import Modal from "react-native-modal";


const PopUpMenu = ({ visible, setVisible, children }: any) => {

    return (
        <>
            <Modal
                isVisible={visible}
                onBackdropPress={() => setVisible(false)}
                style = {styles.modal}>

                    <View style={styles.foreground}>
                        {children}
                    </View>

            </Modal>
        </>
    )

}

const styles = StyleSheet.create({

    foreground: {
        backgroundColor: '#EEEEEE',
        borderRadius: 20,
        width: "95%",
        padding: 30
        //box sizing border box
    },
    modal: {
        width: '100%',
        height: '100%'
    }
})

export default PopUpMenu;