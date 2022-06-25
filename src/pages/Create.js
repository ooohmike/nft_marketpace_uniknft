import React, { useState, useEffect } from 'react';
import { Row, Col, Form, Button as BtnReact } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ImageUploader from 'react-image-upload';
import "react-image-upload/dist/index.css";
import { PolygonLogo, BSCLogo, ETHLogo, FantomLogo } from "../components/Chains/Logos";
import { DownOutlined } from "@ant-design/icons";
import { Menu, Dropdown, Button } from "antd";
import { useMoralisFile, useMoralis, useChain, useNewMoralisObject } from 'react-moralis';
import { v4 as uuid } from 'uuid';

import Web3 from "web3";
import { ethers } from 'ethers';
import { Contract } from '../helpers/contractInfo';
import '../assets/css/create.css';

const styles = {
	item: {
		display: "flex",
		alignItems: "center",
		height: "42px",
		fontWeight: "500",
		fontFamily: "Roboto, sans-serif",
		fontSize: "14px",
		padding: "0 10px",
	},
	button: {
		border: "1px solid rgb(231, 234, 243)",
		borderRadius: "7px",
	},
}

// Mainnet
// const menuItems = [
//     {
//         key: "0x1",
//         value: "Ethereum",
//         icon: <ETHLogo />,
//     },
//     {
//         key: "0x38",
//         value: "Binance",
//         icon: <BSCLogo />,
//     },
//     {
//         key: "0x89",
//         value: "Polygon",
//         icon: <PolygonLogo />,
//     },
//     {
//         key: "0xfa",
//         value: "Fantom",
//         icon: <FantomLogo />
//     }
// ];

// Testnet
const menuItems = [
	{
		key: "0x3",
		value: "Ethereum",
		icon: <ETHLogo />,
	},
	{
		key: "0x61",
		value: "Binance",
		icon: <BSCLogo />,
	},
	{
		key: "0x13881",
		value: "Polygon",
		icon: <PolygonLogo />,
	},
	{
		key: "0xfa2",
		value: "Fantom",
		icon: <FantomLogo />
	}
];

