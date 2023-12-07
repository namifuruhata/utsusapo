import React, { useState } from "react";
import { auth } from './firebaseConfig'; // Firebase設定をインポート
import { createUserWithEmailAndPassword } from "firebase/auth";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registrationStatus, setRegistrationStatus] = useState(null);

  const register = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setRegistrationStatus("success");
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setRegistrationStatus("alreadyRegistered");
      } else {
        console.error("アカウント登録エラー", error);
        setRegistrationStatus("error");
      }
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
      {/* 登録状態に応じたポップアップ表示 */}

      {registrationStatus === "success" &&       <div className="tourokukannryou">登録完了しました。</div>}
      {registrationStatus === "alreadyRegistered" &&       <div className="tourokukannryou">すでに登録されています。</div>}
      {registrationStatus === "error" &&       <div className="tourokukannryou">登録に失敗しました。もう一度お試しください。</div>}

    </div>
  );
}


export default Register;
