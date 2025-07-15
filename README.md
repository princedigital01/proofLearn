# 🎓 ProofLearn – Decentralized E-Learning Platform

> **Built by students, for students.**  
> Our goal: Make learning faster, smoother, and more rewarding — with Web3 tech under the hood.

## visit at

https://proof-learn-e.vercel.app/

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
- 💰 Escrow Payment Contract(planned)

---

## 🧱 Tech Stack

| Layer       | Stack                            |
|-------------|----------------------------------|
| Frontend    | Next.js (App Router), Tailwind CSS |
| Backend     | Node.js, MongoDB (Mongoose), REST |
| Auth        | NextAuth.js                      |
| Web3 Ready  | Aiken(planned), Meshsdk.js, Lucid  |
| Storage     | IPFS (Planned)                   |

---

## ⚙️ How to Set Up (Local Dev)


### 1. Clone the Repo
 - git clone https://github.com/your-team/prooflearn.git
 - cd prooflearn/dapp

---

### 2. Install Dependencies

npm install.
### 3. Create .env File.
.env

MONGO_CONN_STR=mongodb+srv://igberaeseedward2005:tfXvG6d2SKVR37mr@cluster.cqpg61y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster

GOOGLE_CLIENT_ID=887047876662-ank6uvcjb3jgh97bbp5uuqf4b4g416qa.apps.googleusercontent.com

GOOGLE_CLIENT_SECRET=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

GITHUB_CLIENT_ID=Ov23liSmAaVzBQNGbDEy

GITHUB_CLIENT_SECRET=1dceab39d95e2a57d9320e586f2eb6f63f3452a1

NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET=oW6uZrSk8F5sUECmQlfqjCcbjD3PfsPv3LZekgphZ4

BCRYPT_SALT=10


### 4. Run Locally

npm run dev

Visit: http://localhost:3000

🏗 Folder Overview

dapp/
|    folder/sub-folder |       content                                |
|----------------------|----------------------------------------------|
| ├── app/             |  # Routes (Next.js App Router)               |
| │   ├── courses/     | # Course pages, lessons, quizzes             |
| │   ├── certificate/ |  # Certificate views & verifications         |
| │   ├── educators/   |  # Educator tools                            |
| │   ├── dashboard/   |  # User dashboard                            |
| │   ├── staking/     |  # Token staking (planned)                   |
| │   ├── goverrnance/ |  # Governance UI                             |
| │   └── api/         |  # All backend endpoints                     |
| ├── components/      |  # UI components & layout                    |
| ├── models/          |  # MongoDB schemas (Course, Quiz, etc.)      |
| ├── lib/             |  # DB connection & helper utils              |
| ├── public/          |  # Static assets                             |
| └── utils/           |  # Wallet utils & contract interaction       |
 
### 5 🌐 Blockchain Modules (plannned)

- 🎖 Credential NFT System
- Mints on course completion
- Verifiable on Cardano testnet
- Contains course, grade, wallet ID, timestamp

#### 🔗 Smart Contracts
Written in Aiken

#### Modules: Enrollment validator, Certificate NFT, Escrow logic

All smart contracts will be written using **Aiken**, a modern and efficient smart contract language built for Cardano.

These contracts will power the core blockchain features of the ProofLearn platform.

---

##### 🎖 1. Certificate NFT Validator(planned)

> 🎓 Mints tamper-proof, globally verifiable certificates.

- Mints a unique **NFT credential** after a student completes a course
- Uses the **CIP-68 standard** for updatable NFT metadata
- Certificate metadata includes:
  - Course title 
  - Completion score
  - Student wallet address
  - Timestamp
- Proof of learning that lives on-chain, forever

---

##### 💰 2. Escrow Logic Contract(planned)
 
> 🏦 Trustless payment between students and educators.

- Holds course payment in escrow at the time of enrollment
- Automatically releases funds to the educator on course completion
- Refund logic included (e.g. incomplete course or failed access)
- Adds trust and transparency without platform interference


#### 🔐 Wallet Support
Nami, Eternl, Yoroi (via Mesh.js)

#### NFT storage + payments


## 👥 Team
| Name	            |Role                 |
|-------------------|---------------------|
| Edward            |Fullstack            |
| Kennedy 	        |Blockchain Developer |


## 📬 Contact
### GitHub
github.com/princedigital01/

### Email
iggberaeseedward2005@gmail.com

### Cardano Hackathon Team
SOLUTION WEB
