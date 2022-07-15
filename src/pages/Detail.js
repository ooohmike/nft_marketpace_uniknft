import React, { useRef, useEffect, useState } from "react";
import { Row, Col, Button, Accordion, Form } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useMoralisQuery, useMoralis, useChain, useNewMoralisObject } from "react-moralis";
import { useHistory, Link } from 'react-router-dom';
import Web3 from "web3";
import { Table, Space, Modal } from "antd";
// import {Contract} from 'helpers/contractInfo';
import Tooltip from "@mui/material/Tooltip";
import MDBox from "admin/components/MDBox";
import MDAvatar from "admin/components/MDAvatar";
import theme from "admin/assets/theme";
import { getEllipsisTxt } from "helpers/formatters";

import "../assets/css/detail.css"
import Binance from '../assets/img/BSC.png';
import Polygon from '../assets/img/Polygon.png';
import Ethereum from '../assets/img/Ethereum.png';
import Fantom from '../assets/img/Fantom.png';
import loading from '../assets/img/primary/loading.png';

import { MarketContract } from 'helpers/marketInfo.js';
import { Contract } from 'helpers/contractInfo';
// import avatar from 'assets/img/profile/avatar.jpg';
import { chainNum, chainUrl, chain } from '../helpers/networks'
import { LeftCircleFilled } from "@ant-design/icons";

const PRICE_URL = "https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cmatic-network%2Cfantom%2Cbinancecoin&vs_currencies=eth"

const ETH_PRICE = {
	"Ethereum": 'ethereum',
	"Polygon": 'matic-network',
	"Binance": 'binancecoin',
	"Fantom": 'fantom'
}

