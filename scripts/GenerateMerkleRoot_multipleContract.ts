import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
const keccak256 = require("keccak256");

const ERC20_List = require("../assets/ERC20_list.json");
const ERC721_List = require("../assets/ERC721_list.json");

interface ERC20 {
    contractAddress: string;
    address: string;
    amount: string;
}

interface ERC721 {
    contractAddress: string;
    address: string;
    amount: string;
}

const balancesERC20: ERC20[] = [];
const balancesERC721: ERC721[] = [];

ERC20_List.map((a: any) => {
    balancesERC20.push({
        contractAddress: a.contractAddress,
        address: a.address,
        amount: ethers.utils.defaultAbiCoder.encode(['uint256'], [a.amount]),
    });
});

ERC721_List.map((a: any) => {
    balancesERC721.push({
        contractAddress: a.contractAddress,
        address: a.address,
        amount: ethers.utils.defaultAbiCoder.encode(['uint256'], [a.amount]),
    });
});

const leafNodesERC20 = balancesERC20.map((balance) =>
    keccak256(
        Buffer.concat([
                Buffer.from(balance.contractAddress.replace('0x', ''), 'hex'),
                Buffer.from(balance.address.replace("0x", ""), "hex"),
                Buffer.from(balance.amount.replace("0x", ""), "hex")
            ]
        )
    )
);

const leafNodesERC721 = balancesERC721.map((balance) =>
    keccak256(
        Buffer.concat([
                Buffer.from(balance.contractAddress.replace('0x', ''), 'hex'),
                Buffer.from(balance.address.replace("0x", ""), "hex"),
                Buffer.from(balance.amount.replace("0x", ""), "hex")
            ]
        )
    )
);

const merkleTreeERC20 = new MerkleTree(leafNodesERC20, keccak256, { sort: true });
const merkleTreeERC721 = new MerkleTree(leafNodesERC721, keccak256, { sort: true });

console.log("---------");
console.log("Merke Tree ERC20");
console.log("---------");
console.log(merkleTreeERC20.toString());
console.log("---------");
console.log("Merkle Root: " + merkleTreeERC20.getHexRoot());

console.log("Proof 1: " + merkleTreeERC20.getHexProof(leafNodesERC20[0]));
console.log("Proof 2: " + merkleTreeERC20.getHexProof(leafNodesERC20[1]));

console.log("---------");
console.log("Merke Tree ERC721");
console.log("---------");
console.log(merkleTreeERC721.toString());
console.log("---------");
console.log("Merkle Root: " + merkleTreeERC721.getHexRoot());

console.log("Proof 1: " + merkleTreeERC721.getHexProof(leafNodesERC721[0]));
console.log("Proof 2: " + merkleTreeERC721.getHexProof(leafNodesERC721[1]));
