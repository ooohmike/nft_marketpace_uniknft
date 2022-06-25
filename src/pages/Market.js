import React, { Component } from 'react';
import '../assets/css/market.css';
import FilterBar from '../components/FilterBar';
import Filter from '../components/Filter';
import market1 from '../assets/img/market/secondary1.png';
import market2 from '../assets/img/market/secondary2.png';
import market3 from '../assets/img/market/secondary3.png';
import market4 from '../assets/img/market/secondary4.png';
import market5 from '../assets/img/market/secondary5.png';
import market6 from '../assets/img/market/secondary6.png';
import market7 from '../assets/img/market/secondary7.png';
import market8 from '../assets/img/market/secondary8.png';
import market9 from '../assets/img/market/secondary9.png';
import market10 from '../assets/img/market/secondary10.png';
import market11 from '../assets/img/market/secondary11.png';
import market12 from '../assets/img/market/secondary12.png';
import upDown from '../assets/img/market/up_down.png';
import smallUpDown from '../assets/img/market/small_up_down.png';
import chain from '../assets/img/market/chain.png';

import cn from 'classnames';

const market_list = [
    {
        id:1,
        profile_image : market1,
        score_value: 8,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:2,
        profile_image : market2,
        score_value: 0,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:3,
        profile_image : market3,
        score_value: 2,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:4,
        profile_image : market4,
        score_value: 2, 
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:5,
        profile_image : market5,
        score_value: 8,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:6,
        profile_image : market6,
        score_value: 4,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:7,
        profile_image : market7,
        score_value: 8,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {   
        id:8,
        profile_image : market8,
        score_value: 0,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:9,
        profile_image : market9,
        score_value: 2,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:10,
        profile_image : market10,
        score_value: 8,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {   
        id:11,
        profile_image : market11,
        score_value: 0,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    },
    {
        id:12,
        profile_image : market12,
        score_value: 2,
        title : "CRYPTOSHARKS(SHARK)",
        price : "0.005",
        galaxy: "GALACTICAPE #5521",
        socre: 8863,
        offerFor: "0.8078",
    }
]
class Market extends Component {
    constructor() {
        super();
    }

    render_market_item = (props) => {
        return (
            <div className="product-item">
                <div className="hear-score">
                    <i className="fa fa-heart-o customize-heart" />
                    <span className="socre-value">{props.score_value}</span>
                </div>
                <div className="market-img-container">
                    <img className="img-responsive" src={props.profile_image} />
                </div>
                <div className={cn("market-detail", 
                                    {"market-detail-bg-1" : props.id === 1}, 
                                    {"market-detail-bg-2" : props.id === 2}, 
                                    {"market-detail-bg-3" : props.id === 3},
                                    {"market-detail-bg-4" : props.id === 4},
                                    {"market-detail-bg-5" : props.id === 5},
                                    {"market-detail-bg-6" : props.id === 6},
                                    {"market-detail-bg-7" : props.id === 7},
                                    {"market-detail-bg-8" : props.id === 8},
                                    {"market-detail-bg-9" : props.id === 9},
                                    {"market-detail-bg-10" : props.id === 10},
                                    {"market-detail-bg-11" : props.id === 11},
                                    {"market-detail-bg-12" : props.id === 12})}>
                    <div className="market-item-title">
                        <div className="title-info">{props.title}</div>
                        <div className="title-info">PRICE</div>
                    </div>
                    <div className="market-item-galaxy">
                        <div className="galaxy-club">{props.galaxy}</div>
                        <div className="galaxy-price">
                            <div className="cursorPointer"><img className="img-responsive" src={upDown} /></div>
                            <div className="market-price">{props.price}</div>
                        </div>
                    </div>
                    <div className="market-offer">
                        <div className="offer-for">
                            <div className ="cursorPointer"><img className="img-responsive" src={chain} /></div>
                            <div>OFFER FOR</div>
                        </div>
                        <div className="offer-info">
                            <div className="display-flex cursorPointer"><img className="img-responsive" src={smallUpDown} /></div>
                            <div style={{fontSize: "16px"}}>{props.offerFor}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="market font-family-2">
                <Filter />                
                <div className="market-content">
                    <FilterBar />
                    <div className="product-content">
                        {
                            market_list.map((market) => {
                                return (
                                    this.render_market_item(market)
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Market;