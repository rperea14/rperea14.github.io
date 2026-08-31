# 🌐 Complete Guide: Deploying `new_frontend` to your GoDaddy Domain

This step-by-step guide explains how to deploy your new modern website and MedicAI landing page to your freshly purchased **GoDaddy domain** (e.g., `yourdomain.com`).

Choose the option below that matches your setup:
- **[Option 1 (Recommended & Free): GitHub Pages + GoDaddy DNS](#option-1-recommended--free-github-pages--godaddy-dns)** — Best if you already have this GitHub repo (`rperea14.github.io`). Zero hosting cost, automatic free SSL/HTTPS, and automatic deployment.
- **[Option 2: GoDaddy cPanel Web Hosting](#option-2-godaddy-cpanel-web-hosting-file-manager--ftp)** — Best if you purchased a GoDaddy hosting plan (cPanel / Linux Web Hosting) along with your domain.
- **[Option 3: Vercel / Cloudflare Pages (Free High-Performance CDN)](#option-3-vercel-or-cloudflare-pages--godaddy-dns)** — Instant 1-click drag-and-drop or Git deployment with global CDN edge caching.

---

## Option 1 (Recommended & Free): GitHub Pages + GoDaddy DNS

Since your website is built with clean HTML5, CSS, and vanilla JS, you can host it for **free with automatic HTTPS** on GitHub Pages while using your custom GoDaddy domain name.

### Step 1: Promote `new_frontend` to Root (or Branch)

To make `new_frontend` the default live site on GitHub Pages:

1. **Option A (Move files to root)**:
   Copy the files from `new_frontend/` to the repository root:
   - Move `new_frontend/index.html` → `index.html`
   - Move `new_frontend/medicai.html` → `medicai.html`
   - Move `new_frontend/cv.html` → `cv.html`
   - Move `new_frontend/projects.html` → `projects.html`
   - Move `new_frontend/publications.html` → `publications.html`
   - Move `new_frontend/contact.html` → `contact.html`
   - Move `new_frontend/css/` → `css/`
   - Move `new_frontend/js/` → `js/`

2. **Commit and push to GitHub**:
   ```bash
   git add .
   git commit -m "Deploy new modern frontend and MedicAI landing page"
   git push origin main
   ```

### Step 2: Configure Custom Domain in GitHub

1. Go to your GitHub repository: `https://github.com/rperea14/rperea14.github.io`
2. Click **Settings** (gear icon at top).
3. In the left sidebar, click **Pages**.
4. Under **Custom domain**, enter your GoDaddy domain name (e.g. `yourdomain.com` or `www.yourdomain.com`).
5. Click **Save**. (GitHub will automatically create a `CNAME` file in your repository).
6. Check the box for **"Enforce HTTPS"** (available once DNS resolves).

### Step 3: Configure GoDaddy DNS Records

1. Log in to [GoDaddy Account Manager](https://account.godaddy.com/).
2. Under **My Products** → **Domains**, find your domain and click **DNS** (or **Manage DNS**).
3. Add the following **4 A Records** pointing to GitHub's server IPs:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` | 1 Hour (or 600s) |
| **A** | `@` | `185.199.109.153` | 1 Hour (or 600s) |
| **A** | `@` | `185.199.110.153` | 1 Hour (or 600s) |
| **A** | `@` | `185.199.111.153` | 1 Hour (or 600s) |

4. Add or edit the **CNAME Record** for `www`:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `www` | `rperea14.github.io` | 1 Hour |

5. **Save** changes. DNS propagation usually takes between 10 minutes and 2 hours.

---

## Option 2: GoDaddy cPanel Web Hosting (File Manager / FTP)

If you purchased a **GoDaddy Web Hosting** plan with cPanel:

### Method A: Via GoDaddy cPanel File Manager (Easiest)

1. Log in to [GoDaddy](https://account.godaddy.com/) → **Web Hosting** → Click **Manage** next to your hosting account.
2. Click **cPanel Admin**.
3. Under the **Files** section, click **File Manager**.
4. Double-click the **`public_html`** directory (this is your web root).
5. Zip the contents of your `new_frontend` folder:
   - Select all files inside `new_frontend` (`index.html`, `medicai.html`, `cv.html`, `projects.html`, `publications.html`, `contact.html`, `css/`, `js/`).
   - Create a `.zip` archive (e.g. `website.zip`).
6. In cPanel File Manager, click **Upload** at the top and select `website.zip`.
7. Once uploaded, right-click `website.zip` inside `public_html` and click **Extract**.
8. Verify that `index.html` is directly inside `public_html/` (not inside a subfolder).
9. Visit your domain in the browser to confirm it is live!

### Method B: Via FTP (FileZilla or Cyberduck)

1. In your GoDaddy cPanel, find your **FTP Username**, **FTP Password**, and **Host / IP**.
2. Open FileZilla, enter:
   - **Host**: `ftp.yourdomain.com` (or your server IP)
   - **Username**: `your_cpanel_username`
   - **Password**: `your_cpanel_password`
   - **Port**: `21`
3. In the remote panel (right side), navigate into `public_html/`.
4. In the local panel (left side), navigate into `new_frontend/`.
5. Select all files and folders inside `new_frontend/` and drag them into `public_html/`.

---

## Option 3: Vercel or Cloudflare Pages + GoDaddy DNS

If you want blazing-fast global edge hosting with instant deployments:

### Step 1: Deploy with Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** → **Project**.
3. Select your repository `rperea14/rperea14.github.io`.
4. In **Root Directory**, click edit and select **`new_frontend`**.
5. Click **Deploy**. Your site will be live on a `*.vercel.app` URL within seconds.

### Step 2: Connect GoDaddy Domain in Vercel
1. In your Vercel Project Dashboard, go to **Settings** → **Domains**.
2. Enter your custom domain (e.g., `yourdomain.com`).
3. Vercel will give you exact DNS records:
   - **A Record**: `@` → `76.76.21.21`
   - **CNAME Record**: `www` → `cname.vercel-dns.com`
4. Log in to GoDaddy DNS Manager, add these two records, and save!

---

## 🔒 Enabling Free SSL / HTTPS on GoDaddy

- **If using GitHub Pages (Option 1)**: GitHub generates a free Let's Encrypt SSL certificate automatically within 15–30 minutes after DNS propagation. Just ensure **"Enforce HTTPS"** is checked in repository Settings → Pages.
- **If using Vercel / Cloudflare (Option 3)**: SSL is automatically issued and managed for free with zero configuration.
- **If using GoDaddy cPanel (Option 2)**: In cPanel, go to **SSL/TLS Status** → Click **Run AutoSSL** to generate a free certificate.

---

## 🔍 Verification Checklist

After setting up DNS and uploading files:
- [ ] Test `https://yourdomain.com` (Home page loads cleanly).
- [ ] Test `https://yourdomain.com/medicai.html` (Interactive MedicAI scribe demo works).
- [ ] Test `https://yourdomain.com/cv.html` (Print button and PDF link work).
- [ ] Test `https://www.yourdomain.com` (Ensures `www` subdomain properly redirects).
- [ ] Check mobile view on your smartphone.
