import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';
import { arrayRemove } from 'firebase/firestore'; // arrayUnionのインポートを削除
import { auth, db } from './firebaseConfig';

function Tell() {

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
            <div className="page_title">いろんな連絡先</div>
            <div className='tell_list'>
            <ul>
                 <li>夜間休日精神科救急医療機関案内窓口</li>
                  <li><a href="tel:092-474-0088">092-474-0088</a></li>
                <li>#いのちSOS</li>
                <li>こころの健康相談統一ダイヤル</li>
                  <li><a href="tel:0570-064-556">0570-064-556</a></li>
                <li>よりそいホットライン</li>
                <li><a href="tel:0120-279-338">0120-279-338</a></li>
                   <li>いのちの電話</li>
                 <li><a href="tel:0120-783-556">0120-783-556</a></li>
                </ul>
                </div>
        </div>
    );
}

export default Tell;
