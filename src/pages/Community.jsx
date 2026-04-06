import React, { useEffect, useState, useContext } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";
import "../styles/community.scss";

const Community = () => {
    const { user } = useContext(AuthContext);

    const [posts, setPosts] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [commentText, setCommentText] = useState({});
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editCommentText, setEditCommentText] = useState("");


  const communityRef = collection(db, "community");

  // 🔥 게시글 가져오기 (최신순)
  /* const getPosts = async () => {
    const q = query(communityRef, orderBy("createdAt", "desc"));
    const data = await getDocs(q);

    const postData = await Promise.all(
      data.docs.map(async (d) => {
        const commentsRef = collection(db, "community", d.id, "comments");
        const commentsSnap = await getDocs(commentsRef);

        return {
          ...d.data(),
          id: d.id,
          comments: commentsSnap.docs.map(c => ({
            ...c.data(),
            id: c.id
          }))
        };
      })
    );

    setPosts(postData);
  }; */

  useEffect(() => {
  const q = query(communityRef, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {

    const postData = snapshot.docs.map((d) => {
      return {
        ...d.data(),
        id: d.id,
        comments: [] // ⭐ 일단 비워두고
      };
    });

    setPosts(postData);

    // ⭐ 각 게시글 댓글 따로 구독
    postData.forEach((post, index) => {
      const commentsRef = collection(db, "community", post.id, "comments");

      onSnapshot(commentsRef, (commentSnap) => {
        const comments = commentSnap.docs.map(c => ({
          ...c.data(),
          id: c.id
        }));

        setPosts(prev =>
          prev.map(p =>
            p.id === post.id
              ? { ...p, comments }
              : p
          )
        );
      });
    });

  });

  return () => unsubscribe();
}, []);

  // ✅ 글쓰기
  const handleSubmit = async () => {
    if (!user) return alert("로그인이 필요합니다");

    await addDoc(communityRef, {
        title,
        content,
        author: user.displayName || "익명",
        uid: user.uid,
        createdAt: Date.now(),   // 🔥 변경
        likes: []
     });

    setTitle("");
    setContent("");
   /*  getPosts(); */
  };

  // ✅ 좋아요
  const handleLike = async (post) => {
    if (!user) return alert("로그인이 필요합니다");

    const postRef = doc(db, "community", post.id);

    if (post.likes?.includes(user.uid)) {
      await updateDoc(postRef, {
        likes: arrayRemove(user.uid)
      });
    } else {
      await updateDoc(postRef, {
        likes: arrayUnion(user.uid)
      });
    }
  };

  // ✅ 댓글 작성
  const handleComment = async (postId) => {
    if (!user) return alert("로그인이 필요합니다");

    const text = commentText[postId];
    if (!text) return;

    const commentsRef = collection(db, "community", postId, "comments");

    await addDoc(commentsRef, {
      text,
      author: user.displayName || "익명",
      uid: user.uid,
      createdAt: serverTimestamp()
    });

    setCommentText({ ...commentText, [postId]: "" });

    alert("댓글이 등록되었습니다!"); // ⭐ 추가
   /*  getPosts(); */
  };
  // ✅ 게시글 삭제
    const handleDelete = async (postId) => {
    if (!user) return alert("로그인이 필요합니다");

    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    await deleteDoc(doc(db, "community", postId));
    };
    // ✅ 게시글 수정 시작
    const handleEditStart = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
    };

    // ✅ 게시글 수정 완료
    const handleEditSave = async (postId) => {
    const postRef = doc(db, "community", postId);

    await updateDoc(postRef, {
        title: editTitle,
        content: editContent
    });

    setEditingId(null);
    };

    // ✅ 댓글 삭제 함수
    const handleCommentDelete = async (postId, commentId) => {
      if (!user) return alert("로그인이 필요합니다");

      const confirmDelete = window.confirm("댓글을 삭제하시겠습니까?");
      if (!confirmDelete) return;

      await deleteDoc(
        doc(db, "community", postId, "comments", commentId)
      );

    };
    //댓글 수정 시작
    const handleCommentEditStart = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };
    //댓글 수정 저장
    const handleCommentEditSave = async (postId, commentId) => {
    const commentRef = doc(db, "community", postId, "comments", commentId);

    await updateDoc(commentRef, {
      text: editCommentText
    });

    setEditingCommentId(null);
  };

  return (
    <div className="community-container">
      <h1>📍 Community</h1>

      {user && (
        <div className="write-box">
          <input
            placeholder="제목"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <button onClick={handleSubmit}>글쓰기</button>
        </div>
      )}

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id} className="post-item">
            {editingId === post.id ? (
                <>
                    <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="edit-buttons">
                        <button onClick={() => handleEditSave(post.id)}>저장</button>
                        <button onClick={() => setEditingId(null)}>취소</button>
                    </div>
                </>
                ) : (
                <>
                    <h3>{post.title}</h3>
                    <p>{post.content}</p>
                </>
            )}


            <div className="post-actions">
            <button onClick={() => handleLike(post)}>
                ❤️ {post.likes?.length || 0}
            </button>
            <span>{post.author}</span>

            {user && user.uid === post.uid && (
                <div className="edit-buttons">
                <button onClick={() => handleEditStart(post)}>수정</button>
                <button onClick={() => handleDelete(post.id)}>삭제</button>
                </div>
            )}
            </div>

            {/* 댓글 영역 */}
            <div className="comment-section">
              {post.comments?.map((comment) => (
                <div key={comment.id} className="comment">

                  {editingCommentId === comment.id ? (
                    <>
                      <input
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                      />
                      <button onClick={() => handleCommentEditSave(post.id, comment.id)}>
                        저장
                      </button>
                      <button onClick={() => setEditingCommentId(null)}>
                        취소
                      </button>
                    </>
                  ) : (
                    <>
                      <span>{comment.author}</span>
                      <p>{comment.text}</p>

                      {user && user.uid === comment.uid && (
                        <div className="comment-actions">
                          <button onClick={() => handleCommentEditStart(comment)}>
                            수정
                          </button>
                          <button onClick={() => handleCommentDelete(post.id, comment.id)}>
                            삭제
                          </button>
                        </div>
                      )}
                    </>
                  )}

                </div>
              ))}

              {user && (
                <div className="comment-input">
                  <input
                    placeholder="댓글 입력..."
                    value={commentText[post.id] || ""}
                    onChange={(e) =>
                      setCommentText({
                        ...commentText,
                        [post.id]: e.target.value
                      })
                    }
                  />
                  <button onClick={() => handleComment(post.id)}>
                    등록
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Community;
