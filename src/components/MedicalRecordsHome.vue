<template>
  <div>
    <h1>MedicalRecords</h1>
    <div v-if="userInfo">
      <p><strong>Username:</strong> {{ userInfo.username }}</p>
      <p><strong>Gender:</strong> {{ userInfo.gender }}</p>
      <p><strong>Age:</strong> {{ userInfo.age }}</p>
      <p><strong>Email:</strong> {{ userInfo.email }}</p>
    </div>
    <p v-if="errorMessage">{{ errorMessage }}</p>
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
      userInfo: null,
    };
  },
  async mounted() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const contractABI = [
        // ... (Your contract ABI)
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
            }
          ],
          "name": "register",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": false,
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "name": "UserLoggedIn",
          "type": "event"
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
          "name": "getAddressByUsername",
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
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "name": "getUserInfo",
          "outputs": [
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
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "address",
              "name": "addr",
              "type": "address"
            }
          ],
          "name": "getUsernameByAddress",
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
              "internalType": "string",
              "name": "username",
              "type": "string"
            }
          ],
          "name": "login",
          "outputs": [
            {
              "internalType": "bool",
              "name": "",
              "type": "bool"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }

      ];
      const contractAddress = "0x6d7722BD2FCc0E09FebE21c8d0992624D3b6D987"; // Replace with your contract address
      this.contract = new this.web3.eth.Contract(contractABI, contractAddress);

      // 获取登录用户的信息
      const accounts = await this.web3.eth.getAccounts();
      const username = await this.contract.methods.getUsernameByAddress(accounts[0]).call();
      const userInfo = await this.contract.methods.getUserInfo(username).call();
      this.userInfo = {
        username: userInfo[0],
        gender: userInfo[1],
        age: userInfo[2],
        email: userInfo[3],
      };
    } else {
      console.error("Ethereum browser extension not detected!");
      this.errorMessage = "Ethereum browser extension not detected!";
    }
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
