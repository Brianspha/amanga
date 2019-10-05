<template>
  <div class="card center animate-in">
    <img src="https://image.flaticon.com/icons/svg/1862/1862164.svg" />
    <h1>Amanga</h1>
    <h2>Decentralising Fake News Reporting</h2>



    <div class="social-container">
      <select @change="onChange($event)" class="select-css">
        <option>Reason for reporting URL</option>
        <option>Not Factual</option>
        <option>Defamation</option>
        <option>Propaganda</option>
      </select>
    </div>
    <div class="button_container">
      <label class="field a-field a-field_a1">
        <input class="field__input a-field__input" placeholder="http://ennca.com/alksdjkl" v-model="url" required>
        <span class="a-field__label-wrap">
          <span class="a-field__label">URL</span>
        </span>
      </label>
    </div>
        <div class="button_container">
      <label class="field a-field a-field_a1">
        <input class="field__input a-field__input" placeholder="0x09asdjkalsd.." v-model="eth_address" required>
        <span class="a-field__label-wrap">
          <span class="a-field__label">Ethereum Address</span>
        </span>
      </label>
    </div>
    <div class="button_container">
      <button class="button" @click="submitURL">Submit</button>
    </div>
    <div class="button_container">
      <a href="#">Visit site</a>
    </div>
    <loading :active.sync="isLoading" :can-cancel="false" :is-full-page="true"> </loading>
  </div>

</template>

<script>
  import Web3 from 'web3'
  import Swal from 'sweetalert2'
  import loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
