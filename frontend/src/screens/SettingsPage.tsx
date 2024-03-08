import React, { useState } from 'react';
import DietSelectionPage from './DietaryPreference';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { TouchableRipple } from 'react-native-paper';
import BackButton from '../components/BackButton';
import TBButton from '../components/TBButton';
import { Formik } from 'formik';
import getBase64 from '../functions/GetBase64FromURI';
import { UserContext } from "../providers/UserProvider";
import { Buffer } from 'buffer';

const SettingsPage = ({navigation}:any) => {
    let currentProfilePicture;
    const [image, setImage] = React.useState<any>(currentProfilePicture ? currentProfilePicture : null);
    const userContext = React.useContext(UserContext) as any;
    
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
          let imageUrl: string = "";
          let s3AccessUrl: any;
          let s3Response: any;

          try {
            s3AccessUrl = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/s3/s3GenerateUrl`, {  //get secure s3 access url
              method: 'GET',
            }).then(res => res.json());
          } catch (error: any) {
            console.log("image link generation error")
            console.log(error)
          }

          if (s3AccessUrl) {
            if(!image.base64){
              image.base64 = await getBase64(image.uri);
            }
            const buf = Buffer.from(image.base64, 'base64') //isolate the base64 buffer
            let type = image.uri.substring(image.uri.lastIndexOf('.') + 1, image.uri.length);

            try {
              s3Response = await fetch(s3AccessUrl.imageURL[0], {  //put the image on the bucket
                method: 'PUT',
                headers: {
                  'ContentEncoding': 'base64',
                  'Content-Type': `image/${type}`,
                },
                body: buf
              });

              if (s3Response.status !== 200) {
                console.log("s3Response, s3 error")
                console.log(s3Response);
              } else {
                imageUrl = s3AccessUrl.imageURL[0].split('?')[0];
                console.log("uploaded image url: " + imageUrl);
              }
            } catch (error: any) {
              console.log("image put failed")
              console.log(error)
            }
          } else {
            console.log("imageURL is null")
          }
          try {
            // Save Profile changes
            let response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/user/update-profile/profilePic`, {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: JSON.stringify({
                username: userContext.state.username,
                profilePic: imageUrl
              }),
            });

            if (response.status !== 200) {
              console.log("upload failed")
              console.log(response)
            } else {
              console.log("upload successful")
            }

            navigation.navigate('AccountPageStack');
          } catch (error: any) {
            console.log("upload error")
            console.error(error.stack);
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