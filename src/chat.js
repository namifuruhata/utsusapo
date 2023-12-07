import React, { useState, useEffect } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, updateDoc, doc, getDoc, setDoc, getFirestore } from "firebase/firestore";
import { db, storage } from './firebaseConfig'; // storageをインポート
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Firebase Storage 関連の関数をインポート
import axios from 'axios'; // axiosをインポート
import { getDocs, where } from 'firebase/firestore';
import { auth } from './firebaseConfig'; 
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";


function Chat() {
    const [stampSelectorVisible, setStampSelectorVisible] = useState(false); // スタンプ選択UIの表示状態
    const [selectedStamps, setSelectedStamps] = useState([]); // 選択されたスタンプのリスト
    const [currentMessageId, setCurrentMessageId] = useState(null); // 現在選択中のメッセージID
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);
    const [selectedStamp, setSelectedStamp] = useState(null); // 選択されたスタンプを保持
    const [image, setImage] = useState(null);
  // Talk APIからの応答を保存するためのステート
    const [apiResponse, setApiResponse] = useState('');
    const [defaultText, setDefaultText] = useState(''); //ディフォルト文字
    const [userId, setUserId] = useState(null);
    const db = getFirestore();
    const toggleStampSelector = (messageId) => {
    setCurrentMessageId(messageId);
    setStampSelectorVisible(!stampSelectorVisible); // スタンプ選択UIの表示状態を切り替える
};
    const [followingIds, setFollowingIds] = useState([]); // フォローしているユーザーのIDを管理する状態
  const [emotionAnalysisResult, setEmotionAnalysisResult] = useState(null);


  function StampModal({ isOpen, onClose, messageId, addStamp }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <button onClick={() => addStamp(messageId, 'like')}>👍</button>
        <button onClick={() => addStamp(messageId, 'love')}>❤️</button>
        <button onClick={() => addStamp(messageId, 'kanashii')}>😢</button>
        <button onClick={() => addStamp(messageId, 'hakusyu')}>👏</button>
        <button onClick={() => addStamp(messageId, 'ok')}>🆗</button>
        <button onClick={() => addStamp(messageId, 'smile')}>😊</button>
       <div className="close"><button onClick={onClose}>閉じる</button></div>
      </div>
    </div>
  );
}
  // 感情分析
 const apiKey = 'FF64ECF9F822C7E7FC5F75F14D5E4C3C9ADC801D'; // あなたのAPIキーを設定
const corsProxyUrl = 'https://cors-anywhere.herokuapp.com/';
const apiUrl = `http://ap.mextractr.net/ma9/emotion_analyzer?&apikey=${apiKey}&out=json&text=${encodeURIComponent(text)}`;
  
  // 感情分析結果をFirebaseに保存する関数
const saveEmotionAnalysisResult = async (messageId, emotionResult) => {
  const messageRef = doc(db, "chat", messageId);
  await updateDoc(messageRef, { emotionAnalysisResult: emotionResult });
};
const analyzeEmotion = async (text, messageId) => {
  try {
    const response = await fetch(`${corsProxyUrl}${apiUrl}&out=json&text=${encodeURIComponent(text)}`, {
      method: 'GET',
      headers: {
        'Origin': 'http://localhost:3001', 
      },
    });

    console.log('エンコードされたテキスト:', encodeURIComponent(text));
    console.log('textの値:', text);

    if (!response.ok) {
      throw new Error('APIリクエストに失敗しました');
    }

    const result = await response.json();
    console.log(result);

    if (result.analyzed_text) {
      const emotionResult = {
        analyzedText: result.analyzed_text,
        angerFear: result.angerfear,
        joySad: result.joysad,
        likeDislike: result.likedislike,
      };

      console.log('感情分析結果:', emotionResult);
      setEmotionAnalysisResult(emotionResult); // 結果を状態にセットする
    } else {
      console.error('感情分析の結果が含まれていないレスポンス');
    }
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
};

  
  //ログイン時にユーザー名取得
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async user => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists() && docSnap.data().username) {
          setName(docSnap.data().username);
        }
      }
    });

    return () => unsubscribe();
  }, []);


  // 名前が変更されるたびにFirestoreに保存
  useEffect(() => {
    const saveNameToFirestore = async () => {
      if (auth.currentUser && name !== '') {
        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
          username: name
        });
      }
    };

    saveNameToFirestore();
  }, [name]);

    const generateCustomId = (email) => {
    // ここでカスタムIDを生成
    return email.replace(/@.*/, ''); // 例えば、メールアドレスの@以前を使用
    };
  
    useEffect(() => {
    localStorage.setItem('name', name);
  }, [name]);

  useEffect(() => {
  
  const now = new Date();
  const oneDayAgo = now.getTime() - 24 * 60 * 60 * 1000; // 現在時刻から24時間前
  const q = query(collection(db, "chat"), orderBy("time", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const newMessages = querySnapshot.docs
      .map((doc) => {
        const data = doc.data();
        const timestamp = data.time;
        if (!timestamp || !timestamp.toDate) return null; // タイムスタンプの存在と形式を確認

        const time = timestamp.toDate(); // タイムスタンプをDateに変換
        return {
          id: doc.id,
          data,
          time, // Dateオブジェクトをそのまま保持
          formattedTime: convertTimestampToDatetime(time), // フォーマットされた時間
        };
      })
      .filter(message => message && (message.data.isFavorited || message.time.getTime() > oneDayAgo)); // お気に入りまたは24時間以内のメッセージのみを保持

    setMessages(newMessages);
  });

  return () => unsubscribe();
}, []);
  
  // Googleログイン
  const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    setUserId(user.uid); // UIDを状態に保存
    console.log("Logged in user ID:", user.uid); // ログで確認

    // カスタムIDの生成（例：ハッシュ関数を使用）
    const customId = generateCustomId(user.email);

    // FirestoreにカスタムIDを保存
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      customId: customId
    });

  } catch (error) {
      console.log(error.message);
    }
  };

