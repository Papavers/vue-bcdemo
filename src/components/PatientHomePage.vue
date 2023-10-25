<template>
  <div>
    <header>
      <h1>Patient Home</h1>
    </header>
    <nav>
      <!-- Navigation can be added here -->
    </nav>
    <main>
      <div v-if="userInfo">
        <section id="personal-info">
          <h2>Personal Information</h2>
          <img :src="userInfo.avatarURL" alt="User Avatar" class="user-avatar" /> <!-- 新增：显示用户头像 -->
          <p><strong>Username:</strong> {{ userInfo.username }}</p>
          <p><strong>Gender:</strong> {{ userInfo.gender }}</p>
          <p><strong>Age:</strong> {{ userInfo.age }}</p>
          <p><strong>Email:</strong> {{ userInfo.email }}</p>
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
          <h2>Prescription Management</h2>
          <a href="#">View Details</a>
        </section>
        <section id="referral">
          <h2>Referral Status</h2>
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
      authContract: null,
      userInfo: null,
    };
  },
  async mounted() {
    if (window.ethereum) {
      this.web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const authContractABI =
        // ... (Add the ABI of your Authentication contract here)
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
                },
                {
                  "indexed": false,
                  "internalType": "string",
                  "name": "avatarURL",
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
                },
                {
                  "internalType": "string",
                  "name": "avatarURL",
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
      const authContractAddress = "0xdc88330cF86c9a77539a0fB4067c7726866DDEE2"; // Replace with your contract address
      this.authContract = new this.web3.eth.Contract(authContractABI, authContractAddress);

      // 获取登录用户的信息
      const accounts = await this.web3.eth.getAccounts();
      const username = await this.authContract.methods.getUsername(accounts[0]).call();
      const userInfo = await this.authContract.methods.getUserInfo(username).call();
      this.userInfo = {
        username: userInfo[1],
        gender: userInfo[2],
        age: userInfo[3].toString(),
        email: userInfo[4],
        avatarURL:userInfo[8],
      };
    } else {
      console.error("Ethereum browser extension not detected!");
      this.errorMessage = "Ethereum browser extension not detected!";
    }
  },
};
</script>

<style scoped>
.user-avatar {
  border-radius: 50%;
  width: 100px;
  height: auto;
  margin-bottom: 20px;
}

</style>
