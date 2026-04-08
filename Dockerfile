# Use Node 20 image
FROM node:20-bullseye

# Install Playwright dependencies
RUN apt-get update && \
    apt-get install -y \
    libnspr4 \
    libnss3 \
    libdbus-1-3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxkbcommon0 \
    libatspi2.0-0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package.json and install
COPY package*.json ./
RUN npm install

# Install Playwright and browsers
RUN npx playwright install

# Copy project code
COPY . .

# Default command to run tests (optional)
CMD ["npx", "playwright", "test"]