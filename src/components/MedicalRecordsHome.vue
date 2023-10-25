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
      const contractABI = [];
      const contractAddress = ""; // Replace with your contract address
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
