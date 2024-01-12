import React,{useState} from 'react';
import { View, Text, TextInput, Button, FlatList, Image,StyleSheet, TouchableOpacity } from "react-native";
import StarRating from 'react-native-star-rating-widget';
import TBButton from '../TBButton';

let userDidntWriteAReview =true; //placeholder 

enum SortByOptions {
    RECENT = 'recent',
    OLDEST = 'oldest',
    HIGHEST_RATED = 'highest_rated',
    LOWEST_RATED = 'lowest_rated',
}

interface Review {
    userId: number;
    username: string;
    profilePicture: string;
    rating: number;
    reviewText: string;
    postingTime: string;
}

const RecipeReviews = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [newReview, setNewReview] = useState<string>('');
    const [rating, setRating] = useState<number>(0);
    const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.RECENT);

    const handleRatingChange = (newRating:number) => {
        // Validate the rating to be between 0.5 and 5
        if (newRating >= 0.5 && newRating <= 5) {
            setRating(newRating);
        }
    };

    const handleReviewSubmit = () => {
        if (true) { // Check if the user has already submitted a review
          const newReviewObj: Review = {
            userId: 1, //placeholder
            username: 'username',
            profilePicture: '../../assets/temp/tempfood.jpg',
            rating: rating,
            reviewText: newReview,
            postingTime: new Date().toLocaleString(),
          };
    
          setReviews([newReviewObj, ...reviews]);
        }
    };

    const loadMoreReviews = () => {
        
    };
    
    const sortReviews = () => {
        
    };

    return (
        <View>
    
          {/* Review Input Field */}
          {userDidntWriteAReview &&<View>
            <StarRating
                rating={rating}
                onChange={setRating}
                maxStars = {5}
                starSize={21}
            />
            <TextInput
              placeholder="Add a review"
              value={newReview}
              style={styles.reviewStyle}
              onChangeText={(text) => setNewReview(text)}
            />
            <TBButton title="post" style={styles.postButton} textColor={{ color: "white" }} onPress={handleReviewSubmit} />
          </View>}
    
          {/* Sort Reviews Button */}
          {reviews.length>0 && <TouchableOpacity onPress={sortReviews} style={{padding: 5}}>
            <Text style={{color:'#6752EC'}}>Sort Reviews</Text>
          </TouchableOpacity>}
    
          {/* Review List */}
          <FlatList
            data={reviews}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={{flexDirection:'row', paddingHorizontal: 5, paddingVertical: 12}}>
                <Image source={require('../../../assets/temp/tempfood.jpg')} style={{ width: 40, height: 40, borderRadius: 25 }} />
                <View style={{flexDirection:'column', marginLeft: 10}}>
                  <Text>{item.username}</Text>
                  <StarRating
                    rating={item.rating}
                    onChange={()=>{}}
                    maxStars = {5}
                    starSize={18}
                  />
                  <Text>{item.reviewText}</Text>
                  <Text style={{color:'#6E6E6E', fontSize: 12}}>{item.postingTime}</Text>
                </View>
              </View>
            )}
          />
    
          {/* Load More Reviews Button */}
          {reviews.length>0 && <TouchableOpacity onPress={loadMoreReviews} style={{padding: 5}}>
            <Text style={{color:'#6752EC'}}>Load More Reviews...</Text>
          </TouchableOpacity>}
        </View>
      );

}
const styles = StyleSheet.create({
  reviewStyle:{
      color:'#6E6E6E',
      fontSize: 18,
      fontWeight: "400",
      padding: 5
  },
  postButton: {
    height: 35,
    backgroundColor: "#6752EC",
    color: "white",
    borderWidth: 0,
  }
});
export default RecipeReviews;