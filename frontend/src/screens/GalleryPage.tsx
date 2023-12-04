import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import BackButton from '../components/BackButton';

const GalleryPage = ({navigation}:any) => {

    return(
        <View style={styles.container}>
            <View style={styles.headerWrapper}>
                <View>
                    <View><BackButton navigation = {navigation}/></View>
                    <View><Text>Gallery</Text></View>
                </View>
                <View>
                    <View></View>
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
            flex: 1
        },
        headerWrapper:{
            display: 'flex',
            flexDirection:"row",
            justifyContent:"space-between",
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