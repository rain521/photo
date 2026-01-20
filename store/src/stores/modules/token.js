import { defineStore } from "pinia";
import { ref } from "vue";

const useTokenStore = defineStore(
    "tokenData",
    () => {
        const token = ref("");

        const increment = (item) => {
            if (item) {
                token.value = `Bearer ${item}`;
            } else {
                token.value = "";
            }
        };

        return {
            token,
            increment,
        };
    },
    {
        persist: {
            key: "photo-mi-store-token",
        },
    },
);

export default useTokenStore;
