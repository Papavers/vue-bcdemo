<template>
  <div>
    <h1>User Login</h1>
    <form @submit.prevent="loginWithNFT">
      <button type="submit" :disabled="loading">Login with NFT</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
    <div v-if="loading">Logging in...</div>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  data() {
    return {
      errorMessage: "",
      successMessage: "",
      loading: false,
      web3: null,
      authContract: null,
      identityNFTContract: null,
    };
  },
  async mounted() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const authContractABI =
        // ... (Replace with the actual ABI of your Authentication contract)
          [
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
              "name": "getUsersCount",
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
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "usernames",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ]
      ;
      const authContractAddress = "0x03B0bc27EDF6Cb86f762eA2186a70E199Deb0704";
      this.authContract = new this.web3.eth.Contract(authContractABI, authContractAddress);

      const identityNFTABI =
        // ... (Replace with the actual ABI of your IdentityNFT contract)
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
              "inputs": [],
              "name": "healthAdminContract",
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
                  "name": "_healthAdminContract",
                  "type": "address"
                }
              ],
              "name": "setHealthAdminContract",
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
      const identityNFTAddress = "0x22fB7994179a1b4fAeEd82EACb6B8855C564734F";
      this.identityNFTContract = new this.web3.eth.Contract(identityNFTABI, identityNFTAddress);
    } else {
      this.errorMessage = "Ethereum browser extension not detected!";
    }
  },
  methods: {
    async loginWithNFT() {
      this.loading = true;
      try {
        const accounts = await this.web3.eth.getAccounts();
        const nftCount = await this.identityNFTContract.methods.balanceOf(accounts[0]).call();

        if (nftCount > 0) {
          const username = await this.authContract.methods.getUsername(accounts[0]).call();
          const userInfo = await this.authContract.methods.getUserInfo(username).call();

          if (userInfo[5].toString() === "0") { // Adjusted the index based on the updated contract
            this.$router.push("/patienthome");
          } else if (userInfo[5].toString() === "1") {
            this.$router.push("/medical-records-home");
          } else {
            this.errorMessage = "Invalid role!";
          }
          this.successMessage = "Login successful! Redirecting...";
        } else {
          this.errorMessage = "You do not own an NFT. Please register and get approved first.";
        }
      } catch (error) {
        this.errorMessage = "An error occurred during login with NFT!";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
