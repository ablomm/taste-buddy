import React, { useState } from 'react';
import DietSelectionPage from './DietaryPreference';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform, Alert  } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TouchableRipple } from 'react-native-paper';
import BackButton from '../components/BackButton';
import TBButton from '../components/TBButton';
import { Formik } from 'formik';
import getBase64 from '../functions/GetBase64FromURI';
import { UserContext } from "../providers/UserProvider";
import { Buffer } from 'buffer';
import { LoadingContext } from '../providers/LoadingProvider';
import { putImage, saveProfilePicture } from '../functions/HTTPRequests';

const SettingsPage = ({navigation}:any) => {
    let currentProfilePicture;
    const [image, setImage] = React.useState<any>(currentProfilePicture ? currentProfilePicture : null);
    const userContext = React.useContext(UserContext) as any;
    const loadingContext = React.useContext(LoadingContext) as any;

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0] as any);
        }
    };
    
    return(
        <View style={styles.container}>
        <Formik
        initialValues={{
          //description: '',
          //recipeUrl: '',
        }}

        onSubmit={async () => {
          loadingContext.enable();

          try {
            if (!image.base64) {
              image.base64 = await getBase64(image.uri);
            }
            const buf = Buffer.from(image.base64, 'base64') //isolate the base64 buffer
            let type = image.uri.substring(image.uri.lastIndexOf('.') + 1, image.uri.length);
  
            let imageUrl = await putImage(buf, type)
  
            await saveProfilePicture(userContext.state.username, imageUrl)
  
            console.log("Save Profile Picture successful")
            navigation.navigate('AccountPageStack');

          } catch (error: any) {
            console.error("Error saving profile picture");
            console.error(error);
            Alert.alert("Error saving profile picture")

          } finally {
            loadingContext.disable();
          }
        }}>
        {({ handleSubmit, values }) => (
            <>
            <View style={styles.headerWrapper}>
              <View style={styles.headerLeftWrapper}>
                <BackButton navigation={navigation} />
                <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>Settings {`:)`}</Text></View>
              </View>
              <View>
                <TBButton title="save" style={styles.saveButton} textColor={{ color: "white" }} onPress={handleSubmit} />
              </View>
            </View>
            <View style={styles.imageUpdateContainer}>
                <TouchableRipple onPress={pickImage} borderless={true} style={styles.image}>
                    <Image source={image ? { uri: image.uri } : require("../../assets/profile.jpg") as any} style={{ width: "100%", height: "100%" }} />
                </TouchableRipple>
                <TouchableOpacity onPress={pickImage}><Text style={styles.imageButton}>Select Image</Text></TouchableOpacity>
            </View>
            </>
            )}
        </Formik>
        </View>
        
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        backgroundColor: '#fff',
    },
    imageUpdateContainer:{
        alignSelf: "center",
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 100,
        borderWidth: 5, 
        borderColor: '#6752EC',
    },
    imageButton: {
        height: 40,
        color: "#6752EC",
        alignSelf: "center",
        fontSize:20,
        lineHeight:19,
        fontWeight: "600", 
        padding:5
    },
    headerWrapper: {
        alignItems: 'center',
        height: 60,
        backgroundColor: "white",
        display: 'flex',
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 5,
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
        fontSize: 20,
        fontWeight: "700",
    },
    saveButton: {
        height: 40,
        backgroundColor: "#6752EC",
        borderWidth: 0,
      },
})

export default SettingsPage;