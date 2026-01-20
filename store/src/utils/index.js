import { ElMessage } from "element-plus";
import router from "../router";
import useTokenStore from "@/stores/modules/token";
const tokenStore = useTokenStore();
import useUserStore from "@/stores/modules/user";
import { storeToRefs } from "pinia";
const userStore = useUserStore();
const { user } = storeToRefs(userStore);
export default {
    logout(userName) {
        userStore.clearUser();
        tokenStore.increment();
        if (userName) {
            router.push({ path: "/login", query: { user: userName } });
        } else {
            ElMessage.success("已退出");
            router.push({ path: "/login" });
        }
    },
    date(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + "T00:00:00.000Z";
        } else {
            return "";
        }
    },
    date1(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day) + "T23:59:59.000Z";
        } else {
            return "";
        }
    },
    //月份
    date2(time, end) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            if (end) {
                // 获取当前月份的最后一天
                var lastDay = new Date(year, month, 0).getDate();
                return year + "-" + (month < 10 ? "0" + month : month) + "-" + (lastDay < 10 ? "0" + lastDay : lastDay) + "T23:59:59.000Z";
            } else {
                return year + "-" + (month < 10 ? "0" + month : month) + "-01T00:00:00.000Z";
            }
        } else {
            return "";
        }
    },
    date3(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            return year + "-" + (month < 10 ? "0" + month : month) + "-" + (day < 10 ? "0" + day : day);
        } else {
            return "";
        }
    },
    date4(time) {
        if (time != null && time != "") {
            let date = new Date(time);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            return year + "-" + (month < 10 ? "0" + month : month);
        } else {
            return "";
        }
    },
    toIso8601(timeStr, end, startLocal, monthEnd) {
        if (monthEnd) {
            let date = new Date(timeStr);
            let year = date.getFullYear();
            let month = date.getMonth() + 1; // 月份是从 0 开始的，所以要加 1
            let day = date.getDate();
            // 获取当前月份的最后一天
            var lastDay = new Date(year, month, 0).getDate();
            timeStr = year + "-" + (month < 10 ? "0" + month : month) + "-" + (lastDay < 10 ? "0" + lastDay : lastDay);
        }
        // 结束时间取当日的23:59:59
        if (end) {
            const inputDate = new Date(timeStr);
            const year = inputDate.getFullYear();
            const month = inputDate.getMonth(); // 月份从 0 开始
            const day = inputDate.getDate();
            timeStr = new Date(year, month, day, 23, 59, 59);
        }
        // 处理开始时间自带+8的问题
        if (startLocal) {
            const __inputDate = new Date(timeStr);
            // 减去 8 小时
            const _resultDate = new Date(__inputDate.getTime() - 8 * 60 * 60 * 1000);

            // 格式化结果时间为字符串
            const year = _resultDate.getFullYear();
            const month = String(_resultDate.getMonth() + 1).padStart(2, "0");
            const day = String(_resultDate.getDate()).padStart(2, "0");
            const hours = String(_resultDate.getHours()).padStart(2, "0");
            const minutes = String(_resultDate.getMinutes()).padStart(2, "0");
            const seconds = String(_resultDate.getSeconds()).padStart(2, "0");
            timeStr = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
        }
        const date = new Date(timeStr);
        if (isNaN(date.getTime())) {
            throw new Error("Invalid date format");
        }
        return date.toISOString();
    },
    dataURLtoBlob(dataurl) {
        let arr = dataurl.split(","),
            mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]),
            n = bstr.length,
            u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    },
    downloadImage(imgsrc, name) {
        //下载图片地址和图片名
        let image = new Image();
        // 解决跨域 Canvas 污染问题
        image.setAttribute("crossOrigin", "anonymous");
        image.onload = function () {
            let canvas = document.createElement("canvas");
            canvas.width = image.width;
            canvas.height = image.height;
            let context = canvas.getContext("2d");
            context.drawImage(image, 0, 0, image.width, image.height);
            let url = canvas.toDataURL("image/png"); //得到图片的base64编码数据
            let a = document.createElement("a"); // 生成一个a元素
            let event = new MouseEvent("click"); // 创建一个单击事件
            a.download = name || "photo"; // 设置图片名称
            a.href = url; // 将生成的URL设置为a.href属性
            a.dispatchEvent(event); // 触发a的单击事件
        };
        image.src = imgsrc;
    },

    inList(value, list, attrList) {
        if (list) {
            for (let i = list.length - 1; i >= 0; i--) {
                let v = list[i];
                if (v == null) {
                    continue;
                }
                v.subscriptIndex = i;
                if (attrList) {
                    if (v) {
                        let match = 0;
                        for (let j = 0; attrList && j < attrList.length; j++) {
                            let attr = attrList[j];
                            if (attr) {
                                if (v[attr] == value[attr]) {
                                    match++;
                                } else {
                                    break;
                                }
                            }
                        }
                        if (match == attrList.length) {
                            return v;
                        }
                    }
                } else {
                    if (v && v.id == value.id) {
                        return v;
                    }
                }
            }
        }
    },
    inList2(value, list, valueAttr, listAttr) {
        if (list) {
            for (let i = list.length - 1; i >= 0; i--) {
                let v = list[i];
                if (v == null) {
                    continue;
                }
                v.subscriptIndex = i;
                if (valueAttr && listAttr) {
                    if (v && value[valueAttr] == v[listAttr]) {
                        return v;
                    }
                } else {
                    if (v && v.id == value.id) {
                        return v;
                    }
                }
            }
        }
    },
    downloadFile(url, filename, nameHasPostfix) {
        if (!filename) {
            filename = url.split("/").pop();
        } else {
            let _name = url.split("/").pop();
            let _name1 = _name.split(".").pop();
            filename = filename + "." + _name1;
        }
        getBlob(url).then((blob) => {
            saveAs(blob, filename);
        });
        function getBlob() {
            return new Promise((resolve) => {
                const XML = new XMLHttpRequest();
                XML.open("GET", url, true);
                XML.responseType = "blob";
                XML.onload = () => {
                    if (XML.status === 200) {
                        resolve(XML.response);
                    }
                };
                XML.send();
            });
        }
        //下载文件
        function saveAs(blob, filename) {
            const elelink = document.createElement("a");
            elelink.style.display = "none";
            elelink.download = filename;
            elelink.href = window.URL.createObjectURL(blob);
            document.body.appendChild(elelink);
            elelink.click();
            document.body.removeChild(elelink);
        }
    },
    downloadFile1(url, filename) {
        getBlob(url).then((blob) => {
            saveAs(blob, filename);
        });
        function getBlob() {
            return new Promise((resolve) => {
                const XML = new XMLHttpRequest();
                XML.open("GET", url, true);
                XML.responseType = "blob";
                XML.onload = () => {
                    if (XML.status === 200) {
                        resolve(XML.response);
                    }
                };
                XML.send();
            });
        }
        //下载文件
        function saveAs(blob, filename) {
            const elelink = document.createElement("a");
            elelink.style.display = "none";
            elelink.download = filename;
            elelink.href = window.URL.createObjectURL(blob);
            document.body.appendChild(elelink);
            elelink.click();
            document.body.removeChild(elelink);
        }
    },
};