// カスタムIDに基づいてユーザーを検索
  const searchUserByCustomId = async (customId) => {
  const querySnapshot = await getDocs(query(collection(db, "users"), where("customId", "==", customId)));
  querySnapshot.forEach((doc) => {
    console.log(doc.id, " => ", doc.data());
  });
};
  


  
    // Talk APIにリクエストを送信する関数
  const sendToTalkAPI = async (userInput) => {
    let formData = new FormData();
    // データを追加
        formData.append('apikey', 'ZZkdnYKYYylCFyAeoZFPDPzilTUbqFTf');
    formData.append('query', userInput);
      
    const response = await axios.post('https://api.a3rt.recruit.co.jp/talk/v1/smalltalk', formData)
      // .then(response => {
        // レスポンスの処理
        console.log(response.data.results[0].reply);
        setApiResponse(response.data.results[0].reply);
  }

  const defaultResponses = [
    "会えてうれしいよ",
    "まってたよ〜",
    "調子はどう？",
    "気軽に話してね",
    "まったりいこう〜",
    "会いに来てくれてありがとう",

  ];
  useEffect(() => {
  const randomIndex = Math.floor(Math.random() * defaultResponses.length);
  setDefaultText(defaultResponses[randomIndex]);
}, []);
  
  // スタンプ選択UIを表示する関数
    const renderStampSelector = (messageId) => {
    return (
      <div>
        <button onClick={() => addStamp(messageId, 'like')}>👍</button>
        <button onClick={() => addStamp(messageId, 'love')}>❤️</button>
        <button onClick={() => addStamp(messageId, 'kanashii')}>😢</button>
        <button onClick={() => addStamp(messageId, 'hakusyu')}>👏</button>
        <button onClick={() => addStamp(messageId, 'ok')}>🆗</button>
        <button onClick={() => addStamp(messageId, 'smile')}>😊</button>
        
        {/* 他のスタンプボタンも追加 */}
      </div>
    );
  };



const uploadImage = async () => {
  if (!image) return null;
  const storageRef = ref(storage, `images/${image.name}`);
  const uploadResult = await uploadBytes(storageRef, image);
  return getDownloadURL(uploadResult.ref);
};
  
  // メッセージ送信時にTalk APIにもリクエストを送る
 const sendMessage = async () => {
  if (name && (text || image)) {
    const imageUrl = await uploadImage();
    
    // メッセージ送信前に感情分析を呼び出す
    await analyzeEmotion(text);
    
    sendToTalkAPI(text);
    const messageData = {
      userId: auth.currentUser.uid,
      name,
      text,
      imageUrl,
      time: serverTimestamp(),
      isFavorited: false,
      stamps: selectedStamp ? { [selectedStamp]: 1 } : {},
    };

    await addDoc(collection(db, "chat"), messageData);

    setText('');
    setImage(null);
  } else {
    alert("名前とメッセージを入力してください");
  }
};
// ユーザーIDとフォローしているユーザーのIDを取得
useEffect(() => {
  const fetchUserData = async () => {
    if (userId) {
      const userRef = doc(db, "users", userId);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        // フォローしているユーザーのID配列を取得し、自分のIDを追加
        const userFollowingIds = docSnap.data().following || [];
        if (!userFollowingIds.includes(userId)) {
          userFollowingIds.push(userId); // 自分自身のIDを追加
        }
        setFollowingIds(userFollowingIds);
      }
    }
  };

  fetchUserData();
}, [userId]);


  useEffect(() => {
  if (followingIds.length > 0) {
    // followingIds に基づいてクエリを実行
    const q = query(collection(db, "chat"), where("userId", "in", followingIds));
    // ...
  } else {
    // followingIds が空の場合、メッセージを空にするか、何もしない
    setMessages([]);
  }
}, [followingIds]);


  
  ///スタンプ追加
  const stampTypes = ['like', 'love']; // 新しいスタンプの種類を追加
  const addStamp = async (messageId, stampType) =>  {
  const messageRef = doc(db, "chat", messageId);
  const messageDoc = await getDoc(messageRef);
  const messageData = messageDoc.data();
  const stamps = messageData.stamps || {}; // stamps フィールドが存在しない場合、空のオブジェクトを割り当てる
  const newStamps = {
    ...stamps,
    [stampType]: (stamps[stampType] || 0) + 1
  };

  await updateDoc(messageRef, { stamps: newStamps });
};


  
  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      sendMessage();
    }
  };


