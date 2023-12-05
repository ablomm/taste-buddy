import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Platform, PermissionsAndroid } from 'react-native';
import BackButton from '../components/BackButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import TBButton from '../components/TBButton';
//import { CameraRoll } from "@react-native-camera-roll/camera-roll";


const GalleryPage = ({navigation}:any) => {
    /*useEffect(() => {
        let params = {first:20};
        CameraRoll.getPhotos(params);
      }, []);*/

    return(
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View style={styles.headerLeftWrapper}>
                    <View><BackButton navigation = {navigation}/></View>
                    <View style={styles.headerTiltleWrapper}><Text><Text style={styles.headerTiltle}>Gallery</Text><Icon name ='angle-down'/></Text></View>
                </View>
                <View>
                    <TBButton title="next >>" style={styles.nextButton} textColor={{ color: "white" }}  />
                    {
                    //<View><Text>next {`>>`}</Text></View>
                    }
                </View>
            </View>
            <View>
                <Text>Picked Image</Text>
            </View>
            <ScrollView>
                <Text>Gallery Images</Text>
            </ScrollView>
            {
                //Im just copying the video for the section below
            }
            <View style={styles.footer}>
                <View style={styles.footerSection}>
                    <Text style={styles.footerTitle}>Gallery</Text>
                </View>
                <View style={styles.footerSection}>
                    <Text style={styles.footerTitle}>Photo</Text>
                </View>
                <View style={styles.footerSection}>
                    <Text style={styles.footerTitle}>Video</Text>
                </View>
            </View>
        </View>
    );
}
export default GalleryPage;

export const styles = StyleSheet.create(
    {
        container:{
            display:'flex',
            flex: 1,
            backgroundColor: '#fff',
            paddingHorizontal: 12,
        },
        nextButton: {
            flex: 1,
            flexGrow: 1,
            height: 40,
            backgroundColor: "#6752EC",
            color: "white",
            borderWidth: 0,
          },
        headerWrapper:{
            alignItems: 'center',
            display: 'flex',
            flexDirection:"row",
            justifyContent:"space-between",
        },
        headerLeftWrapper:{
            alignItems: 'center',
            display: 'flex',
            flexDirection:"row",
        },
        headerTiltleWrapper:{
            marginLeft: 15
        },
        headerTiltle:{
            color:"#000",
           // fontFamily:"Poppins",
            fontSize: 20,
            fontWeight: "700",
        },
        footer:{
            display:"flex",
            flexDirection:"row",
            alignItems:"center"
        },
        footerSection:{
            flex:1,
            alignItems:"center",
            padding:10
        },
        footerTitle:{
            fontSize:18,
            fontWeight: "600",
            color: "#BDBDBD"
        },
        pickedFooterSection:{
            flex:1,
            alignItems:"center",
            padding:10,
            borderBottomColor:"#000000",
            borderBottomWidth: 2,
            justifyContent: 'center'
        },
        pickedFooterTitle:{
            fontSize:18,
            fontWeight: "600",
            color:"#000000"
        }
    }
)