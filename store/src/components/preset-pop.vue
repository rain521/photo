<template>
    <el-dialog v-model="dialogVisible" title="选择预设方案" width="1000px" :before-close="cancel">
        <div class="preset-view">
            <div class="preset-view-img">
                <el-image :src="thumbPath" fit="contain" v-if="thumbPath" style="width: 100%" />
            </div>
            <el-scrollbar class="preset-view-body" max-height="500px">
                <div class="preset-content">
                    <div class="preset-content-title">选择修图类型：</div>
                    <div class="preset-content-ul" v-if="data.types">
                        <div class="preset-content-li" v-for="(item, index) in data.types" :key="index" @click="typeCb(item)">
                            <i class="iconfont icon-gouxuan-4" v-if="!item.selected && !item.forbid"></i>
                            <i class="iconfont icon-gouxuan-5" v-if="item.selected && !item.forbid"></i>
                            <i class="iconfont icon-gouxuan-6" v-if="item.forbid"></i>
                            <span>{{ item.name }}</span>
                        </div>
                    </div>
                    <div class="preset-content-hr"></div>
                    <template v-if="data.series">
                        <div class="preset-content-view" v-for="(series, seriesIndex) in data.series" :key="seriesIndex">
                            <div class="preset-content-title">{{ series.name }}</div>
                            <div class="preset-content-ul" v-if="series.specifications">
                                <div class="preset-content-li" v-for="(item, index) in series.specifications" :key="index" @click="specificationCb(item)">
                                    <i class="iconfont icon-gouxuan-4" v-if="!item.selected && !item.forbid"></i>
                                    <i class="iconfont icon-gouxuan-5" v-if="item.selected && !item.forbid"></i>
                                    <i class="iconfont icon-gouxuan-6" v-if="item.forbid"></i>
                                    <img :src="item.icon" style="width: 24px; height: 24px; margin: 0 4px" />
                                    <span>{{ item.name }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </div>
            </el-scrollbar>
        </div>
        <div class="c-model-foot" style="text-align: center; margin-top: 40px">
            <el-button @click="cancel()" size="large">取消</el-button>
            <el-button @click="save()" type="primary" size="large">确认</el-button>
        </div>
    </el-dialog>
</template>
<script setup>
import { onMounted, ref, watch, inject } from "vue";
import { ElMessage } from "element-plus";
const axios = inject("$axios");
const props = defineProps({
    preset: {
        type: Object,
        default: {},
    },
    id: {
        type: Number,
        default: "",
    },
    thumbPath: {
        type: String,
        default: "",
    },
});
const data = ref({});
const dialogVisible = ref(true);
const preset = ref();
const thumbPath = ref("");
onMounted(() => {
    if (props.preset) {
        preset.value = props.preset;
    }
    if (props.id) {
        init(props.id);
    }
    if (props.thumbPath) {
        thumbPath.value = props.thumbPath;
    }
});
function init(id) {
    axios
        .get("/manager/api/preset-templates/" + id)
        .then((res) => {
            if (res.status == 200 || res.status == 201) {
                data.value = res.data;
                if (preset.value && preset.value.type) {
                    data.value.types.forEach(function (type) {
                        if (type.name == preset.value.type) {
                            typeCb(type);
                        }
                    });
                    data.value.series.forEach(function (series) {
                        if (series.name == preset.value.series && series.specifications) {
                            series.specifications.forEach(function (specification) {
                                if (specification.name == preset.value.specification) {
                                    specificationCb(specification);
                                }
                            });
                        }
                    });
                }
            } else {
                ElMessage.error(res.data.message || "系统报错");
            }
        })
        .catch(function () {
            ElMessage.error("接口报错，请稍后重试！");
        });
}

function typeCb(item) {
    if (!item.forbid) {
        let _is = JSON.parse(JSON.stringify(item));
        data.value.types.forEach(function (type, i) {
            type.selected = false;
        });
        item.selected = !_is.selected ? true : false;
        dataInfo();
    }
}
function specificationCb(item) {
    if (!item.forbid) {
        let _is = JSON.parse(JSON.stringify(item));
        data.value.series.forEach(function (series, i) {
            if (series.specifications) {
                series.specifications.forEach(function (specification, i1) {
                    specification.selected = false;
                });
            }
        });
        item.selected = !_is.selected ? true : false;
        dataInfo();
    }
}
function dataInfo() {
    let _type = null;
    let _series = null;
    let _specification = null;
    data.value.types.forEach(function (type) {
        type.forbid = false;
        if (type.selected) {
            _type = type.name;
        }
    });
    data.value.series.forEach(function (series, i) {
        if (series.specifications) {
            series.specifications.forEach(function (specification, i1) {
                specification.forbid = false;
                if (specification.selected) {
                    _series = series.name;
                    _specification = specification.name;
                }
            });
        }
    });
    if (_type) {
        let _skus = [];
        data.value.skus.forEach(function (sku) {
            if (sku.type == _type) {
                _skus.push(sku);
            }
        });
        data.value.series.forEach(function (series) {
            if (series.specifications) {
                series.specifications.forEach(function (specification) {
                    let _ext = false;
                    _skus.forEach(function (sku) {
                        if (sku.series == series.name && sku.specification == specification.name) {
                            _ext = true;
                        }
                    });
                    if (!_ext) {
                        specification.forbid = true;
                        specification.selected = false;
                    }
                });
            }
        });
    }
    if (_series && _specification) {
        let _skus = [];
        data.value.skus.forEach(function (sku) {
            if (sku.series == _series && sku.specification == _specification) {
                _skus.push(sku);
            }
        });
        console.log(_skus);
        data.value.types.forEach(function (type) {
            let _ext = false;
            _skus.forEach(function (sku) {
                if (sku.type == type.name) {
                    _ext = true;
                }
            });
            if (!_ext) {
                type.forbid = true;
                type.selected = false;
            }
        });
    }
}
const emits = defineEmits(["callback"]);
const cancel = function () {
    emits("callback");
};
const save = function () {
    let _type = null;
    let _series = null;
    let _specification = null;
    let _sku = null;
    data.value.types.forEach(function (type) {
        type.forbid = false;
        if (type.selected) {
            _type = type.name;
        }
    });
    data.value.series.forEach(function (series, i) {
        if (series.specifications) {
            series.specifications.forEach(function (specification, i1) {
                specification.forbid = false;
                if (specification.selected) {
                    _series = series.name;
                    _specification = specification.name;
                }
            });
        }
    });
    if (_type && _series && _specification) {
        data.value.skus.forEach(function (sku) {
            if (sku.series == _series && sku.specification == _specification && sku.type == _type) {
                _sku = sku;
            }
        });
    }
    if (_sku) {
        emits("callback", _sku);
    } else {
        ElMessage.error("请选择预设");
    }
};
</script>
<style scoped lang="scss">
.preset-view {
    display: flex;
    justify-content: space-between;

    .preset-view-img {
        width: 140px;
        height: 178px;
        min-width: 140px;
    }

    .preset-view-body {
        width: 80%;
        margin-left: 16px;

        .preset-content {
            width: 95%;
        }
    }
}

.preset-content-view {
    margin-bottom: 26px;
}

.preset-content-title {
    font-size: 14px;
    color: var(--text-general);
    line-height: 20px;
    margin-bottom: 10px;
}

.preset-content-ul {
    display: flex;
    flex-wrap: wrap;

    .preset-content-li {
        display: flex;
        align-items: center;
        height: 35px;
        width: 140px;
        font-size: 14px;
        color: var(--text-general);
        cursor: pointer;

        .iconfont {
            font-size: 20px;
        }

        .icon-gouxuan-4 {
            color: var(--text-general);
        }

        .icon-gouxuan-5 {
            color: var(--brand-color);
        }

        .icon-gouxuan-6 {
            color: #ddd;
        }
    }
}

.preset-content-hr {
    width: 100%;
    height: 1px;
    background: #ebebf0;
    margin: 16px 0;
}
</style>
