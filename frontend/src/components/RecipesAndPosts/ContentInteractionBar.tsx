import Icon from 'react-native-vector-icons/FontAwesome';
import React,{useState} from 'react';
import { View,  StyleSheet, TouchableOpacity } from "react-native";

const ContentInteractionBar = ({savedStatus}:any) => {
    const [isSaved, setSaved] = useState(savedStatus);
    return(
        <View style={styles.container}>
            <TouchableOpacity>
                <Icon name="share-square" style={styles.icon}></Icon>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{
                    isSaved? setSaved(false):setSaved(true);
                }}>
                <Icon name="bookmark" style={[styles.icon, {color: isSaved?"#00D387":"#d3d3d3"}]}/>
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent:'flex-end'
    },
    icon:{
        width: 30,
        height: 30,
        fontSize:27,
        marginLeft:8,
        color:"#00D387"
    }
});
export default ContentInteractionBar;