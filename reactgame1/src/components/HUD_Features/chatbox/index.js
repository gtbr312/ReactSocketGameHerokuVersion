import React from 'react'
import {connect} from 'react-redux'

function ChatBox (props){
    return(
        <div>
        {props.player.messages.map((message,i) => i===props.player.messages.length-1 ? <h3 key={i}>{message}</h3>: <p key={i}>{message}</p>)}
        </div>
    )
}

function mapStateToProps(state){
    return {
       player:state.player
    }    
}

export default connect(mapStateToProps)(ChatBox)