useEffect(() => {
  const now = new Date();
  const oneDayAgo = now.getTime() - 24 * 60 * 60 * 1000;
  const q = query(collection(db, "chat"), orderBy("time", "desc"));
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
     const newMessages = querySnapshot.docs
    .map((doc) => {
      const data = doc.data();
      const time = convertTimestampToDatetime(data.time);

      return {
        id: doc.id,
        data,
        time: time,
        formattedTime: time ? time : "Invalid date", // 無効な日付の場合は代替テキストを表示
      };
    })
    .filter(message => message.time && (message.data.isFavorited || new Date(message.data.time.seconds * 1000).getTime() > oneDayAgo));

    setMessages(newMessages);
}, []);

  return () => unsubscribe();
}, []);

  

  // 日時をいい感じの形式にする関数
function convertTimestampToDatetime(timestamp) {
  if (!timestamp || !timestamp.seconds) {
    return null; // 無効なタイムスタンプの場合はnullを返す
  }
  const date = new Date(timestamp.seconds * 1000);
  const Y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const H = String(date.getHours()).padStart(2, '0');
  const i = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${Y}/${m}/${d} ${H}:${i}:${s}`;
}

  
  // お気に入りボタン
  const toggleFavorite = async (id, currentStatus) => {
    await updateDoc(doc(db, "chat", id), {
      isFavorited: !currentStatus
    });
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
    <div className="content">
      <img src="/img/azarashi.gif" alt="GIF Image" className="gif" />
      <p className="ai">{apiResponse || defaultText}</p>
      </div>
      {/* 名前とメッセージ入力フォーム */}
      <div className="nyuuryoku_group">
        <div className="nyuuryoku">
        <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="名前"
      />
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleEnter}
      placeholder="つぶやき"
      />
          {/* 画像を選択するためのインプット */}
          <div className="imgup">
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setImage(e.target.files[0])}
    /></div>
        <button className="send" onClick={sendMessage}>送信</button>
        </div>
        </div>
      {/* メッセージ一覧を表示する部分 */}
      <div className="ichiran">
    <ul>
        {messages.map((message) => (
          <li key={message.id} className="message-item">
            <div className="message-header">{message.data.name}</div>
            <div className="formattedTime">{message.formattedTime}</div>
            <div className="message-text">{message.data.text}</div>
            
            <div className="message-actions">

              {/* ここで画像を表示 */}
              <div className="img">
    {message.data.imageUrl && <img src={message.data.imageUrl} alt="アップロードされた画像" />}</div>
              {/* お気に入りボタン */}
              <div className="stamp">
            <button
  onClick={() => toggleFavorite(message.id, message.data.isFavorited)}
  className={`favorite-button ${message.data.isFavorited ? 'favorited' : ''}`}
>
  {message.data.isFavorited ? 'お気に入り済' : 'お気に入り'}
                </button>
                {/* スタンプ選択ボタン */}
                <div className="smile">
                  <button onClick={() => toggleStampSelector(message.id)}>スタンプ</button></div>
                            {/*感情分析結果の表示*/}
       <div>
      <button onClick={() => analyzeEmotion("テキスト")}>感情分析</button>
      {emotionAnalysisResult && (
        <div>
          <p>怒り・恐怖: {emotionAnalysisResult.angerFear}</p>
          <p>喜び・悲しみ: {emotionAnalysisResult.joySad}</p>
          <p>好き・嫌い: {emotionAnalysisResult.likeDislike}</p>
        </div>
      )}
    </div>
              </div>
              
                {/* スタンプ選択UIの表示 */}
                {/* {currentMessageId === message.id && renderStampSelector(message.id)} */} 

                {/* スタンプが押されたときのみ表示 */}
                <div className="stamp2">
                  {message.data.stamps && message.data.stamps.like > 0 && (
                  <span>👍 {message.data.stamps.like}</span>
                  )}
                  {message.data.stamps && message.data.stamps.love > 0 && (
                  <span>❤️ {message.data.stamps.love}</span>
                  )}
                  {message.data.stamps && message.data.stamps.kanashii > 0 && (
                  <span>😢 {message.data.stamps.kanashii}</span>
                  )}
                  {message.data.stamps && message.data.stamps.ok > 0 && (
                  <span>🆗 {message.data.stamps.ok}</span>
                  )}
                                  {message.data.stamps && message.data.stamps.hakusyu > 0 && (
                  <span>👏 {message.data.stamps.hakusyu}</span>
                  )}
                                  {message.data.stamps && message.data.stamps.smile > 0 && (
                  <span>😊 {message.data.stamps.smile}</span>
                  )}
                  </div>
                {/* 他のスタンプの表示 */}
                  <StampModal
      isOpen={stampSelectorVisible}
      onClose={() => setStampSelectorVisible(false)}
      messageId={currentMessageId}
      addStamp={addStamp}
    />
            </div>
          </li>
        ))}
      </ul>
      </div>
      </div>
  );
}

export default Chat;