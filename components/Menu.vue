<template>
    <div>
      <button
        @click="toggle"
        class="text-white focus:outline-none m-1.5 rounded px-6 py-2 font-medium bg-black"
     
      >
        Menu
      </button>
      <div :class="menuClasses">
        <button
          aria-label="Close"
          class="absolute top-3 right-3 text-5xl text-white cursor-pointer"
          @click="toggle"
        >
          &times;
        </button>
        
        <div class="container overflow-auto text-base sm:text-3xl">
            <div class=" my-4">
            <img
                  class="mx-auto h-12 w-auto"
                  src="https://res.cloudinary.com/dwxly1dc7/image/upload/v1690709239/8838572ba14d424fac2b9eabdcc3215e_zhghil.png"
                  alt="Workflow"
                />
               
              </div>

          <div class="p-2 " v-if="token">
            <NuxtLink @click="open=false"  to="/products" class="item">Manage products</NuxtLink>
          </div>
          <div class="p-2" v-if="token">
            <NuxtLink @click="open=false"  to="/users" class="item">Users</NuxtLink>
          </div>
          <div class="p-2" v-if="token">
            <NuxtLink @click="open=false"  to="/Orders" class="item">Orders</NuxtLink>
          </div>
          <div class="p-2" v-if="token">
            <NuxtLink @click="open=false"  to="/Settings" class="item">Settings</NuxtLink>
          </div>
          <div class="p-2" v-if="!token">
            <NuxtLink @click="open=false"  to="/Login" class="item">Login</NuxtLink>
          </div>
          <div class="p-2" v-if="token">
            <NuxtLink @click="logOut()"  to="/Login" class="item">Logout</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>

  export default {
    data() {
      return {
        open: false,
        token: null,
        user: null
      };
    },
    mounted() {
      this.token = localStorage.getItem('token');
      this.user = localStorage.getItem('user');

      if (!this.token) {
        this.$router.push('/Login');
      }

    },
    methods: {
      toggle() {
        console.log(this.token);
        this.open = !this.open;
      },
      logOut() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.open=false
        this.$router.push('/Login');

      }
    },
    computed: {
      menuClasses() {
        return {
          menu: true,
          open: this.open,
          close: !this.open
        };
      }
    }
  };
  </script>
  
  <style>
  .container {
    position: relative;
 
    width: 100%;
    text-align: center;
    margin-top: 8rem;
    overflow-y: auto;
  }
  
  .item {
    color: #ccc;
    cursor: pointer;
    text-decoration: none;
  }
  
  .item:hover {
    color: #fff;
  }
  
  .menu {
    overflow-x: hidden;
    overflow-y: auto;
    transition-duration: 700ms;
    position: fixed;
    z-index: 10;
    top: 0;
    left: 0;
    background-color: #000;
  }
  
  .open {
    height: 100%;
    width: 100%;
  }
  
  .close {
    width: 0;
    height: 100%;
  }
  </style>
  