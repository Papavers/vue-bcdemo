<template>
  <div>
    <h1>User Registration</h1>
    <form @submit.prevent="register" class="registration-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input id="password" type="password" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="age">Age:</label>
        <input id="age" type="number" v-model="age" required />
      </div>
      <div class="form-group">
        <label for="gender">Gender:</label>
        <select id="gender" v-model="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div class="form-group">
        <label for="role">Role:</label>
        <select id="role" v-model="role">
          <option value="0">Patient</option>
          <option value="1">Doctor</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
import Web3 from "web3";

export default {
  data() {
    return {
      username: "",
      gender: "",
      age: null,
      email: "",
      role: "0", // Default to Patient
      web3: null,
      contract: null,
      error: null,
    };
  },
  async mounted() {
    // ... (No changes here)
    if (window.ethereum) {
      try {
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
        this.contract = new this.web3.eth.Contract(contractABI, contractAddress); //创建合约实例
      } catch (error) {
        console.error("Error connecting to Ethereum:", error);
        this.error = "Error connecting to Ethereum.";
      }
    } else {
      console.error("Ethereum browser extension not detected!");
      this.error = "Ethereum browser extension not detected!";
    }
  },
  methods: {
    async register() {
      if (!this.username || !this.gender || !this.age || !this.email) {
        console.error("All fields are required!");
        this.error = "All fields are required!";
        return;
      }

      try {
        const accounts = await this.web3.eth.getAccounts();
        const value = this.web3.utils.toWei('0', 'wei');
        const data = this.contract.methods.register(
            this.username,
            this.gender,
            this.age,
            this.email,
            parseInt(this.role)
        ).encodeABI();
        const gas = 3000000;
        const transactionParameters = {
          from: accounts[0],
          to: '0xDf062Cd15B4DB917998BB1373BEd3367325C8Eab', // Replace with your contract address
          gas: gas,
          value: value,
          data: data,
        };

        this.web3.eth.sendTransaction(transactionParameters).then(
            result => {
              console.log('result:', result);
            }
        );
      } catch (error) {
        console.error("Error:", error);
        this.error = "An error occurred!";
      }
    },
  },
};
</script>

<style scoped>
.registration-form .form-group {
  margin-bottom: 15px;
}

.registration-form label {
  display: block;
  margin-bottom: 5px;
}

.registration-form input,
.registration-form select {
  width: 20%;
  padding: 8px;
  font-size: 16px;
}
</style>