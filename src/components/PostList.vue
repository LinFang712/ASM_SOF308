<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
const posts = ref([]);
const fetchPosts = async () => {
    try {
        const response = await axios.get('http://localhost:3000/posts');
        posts.value = response.data;
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
    }
};
const title = ref('');
const content = ref('');
const addPost = async () => {
    if (!title.value || !content.value) return;
    try {
        await axios.post('http://localhost:3000/posts', {
            title: title.value,
            content: content.value
        });
        title.value = '';
        content.value = '';
    } catch (error) {
        console.error('Lỗi khi thêm bài viết:', error);
    }
};
const updatePost = async (id) => {
    try {
        await axios.put(`http://localhost:3000/posts/${id}`, {
            title: 'Tiêu đề mới',
            content: 'Nội dung mới'
        });
    } catch (error) {
        console.error('Lỗi khi cập nhật:', error);
    }
};
const deletePost = async (id) => {
    try {
        await axios.delete(`http://localhost:3000/posts/${id}`);
    } catch (error) {
        console.error('Lỗi khi xóa:', error);
    }
};
onMounted(fetchPosts);
</script>
<template>
    <div>
        <h2>Danh sách bài viết</h2>
        <ul> 
            <li v-for="post in posts" :key="post.id">
                {{ post.title }} - {{ post.content }}
            </li>
        </ul>
    </div>
</template>