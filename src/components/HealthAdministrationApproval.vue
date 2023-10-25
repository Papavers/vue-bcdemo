<template>
  <div class="main-container">
    <div class="container">
      <h1 class="title is-1">Health Administration Dashboard</h1>
      <div v-if="loading">Loading...</div>
      <div v-else class="panels">
        <!-- Unapproved Users -->
        <div class="panel unapproved">
          <h2 class="title is-3">Unapproved Users</h2>
          <div class="user-section">
            <h4 class="title is-4">Patients</h4>
            <div v-for="user in unapprovedPatients" :key="user.username" class="card">
              <div class="card-content">
                <p class="title is-5">{{ user.username }}</p>
                <button class="button pending" @click="approveUser1(user.username)">Pending</button> <!-- 重新添加 @click 事件处理器 -->
              </div>
            </div>
          </div>
          <div class="user-section">
            <h4 class="title is-4">Doctors</h4>
            <div v-for="user in unapprovedDoctors" :key="user.username" class="card">
              <div class="card-content">
                <p class="title is-5">{{ user.username }}</p>
                <button class="button pending" @click="approveUser1(user.username)">Pending</button> <!-- 重新添加 @click 事件处理器 -->
              </div>
            </div>
          </div>
        </div>
        <!-- Approved Users -->
        <div class="panel approved">
          <h2 class="title is-3">Approved Users</h2>
          <div class="user-section">
            <h4 class="title is-4">Patients</h4>
            <div v-for="user in approvedPatients" :key="user.username" class="card">
              <div class="card-content">
                <p class="title is-5">{{ user.username }}</p>
                <button class="button is-success">Approved</button>
              </div>
            </div>
          </div>
          <div class="user-section">
            <h4 class="title is-4">Doctors</h4>
            <div v-for="user in approvedDoctors" :key="user.username" class="card">
              <div class="card-content">
                <p class="title is-5">{{ user.username }}</p>
                <button class="button is-success">Approved</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="successMessage">{{ successMessage }}</p>
    </div>
  </div>
</template>




<script>
import Web3 from "web3";

export default {
  data() {
    return {
      usernames: [],
      users: {},
      loading: true,
      errorMessage: "",
      successMessage: "",
      web3: null,
      healthAdminContract: null,
      authContract: null,
    };
  },
  computed: {
    unapprovedPatients() {
      return this.usernames
          .map(username => this.users[username])
          .filter(user => !user.approved && user.role === 0);
    },
    unapprovedDoctors() {
      return this.usernames
          .map(username => this.users[username])
          .filter(user => !user.approved && user.role === 1);
    },
    approvedPatients() {
      return this.usernames
          .map(username => this.users[username])
          .filter(user => user.approved && user.role === 0);
    },
    approvedDoctors() {
      return this.usernames
          .map(username => this.users[username])
          .filter(user => user.approved && user.role === 1);
    }
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

      const authContractAddress = "0xdc88330cF86c9a77539a0fB4067c7726866DDEE2";
      this.authContract = new this.web3.eth.Contract(authContractABI, authContractAddress);

      const healthAdminContractABI =
          // ... (Replace with the actual ABI of your Health Administration contract)
          [
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                }
              ],
              "name": "approveUser",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "_identityNFT",
                  "type": "address"
                },
                {
                  "internalType": "address",
                  "name": "_authentication",
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
                }
              ],
              "name": "UserApproved",
              "type": "event"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "",
                  "type": "string"
                }
              ],
              "name": "approvedUsers",
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
              "name": "authentication",
              "outputs": [
                {
                  "internalType": "contract Authentication",
                  "name": "",
                  "type": "address"
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
            }
          ]
      ;

      const healthAdminContractAddress = "0x5e8d319c449F523636175E993ae5af2373f30939";
      this.healthAdminContract = new this.web3.eth.Contract(healthAdminContractABI, healthAdminContractAddress);

      this.loadUsers();
    } else {
      this.errorMessage = "Ethereum browser extension not detected!";
      this.loading = false;
    }
  },
  methods: {
    async loadUsers() {
      try {
        const usersCount = await this.authContract.methods.getUsersCount().call();
        for (let i = 0; i < usersCount; i++) {
          const username = await this.authContract.methods.usernames(i).call();
          this.usernames.push(username);
          const userInfo = await this.authContract.methods.getUserInfo(username).call();
          this.users[username] = {
            username: userInfo[1],
            role: parseInt(userInfo[5]),
            approved: await this.healthAdminContract.methods.approvedUsers(username).call()
          };
        }
      } catch (error) {
        console.error("Error loading users:", error);
        this.errorMessage = "Error loading users!";
      } finally {
        this.loading = false;
      }
    },
    async approveUser1(username) {
      try {
        const accounts = await this.web3.eth.getAccounts();
        //await this.healthAdminContract.methods.approveUser(username).send({ from: accounts[0] });

        let data = this.healthAdminContract.methods.approveUser(
            username
        ).encodeABI();

        const transactionParameters = {
          from: accounts[0],
          to: this.healthAdminContract.options.address,
          data: data,
        };


        await this.web3.eth.sendTransaction(transactionParameters);

        this.successMessage = `User ${username} approved successfully!`;
        this.users[username].approved = true;
      } catch (error) {
        console.error("Error approving user:", error);
        this.errorMessage = "Error approving user!";
      }
    }
  },
};
</script>

<style scoped>
.main-container {
  background-color: #f0f0f0;
  padding: 50px;
}

.container {
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.panels {
  display: flex;
  justify-content: space-between;
}

.panel {
  width: 45%;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 5px;
}

.user-section {
  margin-bottom: 30px;
}

.card {
  margin-bottom: 15px;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.button.is-warning.is-light {
  background-color: #ffdd57 !important; /* 修改这里 */
  color: black;
}

.button.is-success.is-light {
  background-color: #23d160 !important; /* 修改这里 */
  color: white;
}

.button.pending {
  background-color: #ffdd57; /* 直接使用自定义类名 */
  color: black;
}

.button.approved {
  background-color: rgba(35, 209, 96, 0.66); /* 直接使用自定义类名 */
  color: white;
}

.title.is-1 {
  margin-left: 0; /* 移动标题到左上角 */
}
</style>
