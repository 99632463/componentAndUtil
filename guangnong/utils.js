import Vue from "vue";

// 复制文本
function copyText(text) {
  const input = document.createElement("input");
  document.body.appendChild(input);
  input.style.height = 0;
  input.style.position = "fixed";
  input.style["z-index"] = "-99";
  input.value = text;
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

function downloadImg(url) {
  if (!window.plus) {
    // 网页下载图片
    var a = document.createElement("a"); // 创建一个a节点插入的document
    var event = new MouseEvent("click"); // 模拟鼠标click点击事件
    a.download = "img"; // 设置a节点的download属性值
    a.href = url; // 将图片的src赋值给a节点的href
    a.dispatchEvent(event); // 触发鼠标点击事件
  } else {
    // 手机端保存图片
    if (window.plus) {
      var aa = window.plus.downloader.createDownload(url, {}, function(
        d,
        status
      ) {
        if (status === 200) {
          window.plus.gallery.save(
            d.filename,
            function() {
              // 保存到相册方法
              // alertMsg('已保存到手机相册')
            },
            function() {
              // alertMsg('保存失败，请重试！')
            }
          );
        } else {
          // alertMsg('保存失败，请重试！')
        }
      });
    }
    aa.start();
  }
}

function isWechat() {
  return /MicroMessenger/i.test(window.navigator.userAgent);
}

function isToutiao() {
  return /NewsArticle/i.test(window.navigator.userAgent);
}

function isIos() {
  return navigator.userAgent.match(/(iPhone|iPod|iPad|Mac);?/i);
}

function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    // IE专用
    if (script.readyState) {
      // 这边是IE的一个监听下载状态的事件
      script.onreadystatechange = function() {
        if (
          script.readyState === "complete" ||
          script.readyState === "loaded"
        ) {
          resolve();
        }
      };
    } else {
      // 一般浏览器都可行
      script.onload = function() {
        resolve();
      };
    }
    script.src = url;
    document.head.appendChild(script);
  });
}

function setUrlQuery(options) {
  let { url, query } = options;
  if (!url) return "";
  if (query) {
    let queryArr = [];
    for (const key in query) {
      if (query.hasOwnProperty(key)) {
        queryArr.push(`${key}=${query[key]}`);
      }
    }
    if (url.indexOf("?") !== -1) {
      url = `${url}&${queryArr.join("&")}`;
    } else {
      url = `${url}?${queryArr.join("&")}`;
    }
  }
  return url;
}
const utils = {
  install: function(Vue, options) {
    Vue.prototype.$copyText = copyText;
    Vue.prototype.$downloadImg = downloadImg;
    Vue.prototype.$isWechat = isWechat;
    Vue.prototype.$isToutiao = isToutiao;
    Vue.prototype.$loadScript = loadScript;
    Vue.prototype.$isIos = isIos;
    Vue.prototype.$setUrlQuery = setUrlQuery;
  }
};

Vue.use(utils);

export default utils;
