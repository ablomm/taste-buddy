import React,{useState} from 'react';
import { View, Text, TextInput, Button, FlatList, Image, TouchableOpacity } from "react-native";

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
            username: 'placeholderUsername',
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
          <View>
            <TextInput
              placeholder="Write your review..."
              value={newReview}
              onChangeText={(text) => setNewReview(text)}
            />
            <TextInput
              placeholder="Rating (0.5 - 5)"
              keyboardType="numeric"
              value={rating.toString()}
              onChangeText={(text) => handleRatingChange(parseFloat(text))}
            />
            <Button title="Submit Review" onPress={handleReviewSubmit} />
          </View>
    
          {/* Sort Reviews Button */}
          <TouchableOpacity onPress={sortReviews}>
            <Text>Sort Reviews</Text>
          </TouchableOpacity>
    
          {/* Review List */}
          <FlatList
            data={reviews}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View>
                <Image source={{ uri: item.profilePicture }} style={{ width: 50, height: 50 }} />
                <Text>{item.username}</Text>
                <Text>Rating: {item.rating}</Text>
                <Text>{item.reviewText}</Text>
                <Text>{item.postingTime}</Text>
              </View>
            )}
          />
    
          {/* Load More Reviews Button */}
          <TouchableOpacity onPress={loadMoreReviews}>
            <Text>Load More Reviews</Text>
          </TouchableOpacity>
        </View>
      );

}

export default RecipeReviews;