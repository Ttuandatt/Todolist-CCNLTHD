# Dockerfile tối giản cho Frontend Placeholder
# Sử dụng Nginx để phục vụ trực tiếp tệp tĩnh, tránh mọi lỗi build Node.js/Vite

FROM nginx:stable-alpine

# Sao chép tệp HTML tĩnh vào thư mục mặc định của Nginx
COPY index.html /usr/share/nginx/html/index.html

# Expose port 80
EXPOSE 80

# Chạy Nginx
CMD ["nginx", "-g", "daemon off;"]
