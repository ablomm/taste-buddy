import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Modal, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Header from '../components/header/Header';
import PosterHeader from '../components/RecipesAndPosts/PosterHeader';
import {IconButton} from "react-native-paper";
import TBButton from '../components/TBButton';
import { deletePost } from '../functions/HTTPRequests';
import { LoadingContext } from '../providers/LoadingProvider';

const ViewPostPage = ({ route }) => {
    let post = route.params;
    const [optionsModalVisible, setOptionsByModalVisible] = useState<boolean>(false);
    let userId = post.userId ? post.userId : post.author
    const loadingContext = React.useContext(LoadingContext) as any;


    function moreOptionsButton() {
        return(<IconButton icon="dots-vertical"
        size={20}
        onPress={()=>setOptionsByModalVisible(true)} />)
    }
    
    return (
        <View style={styles.container}>
            <Header title = "View Post" />
            <ScrollView style={{ padding: 10 }}>
                <PosterHeader userId = {userId}  personalComponent={moreOptionsButton}/>
                <Image style={styles.image} source={{ uri: post.image }} />
                <Text style={styles.description}>{post.description}</Text>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={optionsModalVisible}
                onRequestClose={() => setOptionsByModalVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setOptionsByModalVisible(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TBButton style={{padding:5, width:150, backgroundColor:'#FFCCCC'}} textColor={{  fontWeight:"700" }} 
                            onPress={async () => {
                                loadingContext.enable();
                                await deletePost(userId, post.id).then(loadingContext.disable())
                                setOptionsByModalVisible(false)
                            }} title="Delete"/>
                            <TBButton style={{padding:5, width:150}} onPress={() => setOptionsByModalVisible(false)} title="Cancel"/>
                        </View>
                    </View>
                </ TouchableWithoutFeedback>
            </Modal>
        </View>

    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:5,
        backgroundColor: '#fff',
    },
    image: {
        width: "100%",
        height: 300,
        alignSelf: "center",
        marginBottom: 10,
        borderRadius: 10
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    header: {
        color: "#000",
        fontSize: 20,
        fontWeight: "700",
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25
    },
    userBar: {
        display: "flex",
        margin: 10,
        flexDirection: "row",
        alignItems: 'center'
    },
    username: {
        margin: 10,
        color: "#000",
        fontSize: 20,
        fontWeight: "700",
    },
    description: {
        fontSize: 20,
        margin: 10,
    }
});

export default ViewPostPage;