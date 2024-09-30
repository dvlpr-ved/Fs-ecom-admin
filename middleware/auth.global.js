import makeCustomRequest from '../composables/makeCustomRequest.js';

export default defineNuxtRouteMiddleware(async (to, from) => {
    const authStore = useAuthStore();

    if (!authStore.isUserLoggedin && process.client) {
        const data = await makeCustomRequest({ method: 'POST', url: 'api/refresh-token' });
        if (data.res) {
            authStore.Login(data);
        }
    }

    if (authStore.isUserLoggedin && process.client) {
        const PermissionsStore = usePermissionsStore();
        await PermissionsStore.fetchPermissions(); // Call the action, not the getter
    }
});
