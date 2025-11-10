# Redis Installation Guide for Windows

This guide will help you install and run Redis on Windows to enable caching features in your e-commerce platform.

## Option 1: Using Windows Subsystem for Linux (WSL) - Recommended

### Prerequisites
1. Windows 10 version 2004 or higher
2. WSL 2 installed

### Installation Steps

1. **Install WSL 2 (if not already installed)**
   ```powershell
   wsl --install
   ```

2. **Restart your computer** if prompted

3. **Open Ubuntu (or your preferred Linux distribution) from the Start menu**

4. **Update package lists**
   ```bash
   sudo apt update
   ```

5. **Install Redis**
   ```bash
   sudo apt install redis-server
   ```

6. **Start Redis service**
   ```bash
   sudo service redis-server start
   ```

7. **Verify Redis is running**
   ```bash
   redis-cli ping
   ```
   You should see "PONG" as the response.

8. **Configure Redis to start automatically (optional)**
   ```bash
   sudo systemctl enable redis-server
   ```

## Option 2: Using Docker Desktop for Windows

### Prerequisites
1. Docker Desktop for Windows installed

### Installation Steps

1. **Pull and run Redis container**
   ```powershell
   docker run -d -p 6379:6379 --name redis redis:latest
   ```

2. **Verify Redis is running**
   ```powershell
   docker exec -it redis redis-cli ping
   ```
   You should see "PONG" as the response.

## Option 3: Using Redis Windows Port (Not recommended for production)

### Installation Steps

1. **Download Redis for Windows**
   - Visit: https://github.com/microsoftarchive/redis/releases
   - Download the latest release (e.g., Redis-x64-3.2.100.zip)

2. **Extract the files**
   - Extract to a folder like `C:\redis`

3. **Start Redis server**
   ```powershell
   cd C:\redis
   redis-server.exe redis.windows.conf
   ```

## Enabling Redis in Your Application

After installing Redis, you need to enable it in your application:

1. **Edit the [.env](file:///C:/Users/flyin/Desktop/WEBSITE/backend/.env) file in the backend directory**

2. **Change the Redis configuration:**
   ```env
   # Change this line:
   REDIS_ENABLED=true
   
   # Optionally specify host and port if different from default:
   # REDIS_HOST=localhost
   # REDIS_PORT=6379
   ```

3. **Restart your backend server**
   ```powershell
   cd backend
   npm start
   ```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Make sure no other Redis instance is running
   - Check with: `netstat -an | findstr :6379`

2. **Firewall blocking connection**
   - Ensure Windows Firewall allows connections on port 6379

3. **Permission issues**
   - Run your terminal as Administrator if needed

### Testing Redis Connection

You can test the connection manually:

1. **Using redis-cli**
   ```bash
   redis-cli ping
   ```

2. **Using telnet**
   ```bash
   telnet localhost 6379
   ```
   Then type: `PING` and press Enter

## Performance Benefits

Enabling Redis will provide the following benefits:
- Faster product listing responses (cached for 5 minutes)
- Improved individual product page load times (cached for 10 minutes)
- Reduced database load
- Better user experience with faster page loads

The application will work perfectly fine without Redis, but enabling it will significantly improve performance, especially as your product catalog grows to 200,000 items.