import React, { useEffect, useState, useMemo } from 'react'
import { SummaryConfig } from './config'

const formFields = new Array(20).fill(1).map((x, i) => {
  return {
    type: 'formField',
    value: new Date().valueOf() + '_' + i,
    name: new Date().valueOf() + '_' + i,
  }
})
const standardFields = new Array(20).fill(1).map((x, i) => {
  return {
    type: 'standardField',
    value: new Date().valueOf() + '_' + i,
    name: new Date().valueOf() + '_' + i,
  }
})

function App() {
  const [summaryList, setSummaryList] = useState([])
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
