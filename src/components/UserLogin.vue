<template>
  <div>
    <h1>User Login</h1>
    <form @submit.prevent="login">
      <label>
        Username:
        <input v-model="username" required />
      </label>
      <label>
        Password:
        <input type="password" v-model="password" required />
      </label>
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  data() {
    return {
      username: "",
      password: "",
      errorMessage: "",
      web3: null,
      contract: null,
    };
  },
  async mounted() {
    // ... (保持这部分不变)
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const contractABI = [
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
      const contractAddress = "0xDf062Cd15B4DB917998BB1373BEd3367325C8Eab"; // Replace with your contract address
      this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
    } else {
      console.error("Ethereum browser extension not detected!");
    }
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        this.errorMessage = "Both username and password are required!";
        return;
      }

      try {
        const accounts = await this.web3.eth.getAccounts();
        const isUser = await this.contract.methods
            .login(this.username)
            .call({ from: accounts[0] });

        if (isUser) {
          console.log("Login successful");

          // 获取用户信息以确定角色
          const userInfo = await this.contract.methods
              .getUserInfo(this.username)
              .call({ from: accounts[0] });

          console.log('User Information:', userInfo);
          // 根据角色重定向到不同的页面
          if (userInfo[4].toString()=== "0") { // 0 表示患者
            this.$router.push("/patienthome");
          } else if (userInfo[4].toString() === "1") { // 1 表示医生
            this.$router.push("/medical-records-home");
          } else {
            this.errorMessage = "Invalid role!";
          }
        } else {
          this.errorMessage = "Invalid username or password!";
        }
      } catch (error) {
        console.error("Error during login:", error);
        this.errorMessage = "An error occurred during login!";
      }
    },
  },
};
</script>

<style scoped>
/* Add your styles here */
</style>
