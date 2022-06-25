import React, { useEffect, useState } from 'react';
import { useMoralis } from 'react-moralis';
import { useHistory } from 'react-router';
import Blockie from "components/Blockie";

import '../assets/css/collector.css';
import top_collector from '../assets/img/collector/top-collector.png';


const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

const Collector = () => {

    const {Moralis} = useMoralis();
    const [collectors, setCollectors] = useState([]);
    const history = useHistory();

    useEffect(() => {
        getCollector();
    }, [])

    const getCollector = async() => {
        Moralis.start({serverUrl, appId});
        const params = {counts: 16};
        let collectors = await Moralis.Cloud.run("getCollectors", params);
        console.log(collectors);
        let array = [];
        for(let collector of collectors) {
            const params = {address: collectors.creator};
            let result = await Moralis.Cloud.run("getCollectorInfo", params);
            console.log(result);
            const data = {
                profile: collector?.user[0].profile,
                address: collector.creator,
                name: collector?.user[0]?.username,
                count: collector?.count,
                total: result[0]?.total? result[0]?.total:0,
                sale: result[0]?.count? result[0]?.count:0
            };
            array.push(data);
        }
        setCollectors(array);
    }

    const handleClick = (address) => {
        history.push('/account-collector/' + address);
    }

    const render_collector_item = (props) => {
        return (
            <div className="collector-item col-12 col-sm-6 col-md-4">
                <div onClick={() => handleClick(props?.address)} style={{cursor:'pointer'}}>
                    {
                        props?.profile ? <img className="img-responsive" src={props?.profile} alt=""/>:
                        <img className="img-responsive" src="../collectors6.png" alt=""/>
                    }
                </div>
                <div className="collector-tag">
                    <div>COLLECTOR</div>
                </div>
                <div className="collector-detail">
                    <div className="collector-title">
                        <span>{props?.name}</span>
                    </div>
                    <div className="collection-calculation">
                        <div className="division"></div>
                        <div className="collections">
                            <div className="property">Listings</div>
                            <div className="value">{props.count}</div>
                        </div>
                        <div className="editions">
                            <div className="property">Buy Counts</div>
                            <div className="value">{props.sale}</div>
                        </div>
                        <div className="total">
                            <div className="property">TOTAL(ETH)</div>
                            <div className="value">{props.total}</div>
                        </div>
                    </div>
                </div>
                {/* <div className="collector-description">
                    DESCRIPTION OF ARTIST
                </div> */}
            </div>
        )
    }

    return (
        <div className="collector font-family-2 container">
            <div className="top-collectors">
                <div className="img-container">
                    <img className="img-responsive" src={top_collector} alt=""/>
                </div>
            </div>
            <div className="collector-content row">
                {
                    collectors.map((collector) => {
                        return (
                            render_collector_item(collector)
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Collector;