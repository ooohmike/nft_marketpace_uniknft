import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMoralis } from 'react-moralis';
import Blockie from "components/Blockie";

import '../assets/css/artists.css';
import artistsBrand from '../assets/img/artists/artists1.png';




const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

const Artists = () => {

    const history = useHistory();
    const { Moralis } = useMoralis();
    const [artists, setArtists] = useState([]);

    useEffect(() => {
        getArtists();
    }, []);

    const getArtists = async() => {
        Moralis.start({serverUrl, appId});
        const params = {counts: 24};
        let artists = await Moralis.Cloud.run("getArtists", params);
        console.log(artists);
        let array = [];
        for(let artist of artists) {
            const params = {address: artist.creator};
            console.log("params: ", params);
            console.log("profile: ", artist.user[0].profile)
            let result = await Moralis.Cloud.run("getArtistInfo", params);
            console.log(result);
            const data = {
                profile: artist?.user[0].profile,
                address: artist.creator,
                name: artist?.user[0]?.username,
                count: artist?.count,
                total: result[0]?.total? result[0]?.total:0,
                sale: result[0]?.count? result[0]?.count:0
            };
            array.push(data);
        }
        setArtists(array);
    }

   

    const handleClick = (address) => {
        history.push('/account-artist/' + address);
    }

    const render_artists_item = (props) => {
        return (
            <div className="artist-item col-12 col-sm-6 col-md-4">
                <div className="artist-item-img" onClick={() => handleClick(props?.address)}>
                    {
                        props?.profile ? <img className="img-responsive" src={props?.profile} alt=""/>:
                        <img className="img-responsive" src="../avatar.jpg" alt=""/>
                    }
                </div>
                <div className="artist-detail">
                    <div className="artist-title">
                        <span>{props?.name}</span>
                    </div>
                    <div className="artist-calculation">
                        <div className="division"></div>
                        <div className="original-sale">
                            <div className="property">SALE</div>
                            <div className="value">{props?.sale}</div>
                        </div>
                        <div className="editions">
                            <div className="property">MINTED</div>
                            <div className="value">{props?.count}</div>
                        </div>
                        <div className="total-sale">
                            <div className="property">SALE(ETH)</div>
                            <div className="value">{props?.total}</div>
                        </div>
                    </div>                    
                    {/* <div className="artist-description">
                        DESCRIPTION OF ARTIST
                    </div> */}
                </div>
            </div>
        )
    }

    return (
        <div className="artists font-family-2 container">

            
            <div className="artist-espen-kluge">
                {/* <img className="img-responsive" src={artistsBrand} alt=""/> */}
                Top Artists
            </div>
            <div className="artist-content row">
                {
                    artists.map((artist) => {
                        console.log("artist", artist)
                        return (
                            render_artists_item(artist)
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Artists;