# 🎓 ProofLearn – Decentralized E-Learning Platform

> **Built by students, for students.**  
> Our goal: Make learning faster, smoother, and more rewarding — with Web3 tech under the hood.

---

## 🔥 Why We Built This

We didn’t just want to build a cool blockchain app.

We’re building this because we’re **understand the pain of every student**:
- Overwhelmed with too much to read before exams
- No tools to simplify hard topics
- No way to prove or own what we’ve learned
- Educators who teach well often earn nothing extra

**ProofLearn** is our solution:  
A platform to make school feel less like punishment and more like learning — the way secondary school used to be.


## 🧩 What It Offers (So Far)

### ✅ Done (Web2 MVP)
- 🧑‍🎓 Student dashboard
- 📚 Course browsing & enrollment
- 📝 Lesson + quiz system
- 📄 Certificate generator (NFT-ready)
- 🎓 Educator dashboard
- 🔒 Auth & progress tracking
- 🗳 Governance prototype page

### 🚧 In Progress
- ⚡ Smart Summary (AI-assisted studying)
- 🪙 Token rewards system (LEARN token)
- 🎖 NFT Certificate minting (Cardano testnet)
- 💼 Wallet login & smart contract integration

---

## 🧱 Tech Stack

| Layer       | Stack                            |
|-------------|----------------------------------|
| Frontend    | Next.js (App Router), Tailwind CSS |
| Backend     | Node.js, MongoDB (Mongoose), REST |
| Auth        | NextAuth.js                      |
| Web3 Ready  | Aiken (Planned), Mesh.js, Lucid  |
| Storage     | IPFS (Planned)                   |

---

## ⚙️ How to Set Up (Local Dev)


### 1. Clone the Repo

git clone https://github.com/your-team/prooflearn.git
cd prooflearn/dapp

### 2. Install Dependencies

npm install
3. Create .env File
env

MONGODB_URI=mongodb+srv://<your-uri>
NEXTAUTH_SECRET=your-secret
NEXTAUTH_SECRET=your-secret
GITHUB_SECRET=your-secret
GOOGLE_SECRET=your-secret

### 4. Run Locally

npm run dev
Visit: http://localhost:3000

🏗 Folder Overview

dapp/
├── app/               # Routes (Next.js App Router)
│   ├── courses/       # Course pages, lessons, quizzes
│   ├── certificate/   # Certificate views & verifications
│   ├── educators/     # Educator tools
│   ├── dashboard/     # User dashboard
│   ├── staking/       # Token staking (planned)
│   ├── goverrnance/   # Governance UI
│   └── api/           # All backend endpoints
├── components/        # UI components & layout
├── models/            # MongoDB schemas (Course, Quiz, etc.)
├── lib/               # DB connection & helper utils
├── public/            # Static assets
└── utils/             # Wallet utils & contract interaction

### 5 🌐 Blockchain Modules (Planned)

-🎖 Credential NFT System
-Mints on course completion
-Verifiable on Cardano testnet
-Contains course, grade, wallet ID, timestamp

🔗 Smart Contracts
Written in Aiken

Modules: Enrollment validator, Certificate NFT, Escrow logic

🔐 Wallet Support
Nami, Eternl, Yoroi (via Mesh.js)

NFT storage + payments


## 👥 Team
Name	            Role
Edward Igberaese	Fullstack 
Kennedy 	        Blockchain Developer


## 📬 Contact
GitHub: github.com/princedigital01/

Email: iggberaeseedward2005@gmail.com

Cardano Hackathon Team: SOLUTION WEB