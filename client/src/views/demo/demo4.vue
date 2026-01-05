<template>  
  <div ></div>  
</template>  
  
<script setup lang="ts">  
import { App, Text } from 'leafer-ui'  
import '@leafer-in/editor'  
import '@leafer-in/text-editor'  
  
// 创建 App  
const app = new App({   
    view: window,  
    editor: {}   
})  
  
// 等待 App 准备就绪后设置事件监听  
app.on('ready', () => {  
    const editor = app.editor  
    const textElement = Text.one({  
        editable: true,  
        text: '双击编辑我',  
        fontSize: 20  
    })  
      
    // 方法1：监听编辑器的内部编辑状态变化  
    editor.on('innerEditing', () => {  
        console.log('内部编辑状态:', editor.innerEditing)  
          
        // 编辑结束时获取文本  
        if (!editor.innerEditing && editor.element === textElement) {  
            console.log('编辑完成:', textElement.text)  
        }  
    })  
      
    // 方法2：监听编辑器关闭事件  
    editor.on('closeInnerEditor', () => {  
        if (editor.element === textElement) {  
            console.log('编辑器关闭:', textElement.text)  
        }  
    })  
      
    // 方法3：监听选择变化（编辑结束时会触发）  
    editor.on('select', () => {  
        // 如果之前在编辑文本，现在选中的不是该文本，说明编辑结束  
        if (editor.target !== textElement && textElement.textEditing === false) {  
            console.log('通过选择变化检测到编辑完成:', textElement.text)  
        }  
    })  
      
    // 双击触发编辑  
    textElement.on('pointer:double', () => {  
        textElement.textEditing = true  
    })  
      
    app.tree.add(textElement)  
})
</script>