<template>
  <div>
    <h1>Health Administration Dashboard</h1>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <ul>
        <li v-for="username in usernames" :key="username">
          <div v-if="users[username]">
            {{ users[username].username }} -
            {{ users[username].role === 0 ? 'Patient' : 'Doctor' }}
<!--            v-if="!users[username].approved" -->
            <button v-if="!users[username].approved" @click="approveUser1(username)">Approve</button>
          </div>
        </li>
      </ul>
    </div>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-if="successMessage">{{ successMessage }}</p>
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
                }
              ]
          ;

      const healthAdminContractAddress = "0xE7C06523Cee6600acB5767e4716E396dFc2331b8";
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
/* You can add your styles here */
</style>
