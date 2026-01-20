import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import router from "../router";

axios.defaults.timeout = 180000;
const DateZoneOffset_Value = -new Date().getTimezoneOffset() / 60;
axios.interceptors.request.use(
    (config) => {
        var token = localStorage.getItem("photo-mi-store-token");
        if (token) {
            var token1 = JSON.parse(token).token;
            if (token1) {
                config.headers.Authorization = JSON.parse(token).token;
            }
        }
        config.headers["DateZone-Offset"] = DateZoneOffset_Value;
        config.baseURL = import.meta.env.VITE_APP_DEFAULT_API_ENDPOINT;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// 3.响应拦截器
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        /***** 接收到异常响应的处理开始 *****/
        if (error && error.response) {
            // 1.公共错误处理
            // 2.根据响应码具体处理
            switch (error.response.status) {
                case 400:
                    error.message = "错误请求";
                    break;
                case 401:
                    error.message = "未授权，请重新登录";
                    localStorage.removeItem("photo-mi-store-user");
                    localStorage.removeItem("photo-mi-store-token");
                    ElMessage.error("未授权，请重新登录");
                    router.push({ path: "/login" });
                    break;
                case 403:
                    error.message = "拒绝访问";
                    localStorage.removeItem("photo-mi-store-user");
                    localStorage.removeItem("photo-mi-store-token");
                    ElMessage.error("未授权，请重新登录");
                    router.push({ path: "/login" });
                    break;
                case 404:
                    error.message = "请求错误,未找到该资源";
                    // router.push({path:'/notFound'});
                    break;
                case 405:
                    error.message = "请求方法未允许";
                    break;
                case 408:
                    error.message = "请求超时";
                    break;
                case 500:
                    error.message = "服务器端出错";
                    break;
                case 501:
                    error.message = "网络未实现";
                    break;
                case 502:
                    error.message = "网络错误";
                    break;
                case 503:
                    error.message = "服务不可用";
                    break;
                case 504:
                    error.message = "网络超时";
                    break;
                case 505:
                    error.message = "http版本不支持该请求";
                    break;
                default:
                    error.message = `连接错误${error.response.status}`;
            }
        } else {
            // 超时处理
            if (JSON.stringify(error).includes("timeout")) {
                ElMessage.error("服务器响应超时，请刷新当前页");
            }
            // ElMessage.error('连接服务器失败')
        }
        /***** 处理结束 *****/
        //如果不需要错误处理，以上的处理过程都可省略
        return Promise.resolve(error.response);
    },
);
