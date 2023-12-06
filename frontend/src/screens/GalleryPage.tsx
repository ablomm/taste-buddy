import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import BackButton from '../components/BackButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import TBButton from '../components/TBButton';
import * as MediaLibrary from 'expo-media-library';
import { PagedInfo, Asset } from 'expo-media-library';

const windowWidth= Dimensions.get('window').width;
const windowHeight= Dimensions.get('window').height;
console.log(windowWidth)
const GalleryPage = ({navigation}:any) => {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [images, setImages] = useState<Asset[]>([]);
    const [pickedImage, setPickedImage] = useState<Asset>();

    const askPermission = async()=>{
        const isCameraRollEnabled = await MediaLibrary.getPermissionsAsync();
        if(isCameraRollEnabled.granted){
            // if true set component visiblie to true
            setHasPermission(true);
            return;
        }
        const {granted}= await MediaLibrary.requestPermissionsAsync();
        if(granted){
            const cameraRollRes = await MediaLibrary.getPermissionsAsync();
            setHasPermission(true);
        }else{
            navigation.goBack();
        }
    }
    const getCameraRoll = async()=>{
        const albumName="Camera";
        const getPhotos = await MediaLibrary.getAlbumAsync(albumName);
        const getAllPhotos = await MediaLibrary.getAssetsAsync({
            first:20,
            album: getPhotos,
            sortBy: ['creationTime'],
            mediaType: ['photo']
        })
        return getAllPhotos;
    }

    useEffect(() => {
        askPermission();
        if(hasPermission) {
            getCameraRoll().then((i: PagedInfo<Asset>)=>{
                setImages(i.assets);
            }).catch((error)=>{
                console.error(error);
            });
        }
    }, [hasPermission]);

    function displayImages(){
        return images.map((item)=>{
            return(<View><Image style={styles.image} source={{uri:item.uri}} ></Image></View>)
        });
    }

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
                <View style={styles.galleryImagesWrapper}>
                    {displayImages()}
                </View>
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
            backgroundColor: '#fff'
        },
        galleryImagesWrapper:{
            display:"flex",
            flexDirection:"row",
            flexWrap:'wrap',
        },
        image:{
            width: windowWidth/4,
            height:windowWidth/4,
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
            paddingHorizontal: 12,
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