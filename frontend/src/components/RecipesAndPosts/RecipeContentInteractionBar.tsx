import Icon from 'react-native-vector-icons/FontAwesome';
import React,{useState} from 'react';
import { View,  StyleSheet, TouchableOpacity } from "react-native";
import StarRating from 'react-native-star-rating-widget';
import ContentInteractionBar from './ContentInteractionBar';

const RecipeContentInteractionBar = ({savedStatus}:any) => {
    //const [rating, setRating] = useState(0);
    return(
        <View style={styles.container}>
            <StarRating
                rating={2} //placeholder avrg rating
                onChange={()=>{}}
                maxStars = {5}
                starSize={27}
            />
            <ContentInteractionBar/>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection:'row',
        justifyContent:'space-between'
    },
});
export default RecipeContentInteractionBar;