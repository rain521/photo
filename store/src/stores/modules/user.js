import { defineStore } from "pinia";
import { inject, ref } from "vue";
import { ElMessage } from "element-plus";
import router from "../../router";

const useUserStore = defineStore(
    "userData",
    () => {
        const user = ref({});
        const axios = inject("$axios");
        const getUser = (callback) => {
            if (!user || !user.id) {
                axios.get("/api/auth/profile", {}).then((res) => {
                    if (res && res.status == 200) {
                        user.value = res.data;
                        if (callback) {
                            callback();
                        }
                    } else {
                        // console.log(res)
                        // ElMessage.error(res.data.message)
                    }
                });
            } else {
                if (callback) {
                    callback();
                }
            }
        };
        const setUser = (data) => {
            user.value = data;
        };
        const clearUser = () => {
            user.value = {};
        };

        return {
            user,
            getUser,
            clearUser,
            setUser,
        };
    },
    {
        persist: {
            key: "photo-mi-store-user",
        },
    },
);

export default useUserStore;