import isURL from 'validator/lib/isURL';
  export default {
    name: 'app',
    components:{
      loading
    },
    data() {
      return {
        eth_address:'',
        isLoading: false,
        selected: '',
        url: '',
        urlRules: [

        ],
        web3: new Web3(new Web3.providers.HttpProvider('ropsten.infura.io/v3/1ff323953d2a4cd1ac1cea6ab59a04f5')),
        abi:[{"constant":true,"inputs":[{"name":"url","type":"bytes"}],"name":"check_reached_max_votes","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x10b8823c"},{"constant":true,"inputs":[{"name":"url","type":"bytes"}],"name":"is_url_reported","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x16f3b1ca"},{"constant":false,"inputs":[{"name":"url","type":"bytes"},{"name":"reason","type":"bytes32"},{"name":"user","type":"address"}],"name":"report_url","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x415e757c"},{"constant":true,"inputs":[],"name":"get_min_token_payout","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x5189a954"},{"constant":true,"inputs":[{"name":"url","type":"bytes"}],"name":"get_url_details","outputs":[{"name":"","type":"address"},{"name":"","type":"uint256"},{"name":"","type":"uint256"},{"name":"","type":"bytes"},{"name":"","type":"uint256"},{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x6a6c5d90"},{"constant":true,"inputs":[],"name":"get_urls_reported_keys","outputs":[{"name":"","type":"bytes[]"}],"payable":false,"stateMutability":"view","type":"function","signature":"0x7094e402"},{"constant":false,"inputs":[{"name":"url","type":"bytes"},{"name":"up_down_vote","type":"uint256"},{"name":"user","type":"address"}],"name":"up_down_vote_url","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0x751c9c56"},{"constant":false,"inputs":[{"name":"url","type":"bytes"},{"name":"thash","type":"bytes"}],"name":"save_url_thash","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function","signature":"0xa0c9a727"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor","signature":"constructor"}],
        contractAddress: '0x524485B221384FAe96653037BB68b426601644fb',
        relayAddress:"0xAD5C6964b5836d67Aa8c02b6Dd56DFa385F9B992"
      }
    },
    mounted() {
      this.amangaContract = new this.web3.eth.Contract(this.abi, this.contractAddress)
      console.log(this.amangaContract)
      console.log(this.web3)

    },
    methods: {
      onChange(event) {
        console.log(event.target.value)
        this.selected = event.target.value
      },
      submitURL: async function () {
        if(this.web3.utils.isAddress(this.eth_address) || isURL(this.url)){
        this.isLoading=true
        console.log(this.selected)
        console.log(this.url)
        var url = this.web3.utils.fromAscii(this.url)
        var reason = this.web3.utils.fromAscii(this.selected)
        let This=this
        this.amangaContract.methods.report_url(url, reason,This.eth_address).send({
          gas: 8000000,
          from: This.relayAddress
        }).then((receipt, err) => {
          console.log('receipt:\n', receipt)
          if(!err){
            This.amangaContract.methods.save_url_thash(url, receipt.transactionHash).send({
            gas: 8000000,
            from: This.relayAddress
        }).then((receipt,err)=>{
          if(!err){
          This.success('Successfully reported url')
          }
           This.isLoading=false
        }).catch((err)=>{
          console.log('error saving thash: ',err)
        })
          }
         
        }).catch((err) => {
          This.isLoading=false
          console.log('something went wrong: ', err)
        })
      }
      else{
        this.error("Invaid ethereum address and or url")
      }
      },
      success(message) {
        Swal.fire(
          'Success',
          message,
          'success'
        )
      },
      error(message) {
        Swal.fire({
          type: 'error',
          title: 'Oops...',
          text: message,
          allowOutsideClick: true
        })
      }
    }
  }
</script>

<style>
  .main_app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  .button_container {
    padding: 10px;
    text-align: center;
  }

  body {
    height: 100vh;
    padding: 40px;
  }


  .center {
    margin: auto;
  }

  .card {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    width: 380px;
    min-height: 200px;
    background-color: #fff;
    padding: 40px;
    border-radius: 0.5rem;
  }

  .card img {
    width: 60%;
    border: solid 8px #eaeaea;
    border-radius: 50%;
    margin: 0 auto;
  }

  .card h1 {
    margin: 0.6rem 0 0 0;
    text-align: center;
    font-family: Heebo, Helvetica, sans-serif;
  }

  .card h2 {
    margin-top: 0;
    text-align: center;
    font-family: Heebo, Helvetica, sans-serif;
    font-weight: 300;
  }

  .social-container {
    display: flex;
    justify-content: center;
  }

  .social-container a {
    margin: 0 0.5rem;
    font-size: 3rem;
    color: #333;
    transition: .2s;
  }

  .social-container a:hover {
    color: #000;
  }


  /*dropdown styling*/
  .select-css {
    display: block;
    font-size: 16px;
    font-family: sans-serif;
    font-weight: 700;
    color: #444;
    line-height: 1.3;
    padding: .6em 1.4em .5em .8em;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0, 0, 0, 0.04);
    border-radius: .5em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"), linear-gradient(to bottom, #ffffff 0%, #e5e5e5 100%);
    background-repeat: no-repeat, repeat;
    background-position: right .7em top 50%, 0 0;
    background-size: .65em auto, 100%;
  }

  .select-css::-ms-expand {
    display: none;
  }

  .select-css:hover {
    border-color: #888;
  }

  .select-css:focus {
    border-color: #aaa;
    box-shadow: 0 0 1px 3px rgba(59, 153, 252, 0.7);
    box-shadow: 0 0 0 3px -moz-mac-focusring;
    color: #222;
    outline: none;
  }

  .select-css option {
    font-weight: normal;
  }

  /*CSS button */
  .button {
    background-color: rgb(84, 53, 255);
    /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;
  }

  /* url input */


  /*
=====
LEVEL 1. RESET STYLES
=====
*/

  .field {
    --uiFieldPlaceholderColor: var(--fieldPlaceholderColor, #767676);
  }

  .field__input {
    background-color: transparent;
    border-radius: 0;
    border: none;

    -webkit-appearance: none;
    -moz-appearance: none;

    font-family: inherit;
    font-size: 1em;
  }

  .field__input:focus::-webkit-input-placeholder {
    color: var(--uiFieldPlaceholderColor);
  }

  .field__input:focus::-moz-placeholder {
    color: var(--uiFieldPlaceholderColor);
    opacity: 1;
  }

  /*
=====
LEVEL 2. CORE STYLES
=====
*/

  .a-field {
    display: inline-block;
  }

  .a-field__input {
    display: block;
    box-sizing: border-box;
    width: 100%;
  }

  .a-field__input:focus {
    outline: none;
  }

  /*
=====
LEVEL 3. PRESENTATION STYLES
=====
*/

  /* a-field */

  .a-field {
    --uiFieldHeight: var(--fieldHeight, 40px);
    --uiFieldBorderWidth: var(--fieldBorderWidth, 2px);
    --uiFieldBorderColor: var(--fieldBorderColor);

    --uiFieldFontSize: var(--fieldFontSize, 1em);
    --uiFieldHintFontSize: var(--fieldHintFontSize, 1em);

    --uiFieldPaddingRight: var(--fieldPaddingRight, 15px);
    --uiFieldPaddingBottom: var(--fieldPaddingBottom, 15px);
    --uiFieldPaddingLeft: var(--fieldPaddingLeft, 15px);

    position: relative;
    box-sizing: border-box;
    font-size: var(--uiFieldFontSize);
    padding-top: 1em;
    width: 100%;
  }

  .a-field__input {
    height: var(--uiFieldHeight);
    padding: 0 var(--uiFieldPaddingRight) 0 var(--uiFieldPaddingLeft);
    border-bottom: var(--uiFieldBorderWidth) solid var(--uiFieldBorderColor);
  }

  .a-field__input::-webkit-input-placeholder {
    opacity: 0;
    transition: opacity .2s ease-out;
  }

  .a-field__input::-moz-placeholder {
    opacity: 0;
    transition: opacity .2s ease-out;
  }

  .a-field__input:not(:placeholder-shown)~.a-field__label-wrap .a-field__label {
    opacity: 0;
    bottom: var(--uiFieldPaddingBottom);
  }

  .a-field__input:focus::-webkit-input-placeholder {
    opacity: 1;
    transition-delay: .2s;
  }

  .a-field__input:focus::-moz-placeholder {
    opacity: 1;
    transition-delay: .2s;
  }

  .a-field__label-wrap {
    box-sizing: border-box;
    width: 100%;
    height: var(--uiFieldHeight);

    pointer-events: none;
    cursor: text;

    position: absolute;
    bottom: 0;
    left: 0;
  }

  .a-field__label {
    position: absolute;
    left: var(--uiFieldPaddingLeft);
    bottom: calc(50% - .5em);

    line-height: 1;
    font-size: var(--uiFieldHintFontSize);

    pointer-events: none;
    transition: bottom .2s cubic-bezier(0.9, -0.15, 0.1, 1.15), opacity .2s ease-out;
    will-change: bottom, opacity;
  }

  .a-field__input:focus~.a-field__label-wrap .a-field__label {
    opacity: 1;
    bottom: var(--uiFieldHeight);
  }

  /* a-field_a1 */

  .a-field_a1 .a-field__input {
    transition: border-color .2s ease-out;
    will-change: border-color;
  }

  .a-field_a1 .a-field__input:focus {
    border-color: var(--fieldBorderColorActive);
  }

  /* a-field_a2 */

  .a-field_a2 .a-field__label-wrap::after {
    content: "";
    box-sizing: border-box;
    width: 0;
    height: var(--uiFieldBorderWidth);
    background-color: var(--fieldBorderColorActive);

    position: absolute;
    bottom: 0;
    left: 0;

    will-change: width;
    transition: width .285s ease-out;
  }

  .a-field_a2 .a-field__input:focus~.a-field__label-wrap::after {
    width: 100%;
  }

  /* a-field_a3 */

  .a-field_a3 {
    padding-top: 1.5em;
  }

  .a-field_a3 .a-field__label-wrap::after {
    content: "";
    box-sizing: border-box;
    width: 100%;
    height: 0;

    opacity: 0;
    border: var(--uiFieldBorderWidth) solid var(--fieldBorderColorActive);

    position: absolute;
    bottom: 0;
    left: 0;

    will-change: opacity, height;
    transition: height .2s ease-out, opacity .2s ease-out;
  }

  .a-field_a3 .a-field__input:focus~.a-field__label-wrap::after {
    height: 100%;
    opacity: 1;
  }

  .a-field_a3 .a-field__input:focus~.a-field__label-wrap .a-field__label {
    bottom: calc(var(--uiFieldHeight) + .5em);
  }

  /*
=====
LEVEL 4. SETTINGS
=====
*/

  .field {
    --fieldBorderColor: #D1C4E9;
    --fieldBorderColorActive: #673AB7;
  }

  /*
=====
DEMO
=====
*/

  body {
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Open Sans, Ubuntu, Fira Sans, Helvetica Neue, sans-serif;
    margin: 0;

    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .page {
    box-sizing: border-box;
    width: 100%;
    max-width: 1000px;
    margin: auto;
    padding: 15px;

    display: grid;
    grid-gap: 30px;
    align-items: flex-end;
    order: 1;
  }

  @media (min-width: 481px) {

    .page {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }
</style>