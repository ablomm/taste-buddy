import RelevantPostsGrid from "./ReleventPostsGrid";
import {NoResultMessage} from "./NoResultMessage";
import React from "react";

export function PostTab({relevantPosts}) {
    return (
        relevantPosts != null && relevantPosts.length != 0 ?
            <RelevantPostsGrid posts={relevantPosts} />
            :
            <NoResultMessage message='No relevant posts found.'/>
    );
}
