import axios from 'axios';
import store from '@/store'

export function downloadImage(url) {
  // 确保URL格式正确
  const fullUrl = `${process.env.VUE_APP_BASE_API}/qdoner${url}`;
  const token = store.state.user.token
  return axios({
    url: fullUrl,
    method: 'GET',
    responseType: 'blob', 
    headers: {
     'Admin-Token': token
    }
  }).then(response => {
    // 创建一个Blob URL用于显示图片
    const blobUrl = URL.createObjectURL(response.data);
    return blobUrl; // 返回可用于<img :src="..."/>的URL
  }).catch(error => {
    console.error('图片下载失败:', error);
    throw error;
  });
}

