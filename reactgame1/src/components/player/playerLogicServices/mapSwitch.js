import {PLAYER_SPRITE_SIZE} from '../../../config/miscData'

export const mapSwitch = (newMap,currentMap) => {
    let position
    switch(newMap){
        case 'spawnSite':
            switch(currentMap){
                case 'camp':
                    position = [PLAYER_SPRITE_SIZE*19,PLAYER_SPRITE_SIZE*4]
                    break;
                case 'woods':
                    position = [PLAYER_SPRITE_SIZE*3,PLAYER_SPRITE_SIZE*9]
                    break;
                case 'wreck':
                    position = [PLAYER_SPRITE_SIZE*0,PLAYER_SPRITE_SIZE*2]
                    break;
                case 'temple':
                    position = [PLAYER_SPRITE_SIZE*18,PLAYER_SPRITE_SIZE*0]
                    break;
                case 'spawnSite':
                    position = [PLAYER_SPRITE_SIZE*18,PLAYER_SPRITE_SIZE*0]
                    break;
                default:
                    break;
            }
        break;
        case 'camp':
            position=[PLAYER_SPRITE_SIZE*0,PLAYER_SPRITE_SIZE*4]
            break;
        case 'woods':
            position=[PLAYER_SPRITE_SIZE*3,PLAYER_SPRITE_SIZE*0]
            break;
        case 'wreck':
            position=[PLAYER_SPRITE_SIZE*19,PLAYER_SPRITE_SIZE*2]
            break;
        case 'temple':
            position=[PLAYER_SPRITE_SIZE*18,PLAYER_SPRITE_SIZE*9]
            break;
        default:
            console.log('default',currentMap)
            break;
    }
    return position
}