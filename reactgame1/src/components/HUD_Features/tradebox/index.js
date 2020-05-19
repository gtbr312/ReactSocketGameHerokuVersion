import React from 'react'
import {connect} from 'react-redux'
import store from '../../../config/store'


class TradeBox extends React.Component {

    
acceptTrade = () => {
    store.dispatch({type:'CHANGE_COINS', payload:{amount:this.props.tradeObj.coinsPrice * -1}})   
    store.dispatch({type:'ADD_ITEM', payload:{item:this.props.tradeObj.offerItem}})
    store.dispatch({type:'REMOVE_ITEM', payload:{item:this.props.tradeObj.itemPrice}})
    store.dispatch({type:'SET_TRADE', payload:{tradeObj:null}})
}

rejectTrade = () => {
    store.dispatch({type:'SET_TRADE', payload:{tradeObj:null}})
}
        //v ugly. add custom buttons. maybe break out trade offers into a modal instead?
    render(){
        return(
            <div>
        {
        this.props.tradeObj.itemPrice ?
        <h2>{this.props.tradeObj.vendor} wants to trade their {this.props.tradeObj.offerItem} for your {this.props.tradeObj.itemPrice}</h2> :
        <h2>{this.props.tradeObj.vendor} wants to trade their {this.props.tradeObj.offerItem} for {this.props.tradeObj.coinsPrice} coins</h2>
        }
        <button onClick={this.acceptTrade}>Accept Trade</button>
        <button onClick={this.rejectTrade}>Reject Trade</button>
        </div>
        )
    }
}

function mapStateToProps(state){
    return {
        tradeObj:state.app.tradeObj
    }    
}

export default connect(mapStateToProps)(TradeBox)