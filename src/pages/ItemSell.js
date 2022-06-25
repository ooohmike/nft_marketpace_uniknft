import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useMoralis, useChain } from "react-moralis";
import { Row, Col, Container, Tab, Nav, Button, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import "assets/css/itemSell.css";
import Web3 from "web3";

import Binance from '../assets/img/BSC.png';
import Polygon from '../assets/img/Polygon.png';
import Ethereum from '../assets/img/Ethereum.png';
import Fantom from '../assets/img/Fantom.png';

import { MarketContract } from 'helpers/marketInfo';
import { Contract } from 'helpers/contractInfo';
import { chainNum, chain } from '../helpers/networks'

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

const ItemSell = () => {
	const { Moralis, account, user } = useMoralis();
	const { ownerAddress, uniqueId } = useParams();
	const history = useHistory();
	const [sellPrice, setSellPrice] = useState(0);
	const [bidPrice, setBidPrice] = useState(0);
	const [increment, setIncrement] = useState(0);
	const [period, setPeriod] = useState("3");
	const [item, setItem] = useState({});
	const [imgHeight, setImgHeight] = useState();
	const [isProcess, setProcess] = useState(false);
	const { switchNetwork } = useChain();

	const web3 = new Web3(Web3.givenProvider);
	useEffect(() => {
		// if(account !== address) history.push("/");
		Moralis.start({ serverUrl, appId });
		checkOwner();

	}, []);

	const handleSellClick = async () => {
		let chainId = chainNum[item?.attributes?.chainType];
		try {
			setProcess(true);
			await switchNetwork(chainNum[item?.attributes?.chainType]);
			if (Number(sellPrice) <= 0) {
				alert("please insert price");
				setProcess(false);
				return;
			}
			const contractAddr = MarketContract[chainNum[item?.attributes?.chainType]];
			console.log(chainNum[item?.attributes?.chainType])
			console.log(Contract[chainNum[item?.attributes?.chainType]])
			const unik = new web3.eth.Contract(Contract.contractAbi, Contract[chainNum[item?.attributes?.chainType]]);

			var gasPrice = await web3.eth.getGasPrice();
			// let tx = await unik.methods.approve(contractAddr, item?.attributes?.nftId).send({ from: user.attributes.ethAddress, gasPrice: Math.round(gasPrice * 1.1) });
			// if(chainId === "0xfa" || chainId === "0x89") {
			//     tx = await unik.methods.approve(contractAddr, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 100000000000})
			// } else if (chainId === "0x38") {
			//     tx = await unik.methods.approve(contractAddr, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 10000000000})
			// } else {
			//     tx = await unik.methods.approve(contractAddr, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 100000000000})
			// }   
			const market = new web3.eth.Contract(MarketContract.contractAbi, contractAddr);
			const price = Moralis.Units.ETH(sellPrice);
			let re = await market.methods.createSellArt(item?.attributes?.metadataPath, item?.attributes?.royalty, price).send({ from: account, gasPrice: Math.round(gasPrice * 1.1) });
			// alert(MarketContract[chainNum[item?.attributes?.chainType]])
			let tokenId = re.events.ArtSellCreated.returnValues.tokenId;
			console.log("tokenId", tokenId)
			const tokenAddress = await unik.methods.ownerOf(tokenId).call({ from: account });;
			console.log("tokenAddress", tokenAddress)
			// if(chainId === "0xfa" || chainId === "0x89") {
			//     re = await market.methods.createSellArt(price, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 100000000000});
			// } else if(chainId === "0x38") {
			//     re = await market.methods.createSellArt(price, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 10000000000});
			// } else {
			//     re = await market.methods.createSellArt(price, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 100000000000});
			// }
			item.set('price', Number(sellPrice));
			item.set('active', true);
			item.set('sellType', 'now');
			item.set('nftId', tokenId);
			item.set('tokenAddress', tokenAddress);
			await item.save();
			console.log(item)
			alert('Success');
			setProcess(false);
			alert(item?.attributes?.contractAddress)
			history.push('/asset/' + item?.attributes?.contractAddress + '/' + tokenId);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			setProcess(false);
		}
	}

	const handleStart = async () => {
		let chainId = chainNum[item?.attributes?.chainType];
		try {
			setProcess(true);
			console.log(chainNum[item?.attributes?.chainType], item?.attributes?.chainType);
			await switchNetwork(chainNum[item?.attributes?.chainType]);
			if (Number(bidPrice) <= 0 || increment <= 0) {
				alert("please insert price");
				setProcess(false);
				return;
			}
			const contractAddr = MarketContract[chainNum[item?.attributes?.chainType]];
			console.log("contractAddr", contractAddr)
			const unik = new web3.eth.Contract(Contract.contractAbi, Contract[chainNum[item?.attributes?.chainType]]);
			console.log("unik", unik);
			var gasPrice = await web3.eth.getGasPrice();
			// let tx = await unik.methods.approve(contractAddr, item?.attributes?.nftId).send({ from: user.attributes.ethAddress, gasPrice: Math.round(gasPrice * 1.1) });
			// if(chainId === "0xfa" || chainId === "0x89") {
			//     tx = await unik.methods.approve(contractAddr, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 100000000000});
			// } else if (chainId === "0x38") {
			//     tx = await unik.methods.approve(contractAddr, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 10000000000});
			// } else {
			//     tx = await unik.methods.approve(contractAddr, item?.attributes?.nftId).send({from:user.attributes.ethAddress, gasPrice: 100000000000});
			// }
			const market = new web3.eth.Contract(MarketContract.contractAbi, contractAddr);
			const price = Moralis.Units.ETH(bidPrice);
			// console.log(price, item?.attributes?.nftId, 0, period);
			let re = await market.methods.createAuction(item?.attributes?.metadataPath, item?.attributes?.royalty, price, 0, parseInt(period)).send({ from: account, gasPrice: Math.round(gasPrice * 1.1) });
			let tokenId = re?.events.AuctionCreated.returnValues.tokenId;
			console.log("tokenId", tokenId)
			const tokenAddress = await unik.methods.ownerOf(tokenId).call({ from: account });;
			console.log("tokenAddress", tokenAddress)
			// if (chainId === "0xfa" || chainId === "0x89") {
			//     re = await market.methods.createAuction(price, item?.attributes?.nftId, 0, period).send({from:user.attributes.ethAddress, gasPrice: 100000000000});
			// } else if (chainId === "0x38") {
			//     re = await market.methods.createAuction(price, item?.attributes?.nftId, 0, period).send({from:user.attributes.ethAddress, gasPrice: 10000000000});
			// } else {
			//     re = await market.methods.createAuction(price, item?.attributes?.nftId, 0, period).send({from:user.attributes.ethAddress, gasPrice: 100000000000});
			// }
			console.log(re);
			const stamp = re?.events.AuctionCreated.returnValues.end;
			item.set('price', Number(bidPrice));
			item.set('active', true);
			item.set('sellType', 'auction');
			item.set('nftId', tokenId);
			item.set('tokenAddress', tokenAddress);
			await item.save();
			console.log(item)

			const query = new Moralis.Object('Auctions');
			query.set('nftId', tokenId);
			const d = new Date(stamp * 1000);
			query.set('contractAddress', Contract[chainNum[item?.attributes?.chainType]]);
			query.set('end', d);
			query.set('price', Number(bidPrice));
			query.set('owner', account);
			query.set('highPrice', bidPrice);
			query.set('reserve', increment);
			query.set('active', true);
			query.set('highBidder', '');
			await query.save();
			alert("success");
			setProcess(false);
			history.push('/asset/' + item.attributes.contractAddress + '/' + tokenId);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			setProcess(false);
			return;
		}

	}

	const card = useRef(null);

	useEffect(() => {
		// console.log('width', card.current ? card.current.offsetWidth : 0);
		setImgHeight(card.current ? card.current.offsetWidth : imgHeight);
	}, [card.current]);

	const checkOwner = async () => {
		const NFT = Moralis.Object.extend("NFTs");
		const query = new Moralis.Query(NFT);
		console.log(uniqueId)
		console.log(query)
		query.equalTo('currentOwner', ownerAddress);
		query.equalTo('uniqueId', uniqueId);
		let result = await query.first({ useMasterKey: true });
		console.log(result)
		if (result) {
			if (account !== result?.attributes.currentOwner || result?.attributes.active) history.push("/");
			setItem(result);
			// console.log(item?.attributes?.chainType);
		} else {
			history.push("/");
		}
	};

	return (
		<>
			<br /><br /><br /><br /><br />
			<Container className="itemsell">
				<Row>
					<Col md={8}>
						<Tab.Container defaultActiveKey="fixed">
							<Nav role="tablist">
								<Nav.Item className="font-family-1">
									<Nav.Link eventKey="fixed"><h5>Set Price</h5>Sell at a fixed price or declining price</Nav.Link>
								</Nav.Item>
								<Nav.Item className="font-family-1">
									<Nav.Link eventKey="bid"><h5>Highest Bid</h5>Auction to the highest bidder</Nav.Link>
								</Nav.Item>
							</Nav>
							<br />
							<Tab.Content>
								<Tab.Pane eventKey="fixed">
									<div className="tab-price font-family-1">
										<h5>Price</h5>
										<div className="tab-value">
											<img src={Ethereum} className="eth" alt="eth" />&nbsp;
											<Form.Control type="number" value={sellPrice} min={0} onInput={e => setSellPrice(e.target.value)} />
											&nbsp;<span>ETH</span>
										</div>
									</div>
									<br />
									<Button className="btn-sell" onClick={() => handleSellClick()} disabled={isProcess}>{isProcess ? "Processing..." : "Sell"}</Button>
								</Tab.Pane>
								<Tab.Pane eventKey="bid">
									<div className="tab-price font-family-1">
										<div>
											<h5>Minimum Bid</h5>
											<div>Set your starting bid price</div>
										</div>
										<div className="tab-value">
											<img src={Ethereum} className="eth" alt="eth" />&nbsp;
											<Form.Control type="number" min={0} value={bidPrice} onInput={e => setBidPrice(e.target.value)} />
											&nbsp;
										</div>
									</div>
									<div className="tab-price font-family-1">
										<div>
											<h5>Reserve Price</h5>
											<div>Create a hidden limit by setting a reserve price</div>
										</div>
										<div className="tab-value">
											<img src={Ethereum} className="eth" alt="eth" />&nbsp;
											<Form.Control type="number" value={increment} onInput={e => setIncrement(e.target.value)} />
											&nbsp;
										</div>
									</div>
									<div className="tab-price font-family-1">
										<div>
											<h5>Expiration Date</h5>
											<div>Your action will automatically end at this time</div>
										</div>
										<div className="tab-value">
											<Form.Group className="mb-3">
												<Form.Select id="disabledSelect" onChange={(e) => setPeriod(e.target.value)}>
													<option value="3">in 3 days</option>
													<option value="5">in 5 days</option>
													<option value="7">in 7 days</option>
												</Form.Select>
											</Form.Group>
										</div>
									</div>
									<br />
									<Button className="btn-sell" onClick={() => handleStart()} disabled={isProcess}>{isProcess ? "Processing..." : "Start Auction"}</Button>
								</Tab.Pane>
							</Tab.Content>
						</Tab.Container>
					</Col>
					<Col md={4}>
						<div className="card" ref={card}>
							<div className="card-header">
								<img src={chain[item?.attributes?.chainType]} className="pos-left" alt="this is Chain Type" style={{ width: '25px' }} />

								<span className="pos-right">
									<i className="fa fa-heart-o" />
									&nbsp; {item?.attributes?.likes}
								</span>
							</div>
							<img src={item?.attributes?.imgpath} style={{ height: imgHeight, borderRadius: '0px 0px 9px 9px' }} alt="NFT" />
						</div>
					</Col>
				</Row>
			</Container>
			<br /><br /><br /><br /><br />
		</>
	)
}

export default ItemSell;