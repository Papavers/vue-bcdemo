<template>
  <div>
    <header>
      <h1>Patient Home</h1>
    </header>
    <nav>

    </nav>
    <main>
      <div v-if="userInfo">
        <section id="personal-info">
          <h2>Personal Information</h2>
          <p><strong>Username:</strong> {{ userInfo.username }}</p>
          <p><strong>Gender:</strong> {{ userInfo.gender }}</p>
          <p><strong>Age:</strong> {{ userInfo.age }}</p>
          <p><strong>Email:</strong> {{ userInfo.email }}</p>
        </section>
        <section id="nft">
          <h2>My NFTs</h2>
          <div v-if="nftURIs.length > 0">
            <p>You own {{ nftURIs.length }} NFT(s).</p>
            <ul>
              <li v-for="(uri, index) in nftURIs" :key="index">
                <a :href="uri" target="_blank">View NFT {{ index + 1 }}</a>
              </li>
            </ul>
          </div>
          <p v-else>You do not own any NFTs.</p>
        </section>
        <section id="medical-records">
          <h2>Medical Records</h2>
          <a href="#">View Details</a>
        </section>
        <section id="appointments">
          <h2>Appointments</h2>
          <a href="#">View Details</a>
        </section>
        <section id="medication">
          <h2>Prescription management</h2>
          <a href="#">View Details</a>
        </section>
        <section id="referral">
          <h2>Referral status</h2>
          <a href="#">View Status</a>
        </section>
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
    </main>
    <footer>
      <p>&copy; 2023 Medical Blockchain Project</p>
    </footer>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  data() {
    return {
      errorMessage: "",
      web3: null,
      contract: null,
      identityNFTContract: null, // 新增：IdentityNFT 合约
      userInfo: null,
      nftCount: 0, // 新增：用户的 NFT 数量
      nftURIs:[],
    };
  },
  async mounted() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const contractABI =
        // ... (Add the ABI of your Authentication contract here)
          [
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_identityNFT",
                  "type": "address"
                }
              ],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "userAddress",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "gender",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "age",
                  "type": "uint256"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "email",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "enum Authentication.Role",
                  "name": "role",
                  "type": "uint8"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "department",
                  "type": "string"
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "licenseNumber",
                  "type": "string"
                }
              ],
              "name": "UserRegistered",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                }
              ],
              "name": "getUserInfo",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "enum Authentication.Role",
                  "name": "",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "userAddress",
                  "type": "address"
                }
              ],
              "name": "getUserNFTs",
              "outputs": [
                {
                  "internalType": "uint256[]",
                  "name": "",
                  "type": "uint256[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "userAddress",
                  "type": "address"
                }
              ],
              "name": "getUsername",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "identityNFT",
              "outputs": [
                {
                  "internalType": "contract IdentityNFT",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "userAddress",
                  "type": "address"
                }
              ],
              "name": "isUserHasNFT",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "gender",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "age",
                  "type": "uint256"
                },
                {
                  "internalType": "string",
                  "name": "email",
                  "type": "string"
                },
                {
                  "internalType": "enum Authentication.Role",
                  "name": "role",
                  "type": "uint8"
                },
                {
                  "internalType": "string",
                  "name": "department",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "licenseNumber",
                  "type": "string"
                }
              ],
              "name": "register",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ]
      ;
      const contractAddress = "0x998E3DDf82576bf51FB8Fc485CB1d89a67431df7"; // Replace with your contract address
      this.contract = new this.web3.eth.Contract(contractABI, contractAddress);

      const identityNFTABI =
        // ... (Add the ABI of your IdentityNFT contract here)
          [
            {
              "inputs": [],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "approved",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "Approval",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "bool",
                  "name": "approved",
                  "type": "bool"
                }
              ],
              "name": "ApprovalForAll",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": false,
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "indexed": false,
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "NFTMinted",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "previousOwner",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "OwnershipTransferred",
              "type": "event"
            },
            {
              "anonymous": false,
              "inputs": [
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "indexed": true,
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "Transfer",
              "type": "event"
            },
            {
              "inputs": [],
              "name": "admin",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "approve",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "authContract",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                }
              ],
              "name": "balanceOf",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "getApproved",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "user",
                  "type": "address"
                }
              ],
              "name": "getTokenIds",
              "outputs": [
                {
                  "internalType": "uint256[]",
                  "name": "",
                  "type": "uint256[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "getTokenURI",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                }
              ],
              "name": "isApprovedForAll",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                }
              ],
              "name": "mint",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "name",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "nextTokenId",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "owner",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "ownerOf",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "renounceOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "safeTransferFrom",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                },
                {
                  "internalType": "bytes",
                  "name": "_data",
                  "type": "bytes"
                }
              ],
              "name": "safeTransferFrom",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "operator",
                  "type": "address"
                },
                {
                  "internalType": "bool",
                  "name": "approved",
                  "type": "bool"
                }
              ],
              "name": "setApprovalForAll",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_authContract",
                  "type": "address"
                }
              ],
              "name": "setAuthContract",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "bytes4",
                  "name": "interfaceId",
                  "type": "bytes4"
                }
              ],
              "name": "supportsInterface",
              "outputs": [
                {
                  "internalType": "bool",
                  "name": "",
                  "type": "bool"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "symbol",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "index",
                  "type": "uint256"
                }
              ],
              "name": "tokenByIndex",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "owner",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "index",
                  "type": "uint256"
                }
              ],
              "name": "tokenOfOwnerByIndex",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "tokenURI",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "totalSupply",
              "outputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "from",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "to",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "tokenId",
                  "type": "uint256"
                }
              ],
              "name": "transferFrom",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "newOwner",
                  "type": "address"
                }
              ],
              "name": "transferOwnership",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            }
          ]
      ;
      const identityNFTAddress = "0x924c57B26B9523046Da3D13eb647e0b4a9EB1Cfb"; // Replace with your IdentityNFT contract address
      this.identityNFTContract = new this.web3.eth.Contract(identityNFTABI, identityNFTAddress);

      // 获取登录用户的信息
      const accounts = await this.web3.eth.getAccounts();
      const username = await this.contract.methods.getUsername(accounts[0]).call();
      const userInfo = await this.contract.methods.getUserInfo(username).call();
      this.userInfo = {
        username: userInfo[1],
        gender: userInfo[2],
        age: userInfo[3].toString(),
        email: userInfo[4],
      };

      // 获取用户的 NFT 数量
      this.nftCount = await this.identityNFTContract.methods.balanceOf(accounts[0]).call();
    } else {
      console.error("Ethereum browser extension not detected!");
      this.errorMessage = "Ethereum browser extension not detected!";
    }
    // 新增：获取用户的所有 NFT URIs
    if (this.userInfo) {
      const accounts = await this.web3.eth.getAccounts();
      const tokenIds = await this.identityNFTContract.methods.getTokenIds(accounts[0]).call();
      for (let i = 0; i < tokenIds.length; i++) {
        const uri = await this.identityNFTContract.methods.getTokenURI(tokenIds[i]).call();
        this.nftURIs.push(uri);
      }
    }
  },
};
</script>

<style scoped>

</style>
