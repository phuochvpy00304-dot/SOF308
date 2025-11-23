import { ref, computed } from 'vue';
import axios from 'axios';

const BASE_URL = 'https://sof308-json-server-production.up.railway.app';
const Posts_URL = `${BASE_URL}/posts`;
const Reactions_URL = `${BASE_URL}/reactions`;
const Comments_URL = `${BASE_URL}/comments`;

export function useStats() {
  const posts = ref([]);
  const reactions = ref([]);
  const comments = ref([]);

  // Computed statistics
  const totalPosts = computed(() => posts.value.length);
  
  const totalLikes = computed(() => {
    return reactions.value.filter(r => r.type === 'like').length;
  });
  
  const totalDislikes = computed(() => {
    return reactions.value.filter(r => r.type === 'dislike').length;
  });
  
  const totalComments = computed(() => comments.value.length);

  // Fetch all data
  async function fetchStats() {
    try {
      const [postsRes, reactionsRes, commentsRes] = await Promise.all([
        axios.get(Posts_URL),
        axios.get(Reactions_URL),
        axios.get(Comments_URL)
      ]);

      posts.value = postsRes.data;
      reactions.value = reactionsRes.data;
      comments.value = commentsRes.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  // Fetch posts only
  async function fetchPosts() {
    try {
      const res = await axios.get(Posts_URL);
      posts.value = res.data;
      return res.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      return [];
    }
  }

  // Fetch reactions only
  async function fetchReactions() {
    try {
      const res = await axios.get(Reactions_URL);
      reactions.value = res.data;
      return res.data;
    } catch (error) {
      console.error('Error fetching reactions:', error);
      return [];
    }
  }

  // Fetch comments only
  async function fetchComments() {
    try {
      const res = await axios.get(Comments_URL);
      comments.value = res.data;
      return res.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  }

  // Get stats for specific post
  async function getPostStats(postId) {
    try {
      const [reactionsRes, commentsRes] = await Promise.all([
        axios.get(Reactions_URL, { params: { postId } }),
        axios.get(Comments_URL, { params: { postId } })
      ]);

      const postReactions = reactionsRes.data;
      const postComments = commentsRes.data;

      return {
        likes: postReactions.filter(r => r.type === 'like').length,
        dislikes: postReactions.filter(r => r.type === 'dislike').length,
        comments: postComments.length
      };
    } catch (error) {
      console.error('Error fetching post stats:', error);
      return { likes: 0, dislikes: 0, comments: 0 };
    }
  }

  return {
    // Data
    posts,
    reactions,
    comments,
    
    // Computed stats
    totalPosts,
    totalLikes,
    totalDislikes,
    totalComments,
    
    // Methods
    fetchStats,
    fetchPosts,
    fetchReactions,
    fetchComments,
    getPostStats
  };
}
