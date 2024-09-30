import { defineStore } from 'pinia';
import makeCustomRequest from '../composables/makeCustomRequest.js';

export const usePermissionsStore = defineStore('permissions', {
    state: () => ({ permissions: false }),
    
    getters: {
        userPermissions() {
            return this.permissions;
        },
    },
    
    actions: {
        async fetchPermissions() {
            const permissionsData = await makeCustomRequest({
                url: `api/getUserPermissions`,
                method: 'POST', 
            });
            if (permissionsData.success) {
                this.permissions = permissionsData.data;
            }
        }
    }
});