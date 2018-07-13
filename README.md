# minisite


## Setup Run Build

``` bash
# 安装依赖
npm install

# 运行服务
npm run dev

# 构建
npm run build

# zip压缩
gulp zip
```
## Help

``` bash 
# 编译项目：先删除build文件，再编译项目
gulp init

# html页面，css需要加注释，打包后自动合并注释中间得css为app.min.css
<!-- build:css ../assets/css/app.min.css -->
    <link rel="stylesheet" href="../assets/css/app.css">
    <link rel="stylesheet" href="../assets/css/base.no.css">
<!-- endbuild -->

gulp html:build

# config.json  gulp得配置项
{
    //开发目录
    "dev":{
        "baseDir":"src/",
        "less":"src/assets/less/",
        "css":"src/assets/css/",
        "images":"src/assets/images/",
        "js":"src/assets/js/",
        "html":"src/html/"
    },
    //构建目录
    "build":{
        "baseDir":"build/",
        "css":"build/assets/css/",
        "images":"build/assets/images/",
        "js":"build/assets/js/",
        "html":"build/html/"
    },
    //js压缩  filter 排除压缩
    "uglify":{
        "compress":false,
        "filter":["!src/assets/js/lib/*js"]
    }, 
    //css压缩  图片转base64
    "cleanCss":{
        "compress":true,
        "options":{"compatibility": "ie8"},
        "base64":{
            "maxImageSize": 9000,
            "debug": true
        }
    },
    //px 转 rem
    "px2rem":{
        "open":true,
        "options":{
            "baseDpr": 2, 
            "threeVersion": false, 
            "remVersion": true, 
            "remUnit": 75,
            "remPrecision": 6
          }
    },
    // 打包zip
    "zip":{
        "name":"minisite.zip"
    }
}