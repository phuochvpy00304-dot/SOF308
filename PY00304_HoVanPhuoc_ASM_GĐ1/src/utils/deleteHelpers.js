/**
 * Các hàm tiện ích để thực hiện xóa cascade
 * Xử lý việc xóa bài viết và tất cả dữ liệu liên quan (reactions, comments, comment reactions)
 */

/**
 * Lấy tất cả dữ liệu từ nhiều endpoints đồng thời
 * @returns {Promise<Object>} Object chứa tất cả dữ liệu đã lấy
 */
const fetchAllRelatedData = async () => {
  try {
    const [reactionsRes, commentsRes, commentReactionsRes] = await Promise.all([
      fetch('https://sof308-json-server-production.up.railway.app/reactions'),
      fetch('https://sof308-json-server-production.up.railway.app/comments'),
      fetch('https://sof308-json-server-production.up.railway.app/commentReactions')
    ]);

    const [reactions, comments, commentReactions] = await Promise.all([
      reactionsRes.json(),
      commentsRes.json(),
      commentReactionsRes.json()
    ]);

    return { reactions, comments, commentReactions };
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu liên quan:', error);
    throw new Error('Không thể lấy dữ liệu liên quan');
  }
};

/**
 * Lọc dữ liệu liên quan đến một bài viết cụ thể
 * @param {string} postId - ID của bài viết cần lọc
 * @param {Object} data - Object chứa các mảng reactions, comments, commentReactions
 * @returns {Object} Dữ liệu đã lọc liên quan đến bài viết
 */
const filterRelatedData = (postId, { reactions, comments, commentReactions }) => {
  const relatedReactions = reactions.filter(r => r.postId === postId);
  const relatedComments = comments.filter(c => c.postId === postId);
  const relatedCommentIds = relatedComments.map(c => c.id);
  const relatedCommentReactions = commentReactions.filter(cr => 
    relatedCommentIds.includes(cr.commentId)
  );

  return {
    relatedReactions,
    relatedComments,
    relatedCommentReactions,
    relatedCommentIds
  };
};

/**
 * Thực hiện tất cả các thao tác xóa đồng thời
 * @param {string} postId - ID của bài viết cần xóa
 * @param {Object} relatedData - Object chứa các mảng dữ liệu liên quan cần xóa
 * @returns {Promise<void>}
 */
const executeDeleteOperations = async (postId, relatedData) => {
  const { relatedReactions, relatedComments, relatedCommentReactions } = relatedData;

  // Tạo mảng tất cả các promise xóa
  const deletePromises = [
    // Xóa bài viết chính
    fetch(`https://sof308-json-server-production.up.railway.app/posts/${postId}`, { method: 'DELETE' }),
    
    // Xóa tất cả reactions của bài viết
    ...relatedReactions.map(reaction => 
      fetch(`https://sof308-json-server-production.up.railway.app/reactions/${reaction.id}`, { method: 'DELETE' })
    ),
    
    // Xóa tất cả comment reactions
    ...relatedCommentReactions.map(commentReaction => 
      fetch(`https://sof308-json-server-production.up.railway.app/commentReactions/${commentReaction.id}`, { method: 'DELETE' })
    ),
    
    // Xóa tất cả comments (bao gồm cả replies)
    ...relatedComments.map(comment => 
      fetch(`https://sof308-json-server-production.up.railway.app/comments/${comment.id}`, { method: 'DELETE' })
    )
  ];

  // Thực hiện tất cả thao tác xóa đồng thời
  const results = await Promise.allSettled(deletePromises);
  
  // Kiểm tra các thao tác thất bại
  const failures = results.filter(result => result.status === 'rejected');
  if (failures.length > 0) {
    console.warn(`${failures.length} thao tác xóa thất bại:`, failures);
  }
};

/**
 * Hàm chính để xóa bài viết và tất cả dữ liệu liên quan (xóa cascade)
 * @param {string} postId - ID của bài viết cần xóa
 * @returns {Promise<Object>} Object kết quả với trạng thái thành công và số lượng đã xóa
 */
export const deleteCascade = async (postId) => {
  try {
    // Bước 1: Lấy tất cả dữ liệu liên quan
    const allData = await fetchAllRelatedData();
    
    // Bước 2: Lọc dữ liệu liên quan đến bài viết cụ thể
    const relatedData = filterRelatedData(postId, allData);
    
    // Bước 3: Thực hiện tất cả thao tác xóa
    await executeDeleteOperations(postId, relatedData);
    
    // Bước 4: Trả về kết quả thành công với số lượng đã xóa
    return {
      success: true,
      deletedCounts: {
        reactions: relatedData.relatedReactions.length,
        comments: relatedData.relatedComments.length,
        commentReactions: relatedData.relatedCommentReactions.length
      }
    };

  } catch (error) {
    console.error('Lỗi trong quá trình xóa cascade:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Cập nhật các mảng state local bằng cách xóa các items liên quan đến bài viết đã xóa
 * @param {string} postId - ID của bài viết đã xóa
 * @param {Array} deletedCommentIds - Mảng các ID comment đã bị xóa
 * @param {Object} state - Object chứa các mảng reactive state
 */
export const updateLocalStateAfterDelete = (postId, deletedCommentIds, state) => {
  const { posts, reactions, comments, commentReactions } = state;
  
  // Xóa bài viết đã xóa khỏi mảng posts
  const postIndex = posts.value.findIndex(post => post.id === postId);
  if (postIndex !== -1) {
    posts.value.splice(postIndex, 1);
  }
  
  // Xóa các reactions liên quan
  reactions.value = reactions.value.filter(r => r.postId !== postId);
  
  // Xóa các comments liên quan
  comments.value = comments.value.filter(c => c.postId !== postId);
  
  // Xóa các comment reactions liên quan
  commentReactions.value = commentReactions.value.filter(cr => 
    !deletedCommentIds.includes(cr.commentId)
  );
};
