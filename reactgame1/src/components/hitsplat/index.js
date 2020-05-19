import React from 'react'
import { PLAYER_SPRITE_SIZE } from '../../config/miscData'
import hitsplatImage from './hitsplat.png'
const selectType = (hitFor) => {
    switch(hitFor){
        case undefined:
        case null:
        return 
        default:
            return `url('${hitsplatImage}')`
    }
   
}
//this is shit. Write better solution on server when done with combat. should never allow to get here
const checkHitFor = (props) => {
    if(props.userObj && props.userObj.hitFor){
    return <h3>{props.userObj.hitFor}</h3>
    }
}

function Hitsplat(props){
    

    //Need to rethink this. Maybe position hitsplat as dependent on userObj.focus server location?
    //Need hitsplatposition + userObj.hitfor to scale. Maybe reference CSS grids size/PLAYER_SPRITE_SIZE
    //Need to only look for hitFor conditionally. Ref playerlist first??

    return(
        <div className='hitSplat'
            style={{
                position:'absolute',
                left: props.userObj.position[0]*PLAYER_SPRITE_SIZE,
                top: props.userObj.position[1]*PLAYER_SPRITE_SIZE-PLAYER_SPRITE_SIZE/1.25,//props.position[1]-PLAYER_SPRITE_SIZE/1.25,
                //content: selectType(props.userObj.status),//props.status === 'combat' ? `url('${hitsplatImage}')` : null,                              
                //backgroundColor: props.userObj.status === 'combat'? 'red' : 'green',
                //backgroundSize: `${PLAYER_SPRITE_SIZE*8}px ${PLAYER_SPRITE_SIZE*4}px`,
                backgroundPosition: props.userObj.spriteLocation,
                width: PLAYER_SPRITE_SIZE,
                height: PLAYER_SPRITE_SIZE,
                textAlign:"center",
                color: "yellow",
                backgroundSize: "cover",
                backgroundImage:selectType(props.userObj.hitFor)//`url('${hitsplatImage}')`,
            }}
        >{checkHitFor(props)}
        </div>
    )
}


export default Hitsplat