const Detail = () => {
	const { Moralis, user, isAuthenticated, account } = useMoralis();
	const card = useRef(null);
	const [isModal, setIsModalVisible] = useState(false);
	const [isModalOffer, setModalOffer] = useState(false);
	const [imgHeight, setImgHeight] = useState();
	const [transactions, setTransaction] = useState([]);
	const [isModalBid, setModalBid] = useState(false);
	const [price, setPrice] = useState(0);
	const [auction, setAuction] = useState({});
	const [icon, setIcon] = useState("fa-heart-o");
	const [likerInfo, setLikersInfo] = useState([]);
	const { address, nftId } = useParams();
	const { switchNetwork } = useChain();
	const [owner, setOwner] = useState('');
	const { save } = useNewMoralisObject("Transactions");
	const [site, setSite] = useState({});
	const [itemData, setData] = useState([]);
	const [isProcess, setProccess] = useState(false);
	const history = useHistory();
	const web3 = new Web3(window?.ethereum);
	const [offerTbls, setOfferTbls] = useState();
	const [item, setItem] = useState({ likers: [] });
	const getOffers = async (nftId, chainType) => {
		try {
			const params = { nftId: nftId, contract: address };
			let userInfo = await Moralis.Cloud.run("getOffers", params);
			console.log(userInfo);
			let offerTblData = [];
			for (let offer of userInfo) {
				let offerTblRow = {
					price: offer?.price,
					from: [offer.user[0].username, offer.wallet],
					offerId: offer.offerId,
				};
				offerTblData.push(offerTblRow);
			}
			setOfferTbls(offerTblData);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const getPrice = async (value) => {
		const response = await fetch(PRICE_URL);
		const data = await response.json();
		let price = data[ETH_PRICE[item?.chainType]].eth;
		const wei = Moralis.Units.ETH(Number(value) / price);
		return wei;

	}

	const getTransactions = async (nftId, chainType) => {
		const querySetting = new Moralis.Query("Setting");
		let site = await querySetting.first({ useMasterKey: true });
		setSite(site?.attributes);
		const query = new Moralis.Query('Transactions');
		query.equalTo('contractAddress', MarketContract[chainNum[chainType]]);
		query.equalTo('nftId', nftId);
		let re = await query.find({ useMasterKey: true });
		let data = [];
		console.log(re, "transa");
		for (let tran of re) {
			console.log(tran);
			data.push(tran?.attributes);
		}
		setTransaction(data);
	}

	const transactionTbl = [
		{
			title: "Price",
			dataIndex: 'price',
			key: 'price',
			render: (text) => (
				<Space size="middle">
					<img src={Ethereum} style={{ width: '20px' }} alt="eth" />
					<span>&nbsp;&nbsp;{text} ETH</span>
				</Space>
			)
		},
		{
			title: 'From',
			dataIndex: 'from',
			key: 'from',
			render: (text) => (
				<Link to={"/account/" + text}>{getEllipsisTxt(text)}</Link>
			)
		},
		{
			title: 'To',
			dataIndex: 'to',
			key: 'to',
			render: (text) => (
				<Link to={"/account/" + text}>{getEllipsisTxt(text)}</Link>
			)
		},
		{
			title: 'Contract Address',
			dataIndex: 'contractAddress',
			key: 'contractAddress',
			render: (text, record) => (
				<a href={chainUrl[record?.chainType] + 'address/' + text} target="_blank">{getEllipsisTxt(text)}</a>
			)
		},
	];

	const removeOffer = async (offerId) => {
		try {
			console.log(offerId, item?.nftId);
			await switchNetwork(chainNum[item?.chainType]);
			const contract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainNum[item?.chainType]]);
			let re = await contract.methods.removeOffer(item?.nftId, offerId).send({ from: account });
			const query = new Moralis.Query('Offers');
			query.equalTo('offerId', offerId);
			query.equalTo('contractAddress', address);
			let object = await query.first();
			await object.destroy();
			alert('sucess');
			console.log(re, 'remove');
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const acceptOffer = async (offerId, wallet, price) => {
		try {
			await switchNetwork(chainNum[item?.chainType]);
			const contract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainNum[item?.chainType]]);
			let re = await contract.methods.payOffer(item?.nftId, offerId, MarketContract[chainNum[item?.chainType]], site.fee, site.wallet).send({ from: account });
			let query = new Moralis.Query('Offers');
			query.equalTo('nftId', item?.nftId);
			query.equalTo('contractAddress', address);
			let object = await query.first();
			await object.destroy();
			saveTransactions(wallet, re.transactionHash, price);
			history.push('/account/' + account);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const getAuctionInfo = async (nftId, chainType) => {
		try {
			const query = new Moralis.Query('Auctions');
			query.equalTo('contractAddress', address);
			query.equalTo('nftId', nftId);
			let re = await query.first({ useMasterKey: true });
			setAuction(re);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const offerColumns = [
		{
			title: "Price",
			dataIndex: "price",
			key: "price",
			render: (text) => (
				<Space size="middle">
					<img src={Ethereum} style={{ width: '20px' }} alt="eth" />
					<span>&nbsp;&nbsp;{text} ETH</span>
				</Space>
			)
		},
		{
			title: "From",
			dataIndex: "from",
			key: "from",
			render: (text) => (
				<Link to={"/account/" + text[1]}>{text[1] === account ? "You" : text[0]}</Link>
			)
		},
		{
			title: 'Action',
			key: 'action',
			render: (text, record) => (
				<Space size="middle">
					{
						account === item?.currentOwner &&
						<Link onClick={() => acceptOffer(record.offerId, record.from[1], record?.price)}>Accept</Link>
					}
					{
						account === record.from[1] &&
						<Link onClick={() => removeOffer(record.offerId)}>Remove</Link>
					}
					{
						account !== record.from[1] && account !== item?.currentOwner &&
						<>No Action</>
					}

				</Space>
			),
		}
		// {/* <Link to={"/account/" + text}>{getUserName(text)}</Link> */}
	]
	console.log("nftId:::: ", Number(nftId))
	let { data } = useMoralisQuery("NFTs", query => {
		if (Number(nftId) == nftId) {
			console.log("NUMBer", nftId)
			return query
				.equalTo("contractAddress", address)
				.equalTo("nftId", nftId)
		} else {
			console.log("Not number", nftId)
			return query
				.equalTo("contractAddress", address)
				.equalTo("uniqueId", nftId)
		}
	});
	console.log("data: ", data)

	useEffect(() => {
		if (!data?.length) return;
		getUserName(data[0]?.attributes.currentOwner).then((name) => {
			setOwner(name);
		});
		setItem(data[0].attributes);
		setData(data[0]);
		setLikeIcon(data[0].attributes.likers);
		getTransactions(data[0].attributes.nftId, data[0].attributes.chainType);
		if (data[0].attributes.sellType === 'now') {
			getOffers(data[0].attributes.nftId, data[0].attributes.chainType);
		}
		else if (data[0].attributes.sellType === 'auction') {
			getAuctionInfo(data[0].attributes.nftId, data[0].attributes.chainType);
		}
	}, [data]);

	const setLikeIcon = (likers) => {
		if (likers.includes(account)) {
			setIcon("fa-heart");
		}
		else {
			setIcon("fa-heart-o");
		}
		getUsersInfo(likers);
	}

	const addLike = async () => {
		try {
			if (!isAuthenticated) {
				alert('Please connect your wallet');
				return;
			}
			if (account === item?.currentOwner) {
				alert('This is your item');
				return;
			}
			console.log(item.likes, item.likers[0]);
			if (item.likers.includes(account)) {
				console.log(item.likes);
				let index = item.likers.indexOf(account);
				item.likers[index] = item.likers[item.likes - 1];
				item.likers.pop();
				itemData.set("likes", item.likes - 1);
				itemData.set("likers", item.likers);
				await itemData.save();
				setItem(itemData?.attributes);
			}
			else {
				item.likers.push(account);
				itemData.set("likes", item.likes + 1);
				itemData.set("likers", item.likers);
				await itemData.save();
				setItem(itemData.attributes);
			}
			alert("sucess");
			setLikeIcon(itemData.attributes.likers);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const getUserName = async (owner) => {
		// const user = Moralis.Object.extend("_User");
		try {
			const params = { address: owner };
			let userInfo = await Moralis.Cloud.run("getUserInfo", params);
			return userInfo.name;
		} catch (err) {
			console.log(err);
		}
	}

	const handleSellClick = (addr, id) => {
		console.log(addr, id)
		history.push("/sell/" + addr + "/" + id);
	}

	const buyNow = async () => {
		if (!isAuthenticated) {
			alert('Please connect your wallet');
			return
		}
		try {

			setIsModalVisible(true);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const setOffer = async () => {
		try {
			console.log(price, MarketContract[chainNum[item?.chainType]], item?.nftId);
			if (price <= 0) {
				alert("Please insert your price");
				return;
			}
			const contract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainNum[item?.chainType]]);
			const wei = await getPrice(price);

			// let re; 
			// if(chainNum[item?.chainType] === "0x38") {
			//     re= await contract.methods.buyArt(item?.nftId, MarketContract[chainNum[item?.chainType]], site.fee, site.wallet).send({from:user.attributes.ethAddress, value:price, gasPrice:50000000000});
			// } else if(chainNum[item?.chainType] === "0x89" || chainNum[item?.chainType] === "0xfa") {
			//     re= await contract.methods.buyArt(item?.nftId, MarketContract[chainNum[item?.chainType]], site.fee, site.wallet).send({from:user.attributes.ethAddress, value:price, gasPrice:1000000000000});
			// } else {
			//     re= await contract.methods.buyArt(item?.nftId, MarketContract[chainNum[item?.chainType]], site.fee, site.wallet).send({from:user.attributes.ethAddress, value:price, gasPrice:200000000000});
			// }
			let re = await contract.methods.setOffer(item?.nftId, MarketContract[chainNum[item?.chainType]]).send({ from: user.attributes.ethAddress, value: wei });
			console.log(re);
			const query = new Moralis.Object("Offers");
			query.set('nftId', item?.nftId);
			query.set('contractAddress', address);
			query.set('offerId', re.events.OfferAdded.returnValues.offerId);
			query.set('price', price);
			query.set('wallet', account);
			await query.save();
			alert("success");
			history.go(0);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const makeOffer = async () => {
		if (!isAuthenticated) {
			alert('Please connect your wallet');
			return
		}
		try {
			await switchNetwork(chainNum[item?.chainType]);
			setPrice(0);
			setModalOffer(true);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const setBid = async () => {
		try {
			const aucPrice = Number(auction?.attributes?.price);
			const aucReserve = Number(auction?.attributes?.reserve);
			console.log((aucPrice + aucReserve) > Number(price));
			if ((aucPrice + aucReserve) > Number(price)) {
				alert("Your price is low than next bid limit");
				setProccess(false);
				return;
			}
			setProccess(true);
			const contract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainNum[item?.chainType]]);
			const wei = await getPrice(price);
			console.log(wei);
			let re = await contract.methods.placeBid(item?.nftId).send({ from: account, value: wei });
			auction.set('highPrice', price);
			auction.set('highBidder', account);
			await auction.save();
			alert('success');
			setProccess(false);
			history.go(0);
		} catch (err) {
			alert(err?.message ? err.message : err);
			setProccess(false);
			return;
		}
	}

	const payAuction = async () => {
		if (!isAuthenticated) {
			alert('Please connect your wallet');
			return
		}
		if (!auction?.attributes?.highBidder) {
			alert("there is no bidder");
			return
		}
		try {
			setProccess(true);
			await switchNetwork(chainNum[item?.chainType]);
			let pocket = await web3.eth.getBalance(account)
			console.log(pocket, 'account');
			console.log(item?.nftId);
			const unik = new web3.eth.Contract(Contract.contractAbi, Contract[chainNum[item?.chainType]]);
			let id = await unik.methods.ownerOf(item?.nftId).call();
			console.log(id, MarketContract[chainNum[item?.chainType]]);
			const contract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainNum[item?.chainType]]);
			var gasPrice = await web3.eth.getGasPrice();

			// let re;
			// if(chainNum[item?.chainType] === "0x38") {
			//     re = await contract.methods.payAuction(item?.nftId, site.fee, MarketContract[chainNum[item?.chainType]], site.wallet).send({from:account, gasPrice:50000000000});
			// } else if(chainNum[item?.chainType] === "0x89" || chainNum[item?.chainType] === "0xfa") {
			//     re = await contract.methods.payAuction(item?.nftId, site.fee, MarketContract[chainNum[item?.chainType]], site.wallet).send({from:account, gasPrice:1000000000000});
			// } else {
			//     re = await contract.methods.payAuction(item?.nftId, site.fee, MarketContract[chainNum[item?.chainType]], site.wallet).send({from:account, gasPrice:200000000000});
			// }
			let re = await contract.methods.payAuction(item?.mftId, site.fee, MarketContract[chainNum[item?.chainType]], site.wallet).send({ from: account, gasPrice: Math.round(gasPrice * 1.1) });

			// let re = await contract.methods.payAuction(item?.nftId, site.fee, MarketContract[chainNum[item?.chainType]], site.wallet).send({from:account});
			saveTransactions(auction?.attributes?.highBidder, re.transactionHash, auction?.attributes?.highPrice);
			await auction.destroy();
			setProccess(false);
			history.push('/account/' + account);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			setProccess(false);
			return;
		}
	}

	const makeBid = async () => {
		if (!isAuthenticated) {
			alert('Please connect your wallet');
			return
		}
		if (auction?.attributes?.end <= new Date()) {
			alert("This auction is ended");
			return
		}
		try {
			await switchNetwork(chainNum[item?.chainType]);
			setPrice(0);
			setModalBid(true);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const handleBuy = async () => {
		try {
			setProccess(true);
			await switchNetwork(chainNum[item?.chainType]);

			const price = await getPrice(item?.price);
			console.log('realprice', price)
			const contract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainNum[item?.chainType]]);
			var gasPrice = await web3.eth.getGasPrice();;
			// let re; 
			// if(chainNum[item?.chainType] === "0x38") {
			//     re= await contract.methods.buyArt(item?.nftId, MarketContract[chainNum[item?.chainType]], site.fee, site.wallet).send({from:user.attributes.ethAddress, value:price, gasPrice:50000000000});
			// } else if(chainNum[item?.chainType] === "0x89" || chainNum[item?.chainType] === "0xfa") {
			//     re= await contract.methods.buyArt(item?.nftId, MarketContract[chainNum[item?.chainType]], site.fee, site.wallet).send({from:user.attributes.ethAddress, value:price, gasPrice:1000000000000});
			// } else {
			//     
			// }
			let re = await contract.methods.buyArt(item?.nftId, MarketContract[chainNum[item?.chainType]], site.fee, site.wallet).send({ from: user.attributes.ethAddress, value: price, gasPrice: gasPrice })
			console.log(re);
			let query = new Moralis.Query('Offers');
			query.equalTo('nftId', item?.nftId);
			query.equalTo('contractAddress', address);
			let object = await query.first();
			if (object)
				await object.destroy();
			saveTransactions(account, re.transactionHash, item?.price).then(() => {
				setIsModalVisible(false);
				alert("success");
				setProccess(false);
			});
			history.push('/account/' + account);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			setProccess(false);
			return;
		}
	}

	const cancelBuy = async () => {
		try {
			await switchNetwork(chainNum[item?.chainType]);
			const contract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainNum[item?.chainType]]);
			let re = await contract.methods.cancelArt(item?.nftId).call()
			console.log(re);
			let query = new Moralis.Query('Offers');
			query.equalTo('nftId', item?.nftId);
			query.equalTo('contractAddress', address);
			let object = await query.first();
			if (object)
				await object.destroy();
			itemData.set("price", 0);
			itemData.set("active", false);
			itemData.set('sellType', "");
			await itemData.save();
			alert("success");
		} catch (err) {
			alert(err?.message ? err?.message : err);
		}
	}

	const cancelAuction = async () => {
		try {
			await switchNetwork(chainNum[item?.chainType]);
			console.log(window?.ethereum);
			const contract = new web3.eth.Contract(MarketContract.contractAbi, MarketContract[chainNum[item?.chainType]]);
			console.log(item?.nftId, user?.attributes.ethAddress)
			let re = await contract.methods.cancelAuction(item?.nftId).send({ from: user?.attributes.ethAddress });
			auction.set('active', false);
			await auction.save();
			alert("success");
			history.go(0);
		} catch (err) {
			alert(err?.message ? err?.message : err);
			return;
		}
	}

	const saveTransactions = async (to_address, hash, price) => {
		try {

			itemData.set("preSale", true);
			itemData.set("price", 0);
			itemData.set("active", false);
			itemData.set('sellType', "");
			itemData.set('currentOwner', to_address);
			await itemData.save();
			const data = {
				"nftId": item?.nftId,
				"from": item?.currentOwner,
				"to": to_address,
				"contractAddress": MarketContract[chainNum[item?.chainType]],
				"chainType": item?.chainType,
				"price": Number(price),
				'hash': hash
			};
			await save(data);
		} catch (err) {
			alert(err?.message ? err?.message : err + "/nTransaction is not saved");

		}
	}

	const getUsersInfo = async (likers) => {
		let array = [];
		for (let like of likers) {
			const params = { address: like };
			let userInfo = await Moralis.Cloud.run("getUserInfo", params);
			userInfo.address = like;
			array.push(userInfo);
		}
		setLikersInfo(array);
	}

	const handleLikeClick = (addr) => {
		history.push("/account/" + addr);
	}

	useEffect(() => {
		// console.log('width', card.current ? card.current.offsetWidth : 0);
		setImgHeight(card.current ? card.current.offsetWidth : imgHeight);
	}, [card.current]);

	const goContractAddress = (item) => {


		window.open(chainUrl[item.chainType] + "address/" + item.contractAddress)
	}

	return (
		<>
			<div className="detail">
				<Row>
					<Col md={5}>
						<div className="card" ref={card}>
							<div className="card-header">
								<Tooltip key={"Chain"} title={item?.chainType ? item?.chainType : "Ethereum"} placement="top" arrow>
									<img src={item?.chainType ? chain[item?.chainType] : Ethereum} className="pos-left" alt="this is Chain Type" style={{ width: '25px' }} />
								</Tooltip>
								<span className="pos-right">
									<i className={"fa " + icon} style={{ cursor: 'pointer' }} onClick={() => addLike()} />
									&nbsp; {item?.likes}
								</span>
							</div>
							<img src={item?.imgpath ? item?.imgpath : loading} style={{ height: imgHeight, borderRadius: '0px 0px 9px 9px' }} alt="this is NFT" />
						</div>
						<div>
							<br /><br />
							<Accordion defaultActiveKey={['0']} alwaysOpen>
								<Accordion.Item eventKey="0">
									<Accordion.Header style={{ fontWeight: 'bold' }}><i className="fa fa-align-justify" />&nbsp;Description</Accordion.Header>
									<Accordion.Body>
										{item?.description}
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="1">
									<Accordion.Header style={{ fontWeight: 'bold' }}><i className="fa fa-bookmark" />&nbsp;Details</Accordion.Header>
									<Accordion.Body>
										<Row>
											<h5 className="title-text">Contract Address
												<Link className="pos-right" onClick={() => goContractAddress(item)}>{getEllipsisTxt(item?.contractAddress)}</Link>
												{/* <Link className="pos-right" href={chainUrl[item?.chainType]+item?.contractAddress} target="_blank">{getEllipsisTxt(item?.contractAddress)}</Link> */}
											</h5>
										</Row>
										<Row>
											<h5 className="title-text">Token Id
												<Link className="pos-right">{item?.nftId}</Link>
											</h5>
										</Row>
										<Row>
											<h5 className="title-text">Network
												<Tooltip key={"Chain"} title={item?.chainType ? item?.chainType : "Ethereum"} placement="top" arrow>
													<img src={item?.chainType ? chain[item?.chainType] : Ethereum} className="pos-right" alt="this is Chain Type" style={{ width: '20px' }} />
												</Tooltip>
											</h5>
										</Row>
									</Accordion.Body>
								</Accordion.Item>
								<Accordion.Item eventKey="2">
									<Accordion.Header style={{ fontWeight: 'bold' }}><i className="fa fa-info-circle" />&nbsp;Info</Accordion.Header>
									<Accordion.Body>
										<Row>
											<h5 className="title-text">Creator
												<Link className="pos-right">{getEllipsisTxt(item?.creator)}</Link>
											</h5>
										</Row>
										<Row>
											<h5 className="title-text">Royalty
												<Link className="pos-right">{item?.royalty}%</Link>
											</h5>
										</Row>
									</Accordion.Body>
								</Accordion.Item>
							</Accordion>
						</div>
						<br /><br /><br />
					</Col>
					<Col md={7}>
						{/* <h3>Project Spoon DAO</h3> */}
						<h2> {item?.name ? item?.name : 'unnamed'} </h2>
						<br />
						<h5 style={{ display: 'flex', alignItems: 'center' }}>Owned by&nbsp; <Link to={"/account-artist/" + item?.currentOwner}> {account === item?.currentOwner ? "you" : owner}</Link>&nbsp;&nbsp;&nbsp;
							<i className={"fa " + icon} />&nbsp;:&nbsp;{item?.likes}&nbsp; <MDBox display="flex" py={1} theme={theme}>
								{
									likerInfo.map((like) => (
										<>
											<Tooltip key={like?.name} title={like?.name} placement="top" arrow>
												{like?.profile ? <MDAvatar
													src={like?.profile}
													alt="name"
													size="xs"
													sx={{
														border: ({ borders: { borderWidth }, palette: { white } }) =>
															`${borderWidth[2]} solid ${white.main}`,
														cursor: "pointer",
														position: "relative",

														"&:not(:first-of-type)": {
															ml: -1.25,
														},

														"&:hover, &:focus": {
															zIndex: "10",
														},
													}}
													onClick={() => handleLikeClick(like?.address)}
													theme={theme}
												/> : <>Unregistered user</>}
											</Tooltip>
										</>
									)
									)
								}
							</MDBox>
						</h5>
						<br />
						<div>
							{item?.sellType === 'auction' && <div className="card-date">
								<i className="fa fa-clock-o" />&nbsp;{auction?.attributes?.end?.toString()}
								{(auction?.attributes?.end <= new Date() || !auction?.attributes?.active) && <h5 style={{ color: "#51cbce" }}>(Auction is ended)</h5>}
							</div>}
							<br />
							<div className="card-action">
								{item?.sellType === "now" && item?.active && <><h5>Current price</h5>
									<div className="card-price">
										<img src={Ethereum} style={{ width: '25px' }} alt="eth" />
										<span>&nbsp;{item?.price}&nbsp;ETH</span>
									</div></>}
								{auction?.attributes?.price > 0 && item?.sellType === "auction" && (<><h5>Start Price</h5>
									<div className="card-price">
										<img src={Ethereum} style={{ width: '25px' }} alt="eth" />
										<span>&nbsp;{auction?.attributes?.price}&nbsp;ETH</span>
									</div></>)}
								{auction?.attributes?.price > 0 && item?.sellType === "auction" && <h5>Highest Bid</h5>}
								{auction?.attributes?.price !== auction?.attributes?.highPrice && item?.sellType === "auction" && (<div className="card-price">
									<img src={Ethereum} style={{ width: '25px' }} alt="eth" />
									<span>&nbsp;{auction?.attributes?.highPrice}&nbsp;ETH from : {auction?.attributes?.highBidder !== account ? getEllipsisTxt(auction?.attributes?.highBidder) : "you"}</span>
								</div>)}
								<br />
								<Row>
									{account === item?.currentOwner && !item?.active && <Col>
										<Button variant="primary" size="lg" style={{ marginRight: '20px' }}>
											Edit
										</Button>
										<Button variant="primary" size="lg" onClick={() => handleSellClick(item?.currentOwner, item?.uniqueId)}>
											Sell
										</Button>
									</Col>}
									{account === item?.currentOwner && item?.active && item?.sellType === "now" &&
										<Col>
											<Button variant="primary" size="lg" onClick={() => cancelBuy()}>
												Remove
											</Button>
										</Col>
									}
									{account !== item?.currentOwner && item?.active && item?.sellType === 'now' && <Col>
										<Button variant="primary" size="lg" onClick={() => buyNow()}>
											Buy now
										</Button>
									</Col>}

									{account !== item?.currentOwner && item?.active && item?.sellType === 'now' && <Col>
										<Button variant="primary" size="lg" onClick={() => makeOffer()}>
											Make offer
										</Button>
									</Col>}
									{account !== item?.currentOwner && item?.active && item?.sellType === "auction" && auction?.attributes?.active && auction?.attributes?.end > new Date() && <Col>
										<Button variant="primary" size="lg" onClick={() => makeBid()}>
											Place a bid
										</Button>
									</Col>}
									{account === item?.currentOwner && item?.active && item?.sellType === 'auction' && (auction?.attributes?.end <= new Date() || auction?.attributes?.active) && <Col>
										<Button variant="primary" size="lg" onClick={() => cancelAuction()}>
											Cancel
										</Button>
									</Col>}
									{account === item?.currentOwner && item?.active && item?.sellType === 'auction' && (!auction?.attributes?.active || auction?.attributes?.end <= new Date()) && auction?.attributes?.highPrice !== auction?.attributes?.price && <Col>
										<Button variant="primary" size="lg" onClick={() => payAuction()}>
											Accept
										</Button>
									</Col>}
								</Row>
							</div>
						</div>
						<br /><br /><br />
						<Accordion defaultActiveKey={['3']} alwaysOpen>
							<Accordion.Item eventKey="3">
								<Accordion.Header style={{ fontWeight: 'bold' }}><i className="fa fa-flag" />&nbsp;Offers</Accordion.Header>
								<Accordion.Body>
									<Table columns={offerColumns} dataSource={offerTbls} />
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</Col>
				</Row>
				<Accordion>
					<Accordion.Item eventKey="3">
						<Accordion.Header style={{ fontWeight: 'bold' }}><i className="fa fa-history" />&nbsp;Transaction</Accordion.Header>
						<Accordion.Body>
							<Table columns={transactionTbl} dataSource={transactions} />
						</Accordion.Body>
					</Accordion.Item>
				</Accordion>
				<br /><br /><br />
				<Modal
					visible={isModal}
					title={"Buy Now"}
					footer={[
						<Button type="primary" style={{ marginRight: '50px' }} onClick={() => handleBuy()} disabled={isProcess}>{isProcess ? "Processing..." : "Buy Now"}</Button>,
						<Button
							size="large"
							type="primary"
							onClick={() => {
								setIsModalVisible(false);
							}}
						>
							Cancel
						</Button>
					]}
					onCancel={() => setIsModalVisible(false)}
					bodyStyle={{
						padding: "15px",
						fontSize: "17px",
						fontWeight: "500",
					}}
					style={{ fontSize: "16px", fontWeight: "500" }}
					width="500px"
				>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<img src={item?.imgpath} style={{ width: "75px", height: "75px" }} alt="item?" />
						<div>
							<h5>{item?.name ? item?.name : "unanmed"}</h5>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img src={Ethereum} className="eth" style={{ width: '20px', height: '20px' }} alt="eth" />&nbsp;{item?.price}
							</div>
						</div>
					</div>
					<div style={{ borderTop: '1px solid #f0f0f0', marginTop: '10px', padding: '10px' }}>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span>Creator Fees</span>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img src={Ethereum} className="eth" style={{ width: '20px', height: '20px' }} alt="eth" />&nbsp;{item?.price * item?.royalty / 100}&nbsp;({item?.royalty}%)
							</div>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span>Site Fees</span>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img src={Ethereum} className="eth" style={{ width: '20px', height: '20px' }} alt="eth" />&nbsp;{item?.price * site.fee / 100}&nbsp;({site.fee}%)
							</div>
						</div>
						<div style={{ display: 'flex', justifyContent: 'space-between' }}>
							<span>Owner Profit</span>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<img src={Ethereum} className="eth" style={{ width: '20px', height: '20px' }} alt="eth" />&nbsp;{item?.price - item?.price * item?.royalty / 100 - item?.price * site.fee / 100}&nbsp;
							</div>
						</div>
					</div>
				</Modal>
				<Modal
					visible={isModalOffer}
					title="Place a Offer"
					footer={[
						<Button type="primary" style={{ marginRight: '50px' }} onClick={() => setOffer()} disabled={isProcess}>{isProcess ? "Processing..." : "Place a offer"}</Button>,
						<Button
							size="large"
							type="primary"
							onClick={() => {
								setModalOffer(false);
							}}
						>
							Cancel
						</Button>
					]}
					onCancel={() => setModalOffer(false)}
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
				<Modal
					visible={isModalBid}
					title="Place a Bid"
					footer={[
						<Button type="primary" style={{ marginRight: '50px' }} onClick={() => setBid()} disabled={isProcess}>{isProcess ? "Processing..." : "Place a Bid"}</Button>,
						<Button
							size="large"
							type="primary"
							onClick={() => {
								setModalBid(false);
							}}
						>
							Cancel
						</Button>
					]}
					onCancel={() => setModalBid(false)}
					bodyStyle={{
						padding: "15px",
						fontSize: "17px",
						fontWeight: "500",
					}}
					style={{ fontSize: "16px", fontWeight: "500" }}
					width="500px"
				>
					<div style={{ display: 'flex', alignItems: 'center' }}>
						<img src={Ethereum} className="eth" style={{ width: '30px', height: '30px' }} alt="eth" />&nbsp;&nbsp;&nbsp;
						<Form.Control type="number" min={0} value={price} onInput={e => setPrice(e.target.value)} />
					</div>
					<br />
					<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						Auction reserve price is {auction?.attributes?.reserve} ETH </div>
					<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						Current high price is {auction?.attributes?.highPrice} ETH </div>
				</Modal>
			</div>
		</>
	)

}

export default Detail;