const Create = () => {
	const [img, setImage] = useState();
	const [name, setName] = useState('');
	const history = useHistory();
	const [isProcess, setProcess] = useState(false);
	const [royalty, setRoyalty] = useState(0);
	const [content, setContent] = useState('');
	const { saveFile, moralisFile } = useMoralisFile();
	const { save } = useNewMoralisObject("NFTs");
	const { user, Moralis, isAuthenticated, enableWeb3, isWeb3Enabled, account } = useMoralis();
	const { switchNetwork, chainId, chain } = useChain();
	const [selected, setSelected] = useState({
		key: "0x1",
		value: "Ethereum",
		icon: <ETHLogo />,
	});
	const web3 = new Web3(Web3.givenProvider);
	// const web3 = new ethers.providers.Web3Provider(window.ethereum)
	// const web3 = Moralis.enableWeb3();
	const createNFT = 'createArtwork';
	const [chainType, setChain] = useState("Ethereum");
	const [selectedChainId, setSelectedChainId] = useState(menuItems[0].key);
	const [chainKeys, setChainKeys] = useState([])
	// Moralis.enableWeb3()

	useEffect(() => {
		console.log(user)
		if (!isAuthenticated) history.push("/");
		console.log("current", selectedChainId)
		console.log(chainId)
		if (selectedChainId !== chainId) {
			// switchNetwork(selectedChainId)
		}
	}, []);

	useEffect(() => {
		if (!isWeb3Enabled) {
			enableWeb3()
		}
	}, [isWeb3Enabled])

	// useEffect(() => {
	//     console.log('invoked')
	// }, [chain])

	// useEffect(() => {
	//     console.log("chainId", chainId)
	//     console.log("web3", isWeb3Enabled)
	//     if (!isWeb3Enabled && !isAuthenticated) {
	//         enableWeb3({
	//             provider: "injected", chainId: parseInt(selected.key, 16), onSuccess: () => {
	//                 console.log("current chainid", web3.currentProvider.chainId)
	//             }
	//         })
	//     } else {
	//         // if (!chainId) return null;
	//         // try {
	//         //     const newSelected = menuItems.find((item) => item.key === chainId);
	//         //     if (!newSelected) switchNetwork(selected.key);
	//         //     else {
	//         //         console.log('eee')
	//         //         setSelected(newSelected);
	//         //         setChain(newSelected.value);
	//         //     }
	//         // } catch (err) {
	//         //     alert(JSON.stringify(err));
	//         //     history.push('/');
	//         // }
	//     }
	// }, [isWeb3Enabled])

	const handleMenuClick = async (e) => {
		const newSelected = menuItems.find((item) => item.key === e.key);
		// alert(newSelected.key)
		try {
			setSelected(newSelected);
			setChain(newSelected.value);
			await switchNetwork(newSelected.key);
			setSelectedChainId(newSelected.key)
		} catch (err) {
			alert(err?.message ? err?.message : err);
		}
	};

	const menu = (
		<Menu onClick={handleMenuClick}>
			{menuItems.map((item) => (
				<Menu.Item key={item.key} icon={item.icon} style={styles.item}>
					<span style={{ marginLeft: "5px" }}>{item.value}</span>
				</Menu.Item>
			))}
		</Menu>
	);

	const mintNFT = async () => {
		console.log('mint now')
		setProcess(true);
		if (!img || img == null) {
			alert("Please insert your NFT image")
			setProcess(false);
			return
		}
		if (!royalty) {
			alert("Please insert your royalty (%)")
			setProcess(false);
			return
		}
		try {
			const imageFile = await saveFile(img.file?.name, img.file, { saveIPFS: true })
			console.log(imageFile)
			if (!imageFile) {
				setProcess(false);
				return;
			}
			const imageURI = imageFile?._ipfs;
			const metadata = {
				name: name,
				description: content,
				image: imageURI
			}
			console.log(metadata);
			const metadataFile = await saveFile("metadata.json", { base64: btoa(JSON.stringify(metadata)) }, { saveIPFS: true });
			const metadataURI = metadataFile?._ipfs;
			console.log(metadataURI, imageURI)
			createArt(metadataURI, imageURI)
		} catch (err) {
			console.log(err)
			alert(err?.message ? err?.message : err);
			setProcess(false);
		}
	}

	const createArt = async (metaUrl, imageURI) => {
		try {
			// console.log("selected", selectedChainId)
			// const con = new web3.eth.Contract(Contract.contractAbi, Contract[selectedChainId]);
			// // const provider  = new ethers.providers.JsonRpcProvider();
			// // const signer = provider.getSigner(0);
			// // console.log("signer", signer)
			// // const con = new ethers.Contract(Contract[chainId], Contract.contractAbi, signer)
			// var gasPrice = await web3.eth.getGasPrice();
			// // var gasPrice = await ethers.getDefaultProvider().getGasPrice();

			// console.log("current gas price is: ", gasPrice * 1.1)
			// console.log("con", con, metaUrl, selectedChainId)
			// console.log(con)
			// // let receiptObj = await con.methods.createArtwork(metaUrl, royalty);
			// // console.log("receiptObj", receiptObj)
			// // let receipt =  await receiptObj.send({from: account})
			// // let receipt; 
			// let receipt = await con.methods.createArtwork(metaUrl, royalty).send({ from: account, gasPrice: Math.round(gasPrice * 1.1) });
			// console.log("receipt", receipt)
			// let tokenId = receipt.events.Transfer.returnValues.tokenId;
			// console.log("tokenId", tokenId)
			// const tokenAddress = await con.methods.ownerOf(tokenId);
			// console.log("tokenAddress", tokenAddress)
			// if (tokenId)
			//     save2DB(metaUrl, tokenId, imageURI);
			console.log("url:", metaUrl, imageURI)
			save2DB(metaUrl, imageURI)
		} catch (err) {
			alert('here')
			alert(err?.message ? err?.message : err);
			console.log(err);
			setProcess(false);
		}
	}

	const save2DB = async (metaUrl, imageURI) => {
		// const data = {
		//     'name': name,
		//     'desciption': content,
		//     'imgpath': imageURI,
		//     'metadataPath': metaUrl,
		//     'royalty': Number(royalty),
		//     'nftId': nftId,
		//     'creator': account,
		//     'currentOwner': account,
		//     'contractAddress': Contract[selectedChainId],
		//     'likes': 0,
		//     'chainType': chainType,
		//     'preSale': false,
		//     'active': false,
		//     'price': 0,
		//     'sellType': '',
		//     'likers': []
		// }
		const uniqueId = uuid();
		const data = {
			'uniqueId': uniqueId,
			'name': name,
			'description': content,
			'imgpath': imageURI,
			'metadataPath': metaUrl,
			'royalty': Number(royalty),
			'creator': account,
			'currentOwner': account,
			'chainType': chainType,
			'chainId': selectedChainId,
			'preSale': false,
			'active': false,
			'price': 0,
			'sellType': '',
			'likes': 0,
			'likers': [],
			'contractAddress': Contract[selectedChainId],
		}
		console.log(data)
		await save(data);
		alert("NFT is created!");
		setProcess(false);
		// alert(account)
		history.push(`/account-collector/${account}`);
	}

	return (
		<>
			<div className='create-main'>
				<br /><br /><br />
				<Row className="mx-0">
					<Col>
						<ImageUploader
							style={{ height: 350, width: 350, background: 'white', border: '2px dashed black', borderRadius: 13 }}
							deleteIcon={
								<img
									src='https://img.icons8.com/ios-glyphs/30/000000/delete-sign.png'
									alt=''
								/>
							}
							uploadIcon={
								<svg
									className='svg-circleplus'
									viewBox='0 0 100 100'
									style={{ height: '40px', stroke: '#000' }}
								>
									<circle cx='50' cy='50' r='45' fill='none' strokeWidth='7.5'></circle>
									<line x1='32.5' y1='50' x2='67.5' y2='50' strokeWidth='5'></line>
									<line x1='50' y1='32.5' x2='50' y2='67.5' strokeWidth='5'></line>
								</svg>
							}
							onFileAdded={(img) => setImage(img)}
						/>
					</Col>
					<Col>
						<Form>
							<Form.Group className="mb-3">
								<Form.Label>Name</Form.Label>
								<Form.Control type="text" onChange={e => setName(e.target.value)} defaultValue={name || ""} required />
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>Description</Form.Label>
								<Form.Control as="textarea" rows={5} required onChange={e => setContent(e.target.value)} defaultValue={content || ""} />
							</Form.Group>
							<Row>
								<Col md={10}>
									<Form.Label>Royalty (%)</Form.Label>
									<Form.Range onChange={e => setRoyalty(e.target.value)} min={0} max={100} defaultValue={royalty || 0} />
								</Col>
								<Col md={2}>
									<br />
									<Form.Control type="number" value={royalty} />
								</Col>
							</Row>
							<Dropdown overlay={menu} trigger={["click"]}>
								<Button
									key={selected?.key}
									icon={selected?.icon}
									style={{ ...styles.button, ...styles.item }}
								>
									<span style={{ marginLeft: "5px" }}>{selected?.value}</span>
									<DownOutlined />
								</Button>
							</Dropdown>
							{/* <Form.Text>
                            lll are charged to create a new NFT.
                            </Form.Text> */}
							<br /><br />
							<BtnReact variant="primary" style={{ float: 'right' }} onClick={mintNFT} disabled={isProcess}>{isProcess ? "Processing..." : "Create NFT"}</BtnReact>
						</Form>
					</Col>
				</Row>
			</div>
		</>
	)
}

export default Create;