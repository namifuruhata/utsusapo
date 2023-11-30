// register.js
import React, { useState } from "react";
import { auth } from './firebaseConfig'; // Firebase設定をインポート

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async (e) => {
    e.preventDefault();
    try {
        await auth.createUserWithEmailAndPassword(email, password);
      // 登録成功後の処理
    } catch (error) {
      // エラー処理
      console.error("アカウント登録エラー", error);
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
                {/* <div className="icon">
                    <a href="/chat">
                        <img src="/img/chat.png" alt="chat" />
                    </a>
                    <a href="/usersearch">
                        <img src="/img/search.png" alt="usersearch" />
                    </a>
                    <a href="/tell">
                        <img src="/img/tell.png" alt="tell" />
                    </a>
                </div> */}
         </div>
         
         <div className="page_title">会員登録</div>
         <form onSubmit={register}>
           <div className="tourokugroyp">
             <div className="group2">
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
               <button type="submit">無料会員登録する</button></div>
             </div>
             </div>
           </form>
           
        </div>
    );
}


export default Register;
