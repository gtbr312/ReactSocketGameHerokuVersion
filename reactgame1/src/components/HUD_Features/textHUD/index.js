import React from 'react'
import {connect} from 'react-redux'
import ChatBox from '../chatbox'
import TradeBox from '../tradebox'

function TextHUD (props){
    return(
        <div>
        {props.trade ? <TradeBox/> : <ChatBox/>}
        </div>
    )
}

function mapStateToProps(state){
    return {
        trade:state.app.tradeObj    
    }    
}

export default connect(mapStateToProps)(TextHUD)