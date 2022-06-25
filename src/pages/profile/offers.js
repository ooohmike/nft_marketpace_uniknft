import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import 'assets/css/market.css';
import "assets/css/filterbar.css";
import layout1 from "assets/img/layout1.png";
import layout2 from "assets/img/layout2.png";
import arrow_down from "assets/img/arrow-down.png";
import arrow_up from "assets/img/arrow-up.png";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Binance from 'assets/img/BSC.png';
import Polygon from 'assets/img/Polygon.png';
import Ethereum from 'assets/img/Ethereum.png';
import Fantom from 'assets/img/Fantom.png';
import Filter from 'components/Filter';
import loading from 'assets/img/primary/loading.png';
import upDown from 'assets/img/market/up_down.png';
import smallUpDown from 'assets/img/market/small_up_down.png';
// import chain from 'assets/img/market/chain.png';

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

const Offers = () => {

    const chain = {
        "Binance": Binance,
        "Ethereum": Ethereum,
        "Fantom": Fantom,
        "Polygon": Polygon
    };

    const { Moralis, account } = useMoralis();

    const pageCounts = 12;
    let history = useHistory();
    const [market_items, setItems] = useState([]);
    const [view, setView] = useState('product-item');
    const [hasMore, setMore] = useState(true);
    const [counts, setCounts] = useState(0);

    useEffect(() => {
        Moralis.start({ serverUrl, appId });
    }, [])

    useEffect(() => {
        getOffers();
    }, [account])

    const getOffers = async () => {
        try {
            const query = new Moralis.Query('Offers');
            query.equalTo('wallet', account);
            let result = await query.find({ useMasterKey: true });
            setCounts(result.length);
            let nfts = [];
            for (let re of result) {
                const subQuery = new Moralis.Query('NFTs');
                subQuery.equalTo('contractAddress', re.attributes.contractAddress);
                subQuery.equalTo('nftId', re.attributes.nftId);
                let offers = await subQuery.first({ useMasterKey: true });
                console.log(offers, re.attributes.nftId, re.attributes.contractAddress);
                nfts.push(offers);
            }
            console.log(nfts, result);
            // setPageNext(nfts);
            setItems(nfts);
        } catch (err) {
            alert(err?.message ? err.message : err);
        }
    }

    const setPageNext = (data) => {
        let curNums = market_items.length;
        let nextNums = curNums + pageCounts;
        if (nextNums < counts) {
            let pageItem = []
            for (let i = curNums; i < nextNums; i++) {
                pageItem.push(data[i]);
            }
            const curPage = market_items.concat(pageItem);
            setItems(curPage);
        }
        else {
            console.log("data", curNums, nextNums);
            setItems(data);
            setMore(false);
        }
    }

    const link2detail = (addr, id) => {
        history.push("/asset/" + addr + "/" + id);
    }

    const options = [
        'one', 'two', 'three'
    ];

    const FilterBar = (

        <div className="filter-bar font-family-1">
            <div className="result-count">
                <span className='font-family-2'>{counts}</span>
                <span>RESULTS</span>
            </div>
            <div className="filter-fields">
                <div>
                    <Dropdown
                        className="all-items"
                        controlClassName="all-item-control"
                        menuClassName="all-item-menu"
                        options={options}
                        placeholder="ALL ITEMS"
                        arrowClosed={
                            <span className="arrow-closed">
                                <img src={arrow_down} />
                            </span>
                        }
                        arrowOpen={
                            <span className="arrow-open">
                                <img src={arrow_up} />
                            </span>
                        }
                    />
                </div>
                <div>
                    <Dropdown
                        className="sort-by"
                        controlClassName="sort-by-control"
                        menuClassName="sort-by-menu"
                        options={options}
                        placeholder="SORT BY"
                        arrowClosed={
                            <span className="arrow-closed">
                                <img src={arrow_down} />
                            </span>
                        }
                        arrowOpen={
                            <span className="arrow-open">
                                <img src={arrow_up} />
                            </span>
                        }
                    />
                </div>
                <div className="layout-icon" onClick={() => setView('product-item')}>
                    <img className="img-responsive" src={layout1} />
                </div>
                <div className="layout-icon" onClick={() => setView('product-item-other')}>
                    <img className="img-responsive" src={layout2} />
                </div>
            </div>
        </div>
    )

    const render_market_item = (props) => {
        return (
            <div className={view} onClick={() => { link2detail(props.contractAddress, props.nftId) }}>
                <div className="hear-score">
                    <i className="fa fa-heart-o customize-heart" />
                    <span className="socre-value">{props?.likes}</span>
                </div>
                <div className="market-img-container">
                    <LazyLoadImage className="img-responsive" style={{ width: '100%' }} src={props?.imgpath} placeholderSrc={loading} />
                </div>
                <div className={"market-detail market-detail-bg-" + (Number(props?.nftId) % 12 + 1)}>
                    <div className="market-item-title">
                        <div className="title-info">{props?.name}</div>
                        <div className="title-info">PRICE</div>
                    </div>
                    <div className="market-item-galaxy">
                        <div className="galaxy-club">{props?.name}{" #" + props?.nftId} </div>
                        <div className="galaxy-price">
                            <div className="cursorPointer"><img className="img-responsive" src={Ethereum} /></div>
                            <div className="market-price">{props?.price}</div>
                        </div>
                    </div>
                    <div className="market-offer">
                        <div className="offer-for">
                            <div className="cursorPointer"><img className="img-responsive" src={chain[props?.chainType]} /></div>
                            <div>OFFER FOR</div>
                        </div>
                        <div className="offer-info">
                            <div className="display-flex cursorPointer"><img className="img-responsive" src={smallUpDown} /></div>
                            <div style={{ fontSize: "16px" }}>{props?.offerFor}</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="market font-family-2">
            <div className="market-content">
                <div className="layout-icon" style={{ float: 'right', padding: '5px' }} onClick={() => setView('product-item-other')}>
                    <img className="img-responsive" src={layout2} />
                </div>
                <div className="layout-icon" style={{ float: 'right', padding: '5px' }} onClick={() => setView('product-item')}>
                    <img className="img-responsive" src={layout1} />
                </div>
                <div className="product-content">
                    {/* <InfiniteScroll 
                        hasMore={hasMore}
                        dataLength={pageCounts}
                        next={setPageNext}
                        loader={<h4>Loading...</h4>} 
                        > */}
                    {
                        market_items.map((market) => {
                            return (
                                render_market_item(market?.attributes)
                            )
                        })
                    }
                    {/* </InfiniteScroll> */}
                </div>
            </div>
        </div>
    );
}

export default Offers;