import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NearbySearch = () => {
    const [results, setResults] = useState([]);
    const [location, setLocation] = useState({ lat: null, lon: null });
console.log(1);
    useEffect(() => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                console.log(2);
                setLocation({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude
                    
                });
                console.log(3);
            },
            
            
            (error) => {
                console.error("位置情報の取得に失敗しました: ", error);
            }
        );
    }
}, []);


    useEffect(() => {
        if (location.lat && location.lon) {
            console.log(4);
            const fetchNearbyStores = async () => {
                console.log(5);
                try {
                    const response = await axios.get('http://localhost:3001/search', {
                        
                        params: {
                            lat: location.lat,
                            lon: location.lon
                            
                        }
                        
                    });
                    console.log(6);
                    console.log(response); // 追加：レスポンス全体を確認
                    if (response.data && response.data.Feature) {
                        setResults(response.data.Feature);
                        console.log(7);
                    }
                    
                    else {
                        // データがない場合や予期しない形式の場合
                        console.log(response.data);
                        console.log('データが見つからないか、予期しない形式です。');
                        console.log(8);
                    }
                } catch (error) {
                    console.error('Error fetching data: ', error);
                }
            };

            fetchNearbyStores();
        }
    }, [location]);console.log(9);

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
                  <li><a href="tel:0570-064-556">0570-064-556</a></li>
                 <li>よりそいホットライン</li>
                <li><a href="tel:0120-279-338">0120-279-338</a></li>
                  <li>いのちの電話</li>
                  <li><a href="tel:0120-783-556">0120-783-556</a></li>
                </ul>
           </div>
        <div className="page_title">近くの心療内科・精神科</div>
        {results.length > 0 ? (
            <ul>
                {results.map((store, index) => (
                    <li key={index}>
                        <strong>{store.Name}</strong><br />
                        住所: {store.Property.Address}<br />
                        電話番号: {store.Property.Tel1}
                    </li>
                ))}
            </ul>
        ) : (
            <p className='byouinn_text'>店舗が見つかりません。別の検索条件を試してください。</p>
        )}
    </div>
);
};

export default NearbySearch;




//---------------ぼつ

// import React, { useState, useEffect } from 'react';

// function HospitalList() {
//   const [hospitals, setHospitals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');

//   // fetchHospitals関数をuseEffectの外に定義する
//   const fetchHospitals = async () => {
//     try {
//       const response = await fetch(`https://developers-api-aizuwakamatsu-p-mylocal.jp/mgmt/hospital/list/v1?date_from=2021/12/01&date_to=2022/01/31&type=${searchTerm}`, {
//         headers: {
//           "Ocp-Apim-Subscription-Key": "7ee1cf786deb4de090ce0906252dfa94"
//         }
//       });
//       if (!response.ok) {
//         throw new Error('APIリクエストに失敗しました');
//       }
//       const data = await response.json();
//       setHospitals(data.datas);
//     } catch (error) {
//       console.error('エラー:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchHospitals();
//   }, [searchTerm]); // searchTermが変わるたびに効果を再実行

//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   const handleSearch = () => {
//     setLoading(true);
//     fetchHospitals(); // 新しい検索語で病院を検索
//   };

//   if (loading) {
//     return <div>ロード中...</div>;
//   }

//   return (
//     <div className="container">
//              <div className="heder">
//                  <div className="logo2">
//                      <a href="/">
//                          <img src="/img/logo.png" alt="logo" />
//                      </a>
//                  </div>
//                  <div className="icon">
//                      <a href="/chat">
//                          <img src="/img/chat.png" alt="chat" />
//                      </a>
//                   <a href="/usersearch">
//                       <img src="/img/search.png" alt="usersearch" />
//                      </a>
//                      <a href="/tell">
//                          <img src="/img/tell.png" alt="tell" />
//                      </a>
//                  </div>
//             </div>
//              <div className="page_title">いろんな連絡先</div>
//              <div className='tell_list'>
//              <ul>
//                   <li>夜間休日精神科救急医療機関案内窓口</li>
//                    <li><a href="tel:092-474-0088">092-474-0088</a></li>
//                 <li>#いのちSOS</li>
//                 <li>こころの健康相談統一ダイヤル</li>
//                   <li><a href="tel:0570-064-556">0570-064-556</a></li>
//                  <li>よりそいホットライン</li>
//                 <li><a href="tel:0120-279-338">0120-279-338</a></li>
//                   <li>いのちの電話</li>
//                   <li><a href="tel:0120-783-556">0120-783-556</a></li>
//                 </ul>
//            </div>
//       <div>
//         <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="診療科を検索" />
//         <button onClick={handleSearch}>検索</button>
//       </div>
//       <h1>病院リスト</h1>
//       <ul>
//         {hospitals.map((hospital, index) => (
//           <li key={index}>
//             {hospital.medical_institution} - {hospital.type} - {hospital.date}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default HospitalList;

