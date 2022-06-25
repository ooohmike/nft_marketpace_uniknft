import React, { useEffect, useState } from "react";
import { useMoralis } from 'react-moralis';
import { Table, Space, Tag } from "antd";
import { Link } from 'react-router-dom';
import Ethereum from 'assets/img/Ethereum.png';
import { getEllipsisTxt } from "helpers/formatters";

const appId = process.env.REACT_APP_MORALIS_APPLICATION_ID;
const serverUrl = process.env.REACT_APP_MORALIS_SERVER_URL;

const Transaction = () => {

	const { Moralis, account } = useMoralis();

	const [transactions, setTransaction] = useState([]);

	const chain = {
		"Binance": "https://bscscan.com/",
		"Ethereum": "https://etherscan.io/",
		"Fantom": "https://ftmscan.com/",
		"Polygon": "https://polygonscan.com/"
	};
	// const chain = {
	//     "Binance": "https://testnet.bscscan.com/",
	//     "Ethereum": "https://ropsten.etherscan.io/",
	//     "Fantom": "https://testnet.ftmscan.com/",
	//     "Mumbai": "https://explorer-mumbai.maticvigil.com/"
	// };

	useEffect(() => {
		Moralis.start({ serverUrl, appId });
	}, []);

	useEffect(() => {
		getTransactions();
	}, [account]);

	const getTransactions = async () => {
		try {
			const params = { account: account };
			// console.log("account: ", account)
			let trans = await Moralis.Cloud.run("getTransactions", params);
			console.log(trans, account);
			if (trans.length)
				setTransaction(trans);
		} catch (err) {
			alert(err?.message ? err?.message : err);
		}
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
			title: 'Contract',
			dataIndex: 'contractAddress',
			key: 'contractAddress',
			render: (text, record) => (
				<a href={chain[record?.chainType] + 'address/' + text} target="_blank">{getEllipsisTxt(text)}</a>
			)
		},
		{
			title: "Hash",
			dataIndex: 'hash',
			key: 'hash',
			render: (text, record) => (
				<a href={chain[record?.chainType] + 'tx/' + text} target="_blank">{getEllipsisTxt(text)}</a>
			)
		},
		{
			title: "Type",
			dataIndex: "type",
			render: (text, record) => (
				<Tag color={record?.to === account ? "geekblue" : 'green'}>
					{record?.to === account ? "BUY" : "SELL"}
				</Tag>
			)
		}
	];

	return (
		<>
			<Table columns={transactionTbl} dataSource={transactions} />
		</>
	)
};

export default Transaction;
