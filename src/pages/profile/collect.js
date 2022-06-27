import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useMoralisQuery } from 'react-moralis';
import { Button } from "react-bootstrap";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import InfiniteScroll from 'react-infinite-scroll-component';
import "assets/css/market.css";
import Web3 from "web3";
import { Row, Col, Form, FormControl, Button as BtnReact } from 'react-bootstrap';
import { Table, Space, Modal } from "antd";

import layout1 from "assets/img/layout1.png";
import layout2 from "assets/img/layout2.png";
import Binance from 'assets/img/BSC.png';
import Polygon from 'assets/img/Polygon.png';
import Ethereum from 'assets/img/Ethereum.png';
import Fantom from 'assets/img/Fantom.png';

import loading from 'assets/img/primary/loading.png';
import smallUpDown from 'assets/img/market/small_up_down.png';

import { Contract } from '../../helpers/contractInfo';
import { MarketContract } from 'helpers/marketInfo.js';
import { useMoralisFile, useMoralis, useChain, useNewMoralisObject } from 'react-moralis';

import moment from "moment-timezone";
import DateTimeRangeContainer from "react-advanced-datetimerange-picker";

const Collect = ({ address }) => {
	const { user, Moralis, isAuthenticated, enableWeb3, isWeb3Enabled } = useMoralis();
	const { data, error, isLoading } = useMoralisQuery("NFTs", query =>
		query
			.equalTo("currentOwner", address)
			.descending("updatedAt")
	);
	const chain = {
		"Binance": Binance,
		"Ethereum": Ethereum,
		"Fantom": Fantom,
		"Polygon": Polygon
	};
	let history = useHistory();
	const [view, setView] = useState('product-item');
	const [market_items, setItems] = useState([]);
	const pageCounts = 8;
	const [counts, setCounts] = useState(0);
	const [hasMore, setMore] = useState(true);
	const web3 = new Web3(Web3.givenProvider);
	const [isProcess, setIsProcess] = useState(false);
	const [selectedNFT, setSelectedNFT] = useState(null)
	const { save } = useNewMoralisObject("NFTs");
	const [isModalSell, setModalSell] = useState(false);
	const [price, setPrice] = useState(0);

	let now = new Date();
	const [start, setStart] = useState(moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0)))
	const [end, setEnd] = useState(moment(start).add(1, "days").subtract(1, "seconds"))
	const [timezone, setTimezone] = useState("")

	useEffect(() => {
		// console.log(data[0].attributes);
		setCounts(data.length);
		setPageNext()
	}, [data]);

	const setPageNext = () => {
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

	const link2detail = (props) => {
		const nft = props.attributes
		console.log(nft)
		if (nft.hasOwnProperty('nftId')) {
			console.log(nft.nftId)
			history.push("/asset/" + nft.contractAddress + "/" + nft.nftId);
		} else {
			console.log("no nft Id")
			history.push("/asset/" + nft.contractAddress + "/" + nft.uniqueId);
		}

	}

	const sellNFT = async () => {
		setIsProcess(true)
		const { id, attributes } = selectedNFT
		const { chainId, metadataPath, royalty } = attributes
		try {
			const marketContract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainId]);
			const mintContract = new web3.eth.Contract(Contract.contractAbi, Contract[chainId]);
			// const provider  = new ethers.providers.JsonRpcProvider();
			// const signer = provider.getSigner(0);
			// console.log("signer", signer)
			// const mintContract = new ethers.Contract(Contract[chainId], Contract.contractAbi, signer)
			var gasPrice = await web3.eth.getGasPrice();
			// var gasPrice = await ethers.getDefaultProvider().getGasPrice();

			console.log("current gas price is: ", gasPrice * 1.1)
			console.log("mintContract", marketContract, metadataPath, chainId)
			// let receiptObj = await mintContract.methods.createArtwork(metaUrl, royalty);
			// console.log("receiptObj", receiptObj)
			// let receipt =  await receiptObj.send({from: user.attributes.ethAddress})
			// let receipt; 
			let receipt = await marketContract.methods.createSellArt(metadataPath, royalty, price).send({ from: user.attributes.ethAddress, gasPrice: gasPrice });
			// Math.round(gasPrice * 1.1)
			console.log("receipt", receipt)
			let tokenId = receipt.events.ArtSellCreated.returnValues.tokenId;
			console.log("tokenId", tokenId)
			const tokenAddress = await mintContract.methods.ownerOf(tokenId);
			console.log("tokenAddress", tokenAddress)
			alert('mint success')

			console.log(selectedNFT)
			const query = new Moralis.Query(selectedNFT);
			query.equalTo("id", id);

			await selectedNFT.save()
				.then(nft => {
					// alert('success')
					console.log(nft)
					nft.set("price", parseFloat(price))
					nft.set("active", true)
					nft.set("nftId", tokenId)
					nft.set("contractAddress", Contract[chainId])
					nft.set("sellType", "now")
					console.log(nft)
					return nft.save();
				})
				.catch(err => {
					console.log(err)
				});
			// await save({ id: id, price: price });
			// await save({ id: id, active: true });
			// await save({ id: id, nftId: tokenId });
			// await save({ id: id, contractAddress: Contract[chainId] });

			// const sellContract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainId]);
			// let result = await sellContract.methods.createSellArt(price, tokenId).send({ from: user.attributes.ethAddress });
			// alert("NFT is on sale!");

			setIsProcess(false);
			setModalSell(false)
		} catch (err) {
			console.log(err)
			alert(err?.message ? err?.message : err);
			setIsProcess(false);
		}
	}

	const showModal = (props) => {
		console.log(props)
		setModalSell(true)
		setSelectedNFT(props)
	}

	const goSellPage = (props) => {
		const nft = props.attributes
		console.log(props)
		console.log("/sell/" + nft.currentOwner + "/" + nft.uniqueId)
		history.push("/sell/" + nft.currentOwner + "/" + nft.uniqueId);
	}

	const render_market_item = (props, index) => {
		const nft = props.attributes
		return (
			<div className={view} onClick={() => link2detail(props)} key={index} style={{ border: "1px solid #eee", margin: "10px" }}>
				<div className="hear-score">
					<i className="fa fa-heart-o customize-heart" />
					<span className="socre-value">{nft.likes}</span>
				</div>
				<div className="market-img-container">
					<LazyLoadImage className="img-responsive" src={nft.imgpath} style={{ width: '100%' }} placeholderSrc={loading} />
				</div>
				<div className={"market-detail"}>
					<div className="market-item-title">
						<div className="title-info">{nft.name}</div>
						{nft.active ? (<div className="title-info">PRICE</div>) :
							(<div className="cursorPointer chainType"><img className="img-responsive" src={chain[nft.chainType]} /></div>)}
					</div>
					<div className="market-item-galaxy">
						{/* <div className="galaxy-club">{" #" + nft.nftId} </div> */}
						{nft.active && (<div className="galaxy-price">
							<div className="cursorPointer"><img className="img-responsive" src={Ethereum} /></div>
							<div className="market-price">{nft.price}</div>
						</div>)}
					</div>
					<div className="market-offer">
						<div className="offer-for">
							{nft.active && <div className="cursorPointer"><img className="img-responsive" src={chain[nft.chainType]} /></div>}

						</div>
						<div className="offer-info">
							{/* <div className="display-flex cursorPointer"><img className="img-responsive" src={smallUpDown} /></div> */}
						</div>
					</div>
					<div className="for-market">
						{
							!nft.active ?
								<>Not on sale</>
								:
								<></>
						}
						{/* {
							!nft.active && (
								<>
									<BtnReact className="for-market-btn">Edit</BtnReact>
									<BtnReact variant="primary" className="for-market-btn" onClick={() => goSellPage(props)}>Sell</BtnReact>
								</>
							)
						} */}
					</div>
				</div>
			</div>
		)
	}

	const applyCallback = (startDate, endDate) => {
		console.log("Apply Callback");
		console.log(startDate.format("DD-MM-YYYY HH:mm"));
		console.log(endDate.format("DD-MM-YYYY HH:mm"));
		setStart(startDate)
		setEnd(endDate)
	}

	const rangeCallback = (index, value) => {
		console.log(index, value);
	}

	const DateTimePicker = () => {
		// let now = new Date();
		// let start = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0));
		// let end = moment(start).add(1, "days").subtract(1, "seconds");
		let ranges = {
			"Today Only": [moment(start), moment(end)],
			"3 Days": [moment(start), moment(end).add(3, "days")],
			"5 Days": [moment(start), moment(end).add(5, "days")],
			"1 Week": [moment(start), moment(end).add(7, "days")],
			"2 Weeks": [moment(start), moment(end).add(14, "days")],
			"1 Month": [moment(start), moment(end).add(1, "months")],
			"1 Year": [moment(start), moment(end).add(1, "years")]
		};
		let local = {
			format: "DD-MM-YYYY HH:mm",
			sundayFirst: false
		};
		let maxDate = moment(end).add(24, "year");

		let value = `${start.format(
			"DD-MM-YYYY HH:mm"
		)} - ${end.format("DD-MM-YYYY HH:mm")}`;
		let disabled = true;
		return (
			<div>
				<DateTimeRangeContainer
					ranges={ranges}
					start={start}
					end={end}
					local={local}
					maxDate={maxDate}
					applyCallback={applyCallback}
					rangeCallback={rangeCallback}
					smartMode
				>
					<FormControl
						id="formControlsTextB"
						type="text"
						label="Text"
						placeholder="Enter text"
						style={{ cursor: "pointer" }}
						disabled={disabled}
						value={value}
					/>
				</DateTimeRangeContainer>
				<br />
			</div>
		);
	}

	const setRange = () => {
		console.log(moment(start).unix())
	}

	return (
		<>
			<div className="market font-family-2">
				<div className="market-content">
					<div className="layout-icon" style={{ float: 'right', padding: '5px' }} onClick={() => setView('product-item-other')}>
						<img className="img-responsive" src={layout2} />
					</div>
					<div className="layout-icon" style={{ float: 'right', padding: '5px' }} onClick={() => setView('product-item')}>
						<img className="img-responsive" src={layout1} />
					</div>
					{/* <DateTimePicker /> */}
					{/* <button onClick={setRange}>Apply</button> */}
					<div className="product-content">
						<InfiniteScroll
							hasMore={hasMore}
							dataLength={pageCounts}
							next={setPageNext}
							loader={<span>Loading...</span>}
						>
							{
								market_items.map((market, index) => {
									return (
										render_market_item(market, index)
									)
								})
							}
						</InfiniteScroll>
					</div>
				</div>
			</div>
			<Modal
				visible={isModalSell}
				title="Place price"
				footer={[
					<Button type="primary" style={{ marginRight: '50px' }} onClick={() => sellNFT()} disabled={isProcess}>{isProcess ? "Processing..." : "Sell"}</Button>,
					<Button
						size="large"
						type="primary"
						onClick={() => {
							setModalSell(false);
						}}
					>
						Cancel
					</Button>
				]}
				onCancel={() => setModalSell(false)}
				bodyStyle={{
					padding: "15px",
					fontSize: "17px",
					fontWeight: "500",
				}}
				style={{ fontSize: "16px", fontWeight: "500" }}
				width="500px"
			>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<img src={Ethereum} className="eth" style={{ width: '30px', height: '30px' }} alt="eth" />&nbsp;
					<Form.Control type="number" min={0} value={price} onInput={e => setPrice(e.target.value)} />
				</div>
			</Modal>
		</>
	);
};

export default Collect;