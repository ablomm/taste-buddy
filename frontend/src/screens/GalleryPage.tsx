import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import TBButton from '../components/TBButton';
import * as MediaLibrary from 'expo-media-library';
import { PagedInfo, Asset } from 'expo-media-library';
import LogoHeader from "../components/header/LogoHeader";

const windowWidth= Dimensions.get('window').width;
const windowHeight= Dimensions.get('window').height;

const GalleryPage = ({navigation}:any) => {
    const [hasPermission, setHasPermission] = useState<boolean>(false);
    const [images, setImages] = useState<Asset[]>([]);
    const [pickedImage, setPickedImage] = useState<Asset>();
    const [isPostSelected, setIsPostSelected] = useState<boolean>(true);
    
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
        const getCount = await MediaLibrary.getAssetsAsync({
            first:1,
            after:lastImage,
            sortBy: ['creationTime'],
            mediaType: ['photo']
        })
        const getAllPhotos = await MediaLibrary.getAssetsAsync({
            first:getCount.totalCount,
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
                console.log(i.assets[0])
                setPickedImage(i.assets[0]);
            }).catch((error)=>{
                console.error(error);
            });
        }
    }, [hasPermission]);

    function imagePressed(item: Asset){
        setPickedImage(item);
    }
    
    const displayImage = ({ item }) => (
        <TouchableOpacity onPressIn={()=>{imagePressed(item)}} >
                <Image style={[{opacity: pickedImage == item  ? 0.5 : 1},styles.image]} source={{uri:item.uri}} ></Image>
                {pickedImage == item && <Icon style={styles.pickedImageIcon} name = 'check-circle'/>}
        </TouchableOpacity>
      );
    return(
        <View style={styles.container}>
            <LogoHeader/>
            <View style={styles.headerWrapper}>
                <View style={styles.headerLeftWrapper}>
                    <View style={styles.headerTiltleWrapper}><Text style={styles.headerTiltle}>Select an Image {`<_<`}</Text></View>
                </View>
                <View>
                    <TBButton title="next >>" onPress={()=>{isPostSelected?navigation.push('CreatePostPage', { pickedImage }):navigation.push('CreateRecipePage', { pickedImage })}} style={styles.nextButton} textColor={{ color: "white" }}  />
                </View>
            </View>
            <View style={styles.pickedImageWrapper}>
                <Image style={styles.pickedImage} source={{uri:pickedImage?.uri}}/>
            </View>
            <View style={styles.postType}>
                <View style={styles.postTypeSection}>
                    <TBButton title="Post"  style={styles.postTypeButton} textColor={[{ color: isPostSelected?"black":"#BDBDBD" }, styles.postTypeTitle]}  onPress={()=>setIsPostSelected(true)}/>
                </View>
                <View style={styles.postTypeSection}>
                    <TBButton title="Recipe" style={styles.postTypeButton} textColor={[{ color: isPostSelected?"#BDBDBD":"black" }, styles.postTypeTitle]} onPress={()=>setIsPostSelected(false)}/>
                </View>
            </View>
            <FlatList
                numColumns={3}
                style={styles.galleryImagesWrapper}
                data={images}
                renderItem={displayImage}
                keyExtractor={(item) => item.id}
                initialNumToRender={18}
                maxToRenderPerBatch={18}
                windowSize={10}
            />
                
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
            color:"green",
            alignItems:"center",
            position:"absolute",
            top: "20%",
            left: "20%",
            fontSize: 70,
        },
        pickedImage:{
            height:windowHeight/3,
            width:windowHeight/2
        },
        pickedImageWrapper:{
            paddingBottom:5,
        },
        nextButton: {
            flex: 1,
            flexGrow: 1,
            height: 40,
            backgroundColor: "#8CC84B",
            color: "white",
            borderWidth: 0,
        },
        postTypeButton:{
            backgroundColor: "white",
            borderWidth:0,
            margin: 0,
            height:30
        },
        headerWrapper:{
            alignItems: 'center',
            height: 60,
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
        postType:{
            display:"flex",
            flexDirection:"row",
            alignItems:"center"
        },
        postTypeSection:{
            flex:1,
            alignItems:"center",
            padding:10
        },
        postTypeTitle:{
            fontSize:18,
            fontWeight: "600",
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