
import React, { useState } from "react";
import { auth } from './firebaseConfig';  // Firebase設定をインポート
import { Navigate } from "react-router-dom"; // Navigateコンポーネントをインポート
import { Link, useNavigate } from "react-router-dom"; // useNavigateを追加
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Google認証プロバイダをインポート



function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // useNavigateを使用してリダイレクト用の関数を取得

  const login = async (e) => {
    e.preventDefault();

    try {
      await auth.signInWithEmailAndPassword(email, password);
      // ログイン成功後の処理
      navigate("/chat"); // ログイン成功時に "/chat" にリダイレクト
    } catch (error) {
      // エラー処理
      console.error("ログインエラー", error);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // ログイン成功後の処理
      navigate("/chat"); // ログイン成功時に "/chat" にリダイレクト
    } catch (error) {
      // エラー処理
      console.error("Googleログインエラー", error);
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
              
            </div>
     
       <div className="logo">
       <a href="/">
        <img src="/img/logo.png" alt="logo" />
        </a>
        </div>
      <form onSubmit={login}>
         <div className="tourokugroyp">
                 <div className="touroku_email">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="メールアドレス"
            /></div>
              <div className="touroku_pass">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="パスワード"
            /></div>
           <div className="touroku_button">
            <button type="submit">ログイン</button>
          </div>
            <button onClick={loginWithGoogle}>Googleアカウントでログイン</button> {/* Googleログインボタン */}
          </div>
      </form>
      
  <div className="tourokulink">
        <Link to="/register">無料会員登録はこちら</Link>
      </div>
      <p className="muryoudayo">無料でご利用いただけます</p>
      {/* <Link to="/chat">つぶやく</Link> */}
    </div>
  
  );
}

export default Login;

