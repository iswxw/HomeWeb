###
 # @Descripttion: 
 # @version: V 1.0
 # @Author: wxw
 # @Date: 2020-10-18 21:36:58
### 
#!/usr/bin/env sh

# 进入历史静态文件目录dist
cd docs/.vuepress

# 删除静态文件目录
rm -rf dist

echo "已经删除dist目录"

# 回到docs目录
cd ..

# 回到HomeWeb目录
cd ..

# 确保脚本抛出遇到的错误
set -e

echo "开始构建静态文件"

# 生成静态文件
npm run build

# 进入生成的文件夹
cd docs/.vuepress/dist

git init
git add -A
git commit -m 'deploy'

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:GitHubWxw/HomeWeb.git master:gh-pages

cd -