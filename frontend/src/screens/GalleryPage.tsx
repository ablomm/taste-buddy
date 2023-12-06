import React, { useState, useEffect, useCallback } from 'react';
import { Alert, Linking } from 'react-native';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Dimensions, TouchableOpacity } from 'react-native';
import BackButton from '../components/BackButton';
import Icon from 'react-native-vector-icons/FontAwesome';
import TBButton from '../components/TBButton';
import * as MediaLibrary from 'expo-media-library';
import { PagedInfo, Asset } from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { ToggleButton } from 'react-native-paper';

const windowWidth= Dimensions.get('window').width;
const windowHeight= Dimensions.get('window').height;

const GalleryPage = ({navigation}:any) => {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [images, setImages] = useState<Asset[]>([]);
    const [pickedImage, setPickedImage] = useState<Asset>();
    const [value, setValue] = React.useState('left');
    
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
    const getCameraRoll = async(lastImage?:string)=>{
        const getAllPhotos = await MediaLibrary.getAssetsAsync({
            first:36,
            after:lastImage,
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
                setPickedImage(i.assets[0]);
            }).catch((error)=>{
                console.error(error);
            });
        }
    }, [hasPermission]);

    function imagePressed(item: Asset){
        setPickedImage(item);
    }
    
    function displayImages(){
        return images.map((item, key)=>{
            return(
            <TouchableOpacity key={key} onPressIn={()=>{imagePressed(item)}} >
                <Image style={[{opacity: pickedImage == item  ? 0.5 : 1},styles.image]} source={{uri:item.uri}} ></Image>
                {pickedImage == item && <Icon style={styles.pickedImageIcon} name = 'check-circle'/>}
            </TouchableOpacity>)
        });
    }

    return(
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View style={styles.headerLeftWrapper}>
                    <View><BackButton navigation = {navigation}/></View>
                    <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>Select an Image {`<_<`}</Text></View>
                </View>
                <View>
                    <TBButton title="next >>" style={styles.nextButton} textColor={{ color: "white" }}  />
                </View>
            </View>
            <View style={styles.pickedImageWrapper}>
                <Image style={styles.pickedImage} source={{uri:pickedImage?.uri}}/>
            </View>
            <ToggleButton.Row onValueChange={value => setValue(value)} value={value}>
                <ToggleButton icon="Post" value="left" />
                <ToggleButton icon="format-align-right" value="right" />
            </ToggleButton.Row>
            <ScrollView>
                <View style={styles.galleryImagesWrapper}>
                    {displayImages()}
                </View>
            </ScrollView>
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
            width: (windowWidth-32)/3,
            height:(windowWidth-32)/3,
            borderRadius: 8,
            margin:5
            
        },
        pickedImageIcon:{
            color:"#0029FF",
            alignItems:"center",
            position:"absolute",
            top: "20%",
            left: "20%",
            fontSize: 70,
        },
        pickedImage:{
            height:windowHeight/2,
            width:windowHeight/2
        },
        pickedImageWrapper:{
            paddingBottom:5,
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