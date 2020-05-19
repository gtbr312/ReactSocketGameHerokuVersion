import React from 'react'
import {connect} from 'react-redux'

function Stats (props){
    return(
        <div className='stats'>
            <h1>Bob</h1>
            <h2>Health: {props.health}</h2>
            <p>Coins: {props.player.coins}</p>
            <h4>Items:</h4>
                <ul>
                {
                    props.player.items.map((item)=>{
                    return <li key={item}>{item}</li>})
                }
                </ul>
        </div>
    )
}

function mapStateToProps(state){
    return {
        
       player:state.player,
       health:state.player.skills[0]
    }    
}

export default connect(mapStateToProps)(Stats)