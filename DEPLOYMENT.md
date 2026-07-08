# OXXY — Deployment Guide

## Architecture

- **Frontend**: Netlify (static hosting)
- **Backend**: Railway / Render / Fly.io / any Node.js host

## Frontend (Netlify)

### Netlify Dashboard Settings
- **Build command**: `cd client && npm run build`
- **Publish directory**: `client/dist`

### Environment Variables (Netlify)
| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://your-backend-domain.com/api` |

### How it works
- `netlify.toml` handles SPA redirects (`/* → /index.html`)
- `VITE_API_URL` makes API calls point to your deployed backend
- If `VITE_API_URL` is not set, defaults to relative `/api` (for same-domain or proxy setups)

## Backend (Railway / Render)

### Environment Variables
| Variable | Description |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | Auto-assigned by host |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Random 32+ character string |
| `JWT_EXPIRES_IN` | `7d` |
| `COOKIE_EXPIRES_IN` | `7` |
| `FRONTEND_URL` | Your Netlify domain (e.g. `https://your-site.netlify.app`) |
| `DEFAULT_ADMIN_EMAIL` | Admin login email |
| `DEFAULT_ADMIN_PASSWORD` | Admin login password |
| `DEFAULT_ADMIN_NAME` | Admin display name |
| `CLOUDINARY_CLOUD_NAME` | (optional) Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | (optional) Cloudinary API key |
| `CLOUDINARY_API_SECRET` | (optional) Cloudinary API secret |

### First Deploy
```bash
# Seed admin user (run once on the server)
node scripts/seedAdmin.js
```

### CORS
The server reads `FRONTEND_URL` to allow cross-origin requests. Set it to your Netlify domain.

## Local Development

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

Frontend runs on `http://localhost:5173`, API proxied via Vite to `http://localhost:5000`.

## Post-Deployment Checks
- [ ] Homepage loads at Netlify URL
- [ ] All API calls resolve (check browser console for CORS/404 errors)
- [ ] Admin login works at `/admin/login`
- [ ] Products, collections, categories load
- [ ] WhatsApp enquiry links open correct chat
- [ ] Image uploads work (Cloudinary or local)
