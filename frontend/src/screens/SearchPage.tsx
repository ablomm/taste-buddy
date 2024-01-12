import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import SearchBar from '../components/SearchBar';
import PostsGrid from '../components/PostsGrid';

const SearchPage = () => {
    const [searchPhrase, setSearchPhrase] = React.useState("");
    const [clicked, setClicked] = React.useState(false);

    return (
        <View style={styles.container}>          
            <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                clicked={clicked}
                setClicked={setClicked}
            />

            <PostsGrid />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {

    },
    postsGrid: {

    },

});

export default SearchPage;