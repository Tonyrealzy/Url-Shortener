# 🔗 URL Shortener Service

A simple, scalable **URL Shortener** built with **TypeScript, Express, PostgreSQL (via Prisma), and Redis**.  
The service provides an API to shorten long URLs into unique short codes and redirect users when they visit the shortened link.

🚀 Live Demo: [url-shortener-service-7vhn.onrender.com](https://url-shortener-service-7vhn.onrender.com)


---


## ✨ Features

- Shorten any long URL into a compact short link
- Redirect from short link → original long URL
- Persistent storage with **PostgreSQL** (via Prisma ORM)
- Caching with **Redis** for faster lookups
- Rate limiting to prevent abuse
- Configurable expiration dates for shortened URLs
- Fully containerized with **Docker** and deployable on **Render**


---


## 🛠️ Tech Stack

- **Backend**: Node.js, Express, TypeScript  
- **Database**: PostgreSQL (via Prisma ORM)  
- **Cache**: Redis (Upstash Redis in production)  
- **Deployment**: Docker + Render  
- **Utilities**: dotenv, nodemon, ts-node  


---


## 📦 Installation & Setup

### 1. Clone the repository
git clone https://github.com/Tonyrealzy/Url-Shortener.git
cd Url-Shortener

### 2. Install dependencies
npm install

### 3. Configure environment variables
Create a .env file in the project root:
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?schema=public
REDIS_URL=<your-upstash-redis-url>
REDIS_TOKEN=<your-upstash-redis-token>
NODE_ENV=development
PORT=4000
LIMIT_TIME=1
LIMIT_REQUEST=50

### 4. Run database migrations
npx prisma migrate deploy

### 5. Generate Prisma client
npx prisma generate

### 6. Start the server
npm run dev   # development
npm run build && npm start   # production

## 🐳 Docker Setup

### Build and run locally:
docker build -t url-shortener .
docker run -p 4000:4000 url-shortener


Got it — here’s the section already structured as a full **`README.md` file** so you can just copy–paste into your repo:

````markdown
# URL Shortener Service

## 🌐 API Usage

### 🔹 Shorten a URL

**POST** `/shorten`

**Request Body**
```json
{
  "link": "https://github.com/Tonyrealzy/Robo-Advisor-React-Frontend"
}
````

**Response**

```json
{
  "status": "success",
  "message": "Link shortened successfully",
  "data": {
    "shortUrl": "https://url-shortener-service-7vhn.onrender.com/redirect?code=gik6GHG",
    "longUrl": "https://github.com/Tonyrealzy/Robo-Advisor-React-Frontend/actions/new"
  }
}
```

---

### 🔹 Redirect to Original URL

**GET** `/redirect?code=${code}`

**Example:**
[https://url-shortener-service-7vhn.onrender.com/gik6GHG](https://url-shortener-service-7vhn.onrender.com/redirect?code=gik6GHG)

➡️ Redirects to the original long URL.

---

## 🧪 Testing

You can test endpoints with **Postman** or **curl**.

**Example**

```bash
curl -X POST https://url-shortener-service-7vhn.onrender.com/shorten \
  -H "Content-Type: application/json" \
  -d '{"link":"https://example.com"}'
```

---

## 📁 Project Structure

```
src/
 ├── index.ts          # App entry point
 ├── routes/           # Express route handlers
 │    ├── shorten.ts   # POST /shorten
 │    └── redirect.ts  # GET /redirect?code=${code}
 ├── repository/       # DB access (Prisma)
 ├── utilities/        # Helpers (config, key generation, etc.)
 └── generated/        # Prisma client
prisma/
 └── schema.prisma     # Prisma schema definition
```

---

## 🚀 Deployment on Render

* **Database**: PostgreSQL (Render managed instance)
* **Cache**: Upstash Redis
* **Service**: Docker-based Render Web Service
* **Port**: Uses `$PORT` provided by Render (fallback to `4000` locally)

**Build command**

```bash
npm run build && npx prisma generate
```

**Start command**

```bash
npm start
```

---

## 📜 License

This project is licensed under the **MIT License**.

```