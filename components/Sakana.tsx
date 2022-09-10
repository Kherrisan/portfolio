import ReactDOM from 'react-dom'
import {Component, ReactNode, useEffect} from "react";

const Sakana = () => {
    useEffect(()=>{
        const initSakanaWidget =async () => {
            const SakanaWidget = require('sakana-widget')
            new SakanaWidget().mount('#sakana-widget');
        }
        initSakanaWidget()
    })

    return (<div id='sakana-widget' className='grid place-content-center mt-8'/>)
}
  
export default Sakana
  