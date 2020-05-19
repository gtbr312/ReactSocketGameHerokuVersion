import React from 'react'
import walkSprite from './player_walk.png'
import {connect} from 'react-redux'
import playerLogic from './playerLogic'
import { PLAYER_SPRITE_SIZE } from '../../config/miscData'

function Player(props){
    return(  
        <div className='player'
            style={{
                position:'absolute',
                left: props.position[0],
                top: props.position[1],                
                backgroundImage:`url('${walkSprite}')`,               
                //backgroundColor: props.status === 'combat'? 'red' : 'transparent',
                backgroundSize: `${PLAYER_SPRITE_SIZE*8}px ${PLAYER_SPRITE_SIZE*4}px`,
                backgroundPosition: props.spriteLocation,
                width: PLAYER_SPRITE_SIZE,
                height: PLAYER_SPRITE_SIZE
            }}
        />
    )
}

function mapStateToProps(state){
    return{
        ...state.player
    }
}

export default connect(mapStateToProps)(playerLogic(Player))