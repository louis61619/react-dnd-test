import React, { useEffect, useState, useMemo } from 'react'
import { SummaryConfig } from './config'

function generateRandomLetters() {
  var length = Math.floor(Math.random() * 16) + 5; // 生成介於5到20之間的隨機長度
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; // 英文字母

  for (var i = 0; i < length; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length); // 隨機選擇一個字母
    result += characters.charAt(randomIndex);
  }

  return result;
}

const formFields = new Array(20).fill(1).map((x, i) => {
  const v = generateRandomLetters()
  return {
    type: 'formField',
    value: v + '_' + i,
    name: v + '_' + i,
  }
})
const standardFields = new Array(20).fill(1).map((x, i) => {
  const v = generateRandomLetters()
  return {
    type: 'standardField',
    value: v + '_' + i,
    name: v + '_' + i,
  }
})

function pickRandomItemsFromArray(array) {
  if (array.length <= 5) {
    return array; // 如果陣列長度小於或等於5，直接返回整個陣列
  } else {
    var result = [];
    var tempArray = array.slice(); // 創建一個副本陣列以避免修改原始陣列

    for (var i = 0; i < 5; i++) {
      var randomIndex = Math.floor(Math.random() * tempArray.length); // 隨機選擇一個索引
      result.push(tempArray[randomIndex]); // 將選中的項目添加到結果陣列
      tempArray.splice(randomIndex, 1); // 從臨時陣列中刪除已選中的項目
    }

    return result;
  }
}

function App() {
  const [summaryList, setSummaryList] = useState([...pickRandomItemsFromArray(formFields), ...pickRandomItemsFromArray(standardFields)])
  const [summaryPopup, setSummaryPopup] = useState([])


  return (
    <div className="App">
      <SummaryConfig 
          formFields={formFields}
					standardFields={standardFields}
					stickySummary={summaryList}
					setStickySummary={(v) => {
						setSummaryList(v);
					}}
					floatSummary={summaryPopup}
					setFloatSummary={(v) => {
						setSummaryPopup(v);
					}} />
    </div>
  );
}

export default App;
