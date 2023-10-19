<template>
  <!-- ... (其他代码保持不变) -->
  <div>
    <h1>User Registration</h1>
    <form @submit.prevent="register" class="registration-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="gender">Gender:</label>
        <select id="gender" v-model="gender">
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
      <div class="form-group">
        <label for="age">Age:</label>
        <input id="age" type="number" v-model="age" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input id="email" type="email" v-model="email" required />
      </div>
      <div class="form-group">
        <label for="role">Role:</label>
        <select id="role" v-model="role" @change="onRoleChange">
          <option value="0">Patient</option>
          <option value="1">Doctor</option>
        </select>
      </div>
      <div v-if="isDoctor">
        <div class="form-group">
          <label for="department">Department:</label>
          <input id="department" v-model="department" required />
        </div>
        <div class="form-group">
          <label for="licenseNumber">License Number:</label>
          <input id="licenseNumber" v-model="licenseNumber" required />
        </div>
      </div>
      <button type="submit">Register</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p> <!-- 修改：显示错误消息 -->
    <p v-if="successMessage" class="success">{{ successMessage }}</p> <!-- 修改：显示成功消息 -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <span @click="closeModal" class="close-button">&times;</span>
        <p>Your registration is successful! Please wait for the Health Administration to approve your account.</p>
      </div>
      </div>
  </div>
</template>

<script>
// ... (其他代码保持不变)
import Web3 from "web3";
export default {
  data() {
    return {
      username: "",
      gender: "male",
      age: null,
      email: "",
      role: "0",
      department: "",
      licenseNumber: "",
      isDoctor: false,
      web3: null,
      contract: null,
      error: null,
      // ... (其他数据保持不变)
      errorMessage: null,
      successMessage: null,
      nftMintingStatus: null,

    };
  },
  // ... (其他方法保持不变)
  async mounted() {
    if (window.ethereum) {
      try {
        this.web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const contractABI =
            // ... (Add the ABI of your contract here)
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
        const contractAddress ="0x03B0bc27EDF6Cb86f762eA2186a70E199Deb0704"; // Replace with your contract address
        this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
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
    // ... (其他方法保持不变)
    onRoleChange() {
      this.isDoctor = this.role === "1";
    },

    async register() {
      // 清除之前的消息
      if (!this.username || !this.gender || !this.age || !this.email) {
        console.error("All fields are required!");
        this.error = "All fields are required!";
        return;
      }
      this.errorMessage = null;
      this.successMessage = null;

      // 验证表单数据的完整性
      if (!this.username || !this.gender || !this.age || !this.email || (this.isDoctor && (!this.department || !this.licenseNumber))) {
        this.errorMessage = "All fields are required!";
        return;
      }


      try {
        const accounts = await this.web3.eth.getAccounts();
        const data = this.contract.methods.register(
            this.username,
            this.gender,
            this.age,
            this.email,
            parseInt(this.role),
            this.department,
            this.licenseNumber
        ).encodeABI();

        const transactionParameters = {
          from: accounts[0],
          to: this.contract.options.address,
          data: data,
        };


        await this.web3.eth.sendTransaction(transactionParameters);
        this.successMessage = 'User registered successfully. Please wait for approval.';
        console.log('User registered successfully');
        this.showModal = true;

      } catch (error) {
        console.error("Error:", error);
        this.error = "An error occurred while registering."; // 修改：更新错误消息
      }
    },
    closeModal(){
      this.showModal=false;
      this.successMessage=null;
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
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.registration-form button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.registration-form button:hover {
  background-color: #218838;
}
.nft-status{
  color: green;
}

p {
  color: red;
}
.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
  padding-top: 60px;
}

.modal-content {
  background-color: #fefefe;
  margin: 5% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
}

.close-button {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close-button:hover,
.close-button:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
</style>