# ✈️ MiliTime

A private, beautifully designed travel journal web app — built for one special person.

Post photos and notes from the road. She opens the link, and sees every moment you wanted to share.

---

## 🚀 Setup

```
your-repo/
├── index.html
├── style.css
├── app.js
├── posts.json
├── images/
│   └── (your photos go here)
└── README.md
```

### 2. Enable GitHub Pages

1. Go to your repo on GitHub
2. Click **Settings** → **Pages** (left sidebar)
3. Under *Source*, select **Deploy from a branch**
4. Choose branch: `main` (or `master`) — folder: `/ (root)`
5. Click **Save**

GitHub will give you a URL like:
```
https://joeycasa.github.io/militime/
```

That's the link you share with her. 💕

---

## 📸 How to Post a New Photo

### Step 1 — Upload your photo

Put your image in the `images/` folder.
- Name it something simple: `paris.jpg`, `june25.jpg`, etc.
- Any common format works: `.jpg`, `.jpeg`, `.png`, `.webp`
- Keep images under ~3 MB for fast loading

### Step 2 — Edit `posts.json`

Open `posts.json` and add a new entry at the **top** of the list (highest `id` number).

```json
[
  {
    "id": 3,
    "date": "July 4, 2026",
    "location": "Paris, France",
    "caption": "Found a little café that smelled like you'd like it. Saved you a croissant (in my heart). 🥐",
    "image": "images/paris.jpg",
    "song": "La Vie en Rose"
  },
  {
    "id": 2,
    ...
  }
]
```

**Field guide:**
| Field | Required | Notes |
|---|---|---|
| `id` | ✅ | Must be unique. Just count up. |
| `date` | ✅ | Displayed as written — "July 4, 2026" |
| `location` | ✅ | Short location name — shown on the card |
| `caption` | ✅ | Your message. Emojis welcome 💕 |
| `image` | ✅ | Path to your image: `"images/filename.jpg"` |
| `song` | ❌ | Optional. A song that fits the moment — shown in the lightbox |

### Step 3 — Commit and push

Using the **GitHub mobile app** or **github.com**:

1. Upload/drag your new image to the `images/` folder
2. Edit `posts.json` to add your entry
3. Commit both changes (a message like "Add Paris post" is fine)
4. GitHub Pages will redeploy automatically — usually takes ~1 minute

---

## 💡 Tips

- **Most recent post first:** The app automatically shows the highest `id` number at the top, so just make sure each new post has a higher `id` than the last.
- **No image?** Leave `"image": ""` and a cute placeholder will appear instead.
- **No song?** Leave `"song": ""` — the music note just won't show.
- **Captions:** Written in a handwriting-style font, so they look best as real sentences or notes — not just keywords.

*Made with love — every mile closer to you* 💕
