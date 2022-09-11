import { useEffect } from "react";

const Sakana = () => {
    useEffect(() => {
        const initSakanaWidget = async () => {
            const SakanaWidget = require('sakana-widget');
            const takina = SakanaWidget.getCharacter('chisato');
            takina.initialState = {
                ...takina.initialState,
                i: 0.1,
            };
            SakanaWidget.registerCharacter('chisato-slow', takina);
            new SakanaWidget({ character: 'chisato-slow' }).mount('#sakana-widget');
        }
        initSakanaWidget()
    })

    return (<div id='sakana-widget' className='grid place-content-center mt-8' />)
}

export default Sakana
