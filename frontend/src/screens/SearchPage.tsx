import React from 'react';
import {View, StyleSheet} from 'react-native';
import SearchBar from '../components/SearchBar';
import AllPostsGrid from '../components/AllPostsGrid';
import SearchResultBody from "../components/SearchPageComponents/SearchResultBody";

const SearchPage = ({navigation}: any) => {
    const [searchPhrase, setSearchPhrase] = React.useState("");
    const [clicked, setClicked] = React.useState(false);
    const [searchResults, setSearchResults] = React.useState({});
    const [searchStatus, setSearchStatus] = React.useState(false);

    async function search(searchPhrase: string) {
        const response = await fetch(`${process.env.EXPO_PUBLIC_SERVER_URL || "http://localhost:8080"}/search/all-content/${searchPhrase}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'include',
       });

        if (response.ok) {
            // If the response is successful (status code in the range 200-299)
            const jsonResponse = await response.json(); // Extract JSON data from the response
            setSearchResults(jsonResponse);
        } else {
            // If the response is not successful, handle the error accordingly
            console.error('Failed to fetch data:', response.statusText);
        }

        setSearchStatus(true);
    }

    function cancel() {
        setSearchStatus(false);
    }

    return (
        <View style={styles.container}>
            <SearchBar
                searchPhrase={searchPhrase}
                setSearchPhrase={setSearchPhrase}
                clicked={clicked}
                setClicked={setClicked}
                handleSearch={search}
                cancelClick={cancel}
            />
            {searchStatus ?
                /* When searching */
                <SearchResultBody
                    navigation={navigation}
                    searchResults={searchResults}
                    search={()=>search(searchPhrase)}
                />
                :
                /* When not searching display recommendations */
                <AllPostsGrid />
            }
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
