import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({ isLoggedin: false, isSignedUp : false , userData : {} }),
    getters : {
        getUser(){
            return this.userData
        },
        isUserLoggedin(){
            return this.isLoggedin
        },
        isuserSignedUp(){
            return this.isSignedUp
        }
    },
    actions : {
        makeUserLoggedIn(){
            this.isLoggedin = true;
        },
        makeUserSignedUp(){
            this.isSignedUp = true;
        },
        Login(payload){
            this.userData = payload.data;
            localStorage.removeItem('OAuth-token');
            localStorage.setItem('OAuth-token' , payload.token);
            this.makeUserLoggedIn();
            this.makeUserSignedUp();
            navigateTo('/');
        }
    }
});