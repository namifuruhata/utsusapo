import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';
import { arrayRemove } from 'firebase/firestore'; // arrayUnionのインポートを削除
import { auth, db } from './firebaseConfig';


function UserSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userId, setUserId] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
  const [followings, setFollowings] = useState([]);
  const [followers, setFollowers] = useState([]);

   useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setCurrentUser(user);
        fetchFollowings(user.uid);
        fetchFollowers(user.uid);
      }
    });
  }, []);

  const fetchFollowings = async (uid) => {
    const userRef = doc(db, "users", uid);
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      const followingIds = docSnap.data().following;
      const followingUsers = [];
      for (const id of followingIds) {
        const userDoc = await getDoc(doc(db, "users", id));
        if (userDoc.exists()) {
          followingUsers.push({ id, ...userDoc.data() });
        }
      }
      setFollowings(followingUsers);
    }
  };

  const fetchFollowers = async (uid) => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const followerUsers = [];
    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.following && userData.following.includes(uid)) {
        followerUsers.push({ id: doc.id, ...userData });
      }
    });
    setFollowers(followerUsers);
  };


 useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged(async user => {
    if (user) {
      setUserId(user.uid);
      // ユーザーのプロファイルがまだ作成されていない場合に作成する
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          username: user.uid, // ここでUIDをusernameとして保存
          following: []
        });
      }
    } else {
      console.log("ユーザーがログインしていません。");
    }
  });

  return () => unsubscribe();
}, []);

  // ユーザー登録時の処理
const createUserProfile = async (userId, username) => {
  await setDoc(doc(db, "users", userId), {
    username: username,
    following: []
  });
};
  
const searchUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    // ユーザー名またはIDに基づいて検索
    const q = query(usersRef, where("username", "==", searchTerm));
    const querySnapshot = await getDocs(q);
    const users = [];
    querySnapshot.forEach((doc) => {
      // ドキュメントID（ユーザーID）が検索条件に一致するか確認
      if (doc.id === searchTerm || doc.data().username === searchTerm) {
        users.push({ id: doc.id, ...doc.data() });
      }
    });
    setSearchResults(users);
  } catch (error) {
    console.error("ユーザー検索中にエラーが発生しました:", error);
  }
};

const followUser = async (userIdToFollow) => {
  try {
    const currentUserRef = doc(db, "users", userId); // 現在のユーザーのID
    await updateDoc(currentUserRef, {
      following: arrayUnion(userIdToFollow)
    });
  } catch (error) {
    console.error("フォロー処理中にエラーが発生しました:", error);
  }
};
  
    // 現在のユーザーのフォロー情報を取得
  const [currentUserData, setCurrentUserData] = useState(null);

  useEffect(() => {
    if (userId) {
      const fetchCurrentUser = async () => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setCurrentUserData(userSnap.data());
        }
      };

      fetchCurrentUser();
    }
  }, [userId]);

   // フォロー/フォロー解除の関数
  const toggleFollow = async (userIdToFollow) => {
    const userRef = doc(db, "users", userId);
    if (currentUserData.following.includes(userIdToFollow)) {
      // フォロー解除
      await updateDoc(userRef, {
        following: arrayRemove(userIdToFollow)
      });
    } else {
      // フォロー
      await updateDoc(userRef, {
        following: arrayUnion(userIdToFollow)
      });
    }
     const updatedUserSnap = await getDoc(userRef);
    if (updatedUserSnap.exists()) {
      setCurrentUserData(updatedUserSnap.data());
    }
  };

  return (
       <div className="container">
      <div className="heder">
      <div className="logo2">
       <a href="/">
        <img src="/img/logo.png" alt="logo" />
        </a>
        </div>
      <div className="icon">
       <a href="/chat">
        <img src="/img/chat.png" alt="chat" />
      </a>
             <a href="/usersearch">
        <img src="/img/search.png" alt="usersearch" />
      </a>
             <a href="/tell">
        <img src="/img/tell.png" alt="tell" />
        </a>
        </div>
      </div>
             <div className="page_title">友だち検索</div>
      <div className='myid'>
        {userId && <p className='myidgroup'><p className='iddayo'>ユーザーID</p> {userId}</p>}
           </div>
        <div className="search_text_group">
       <div className="search_text">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="ユーザー名で検索"
          /></div>      
        <button className='send' onClick={searchUsers}>検索</button></div>
   
     <ul>
      {searchResults.map((user) => (
        <li key={user.id}>
          {user.username} ({user.id})
          {/* フォローボタンの表示 */}
          {userId !== user.id && (
            <button onClick={() => toggleFollow(user.id)}>
              {currentUserData?.following.includes(user.id) ? 'フォロー解除' : 'フォロー'}
            </button>
          )}
        </li>
      ))}
      </ul>  
        <div className='followlist_group'>
        <p className='followlist'>フォロー一覧</p>
      <ul>
        {followings.map(user => <li key={user.id}>{user.username}</li>)}
      </ul>

     <p className='followlist'>フォロワー一覧</p>
      <ul>
        {followers.map(user => <li key={user.id}>{user.username}</li>)}
        </ul>
      </div>
      <div className='ai_search_group'>
      <p className='ai_search'>僕は友だちいないんだ</p>
         <div className="content">
      <img src="/img/azarashi.gif" alt="GIF Image" className="gif" />
        </div>
        </div>
    </div>
  );
}

export default UserSearch;
