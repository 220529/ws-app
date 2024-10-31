# 使用 Node.js 官方镜像作为基础镜像
FROM node:16

# 设置工作目录
WORKDIR /

# 复制 package.json 和 package-lock.json（如果存在）
COPY package.json package-lock.json /

# 安装项目依赖
RUN npm install

# 复制项目文件
COPY . ./

EXPOSE 7100

# 打印当前目录中的文件和目录，并启动 Node.js 应用
CMD ["sh", "-c", "ls -al && node server.js"]
