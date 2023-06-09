import { createContext, useReducer, useState } from 'react';
import { postReducer } from '../reducers/PostReducer';
import {
    ADD_POST,
    UPDATE_POST,
    apiUrl,
    DELETE_POST,
    POSTS_LOADED_FALSE,
    POSTS_LOADED_SUCCESS,
    FIND_POST,
} from './constants';
import axios from 'axios';

export const PostContext = createContext();

const PostContextProvider = ({ children }) => {
    //state
    const [postState, dispatch] = useReducer(postReducer, {
        post: null,
        posts: [],
        postsLoading: true,
    });

    //show or hide modal
    const [showAddPostModal, setShowAddPostModal] = useState(false);
    const [showUpdatePostModal, setShowUpdatePostModal] = useState(false);

    //show toast message
    const [showToast, setShowToast] = useState({
        show: false,
        mesage: '',
        type: null,
    });

    //get all posts
    const getPosts = async () => {
        try {
            const response = await axios.get(`${apiUrl}/posts`);
            if (response.data.success)
                dispatch({
                    type: POSTS_LOADED_SUCCESS,
                    payload: response.data.posts,
                });
        } catch (error) {
            dispatch({ type: POSTS_LOADED_FALSE });
        }
    };

    // Add post
    const addPost = async (newPost) => {
        try {
            const response = await axios.post(`${apiUrl}/posts`, newPost);
            if (response.data.success) {
                dispatch({ type: ADD_POST, payload: response.data.post });
                return response.data;
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Server error' };
        }
    };

    // Find post when user is updating post
    const findPost = (postId) => {
        const post = postState.posts.find((post) => post._id === postId);
        dispatch({ type: FIND_POST, payload: post });
    };

    // Update post
    const updatePost = async (updatedPost) => {
        try {
            const response = await axios.put(
                `${apiUrl}/posts/${updatedPost._id}`,
                updatedPost
            );
            if (response.data.success) {
                dispatch({ type: UPDATE_POST, payload: response.data.post });
                return response.data;
            }
        } catch (error) {
            return error.response.data
                ? error.response.data
                : { success: false, message: 'Sever error' };
        }
    };

    // Delete post
    const deletePost = async (postId) => {
        try {
            const response = await axios.delete(`${apiUrl}/posts/${postId}`);
            if (response.data.success) {
                dispatch({ type: DELETE_POST, payload: postId });
            }
        } catch (error) {
            console.log(error);
        }
    };

    // Post context data
    const postContextData = {
        postState,
        getPosts,
        showAddPostModal,
        setShowAddPostModal,
        showUpdatePostModal,
        setShowUpdatePostModal,
        addPost,
        showToast,
        setShowToast,
        deletePost,
        updatePost,
        findPost,
    };

    return (
        <PostContext.Provider value={postContextData}>
            {children}
        </PostContext.Provider>
    );
};

export default PostContextProvider;
