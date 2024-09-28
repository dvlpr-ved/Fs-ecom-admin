<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img :src="logoUrl" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <div class="text-900 text-3xl font-medium mb-3">Welcome</div>
                        <span class="text-600 font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" v-model="email" type="text" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password :feedback="false" id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>
                         <div class="text-danger flex align-items-center justify-content-between mb-5 gap-5">
                            <span class="text-red-500" v-for="error in errors">
                                {{ error }}
                            </span>
                        </div>
                        <!-- <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox id="rememberme1" v-model="checked" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div> -->
                        <Button @click="loginUser" label="Sign In" class="w-full p-3 text-xl mt-4"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <AppConfig simple />
</template>

<script setup>
import { useLayout } from '@/layouts/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layouts/AppConfig.vue';
import { useAuthStore } from './stores/AuthStore';
const authsstore = useAuthStore();
const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
// const checked = ref(false);
const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

definePageMeta({
    layout: false
});

const errors = ref([]);
const loginUser = async () => {
    if(!email.value || !password.value){
        if(errors.value.indexOf("Username and password are required") < 0){
            errors.value.push("Username and password are required");
        }
        return;
    }

    // setting csrf as cookie 
    const csrf = await useFetch('https://fashtsaly.com/API/public/sanctum/csrf-cookie' , { query: {credentials: "include"}});
    makeLoginRequest();
}
    const makeLoginRequest = async () => {
        const xsrfToken =await useCookie('XSRF-TOKEN');
        const login = await $fetch('https://fashtsaly.com/API/public/api/login' , {
            method:'POST',
            headers:{
                'X-XSRF-TOKEN' : xsrfToken.value
            },
            body:{
                email : email.value,
                password : password.value,
                remember : true
            }
        });
        if(login.success){
            authsstore.Login(login);
        }
        errors.value.push(login.msg ? login.msg : '');
    }
</script>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}
.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
