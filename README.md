# Task Tracker — Express + IBM Cloud (Cloudant + Code Engine + LogDNA)

[![CI](https://img.shields.io/badge/ci-pending-lightgrey)](#)  
[![Deployed](https://img.shields.io/badge/deployed-IBM%20Code%20Engine-blue)](#)

## What is this
Task Tracker is a small, demo-ready backend API (Express/Node) for creating, listing, updating and deleting simple tasks.  
This repo is designed to showcase a **cloud-native developer workflow** using IBM Cloud free-tier services:

- **IBM Cloudant (Lite)** — NoSQL document DB for storing tasks.  
- **IBM Code Engine** — Serverless container runtime (build from your GitHub repo and deploy).  
- **IBM Log Analysis (LogDNA)** — Centralized logs and debugging.

This project is meant to be your first cloud-deployed app — minimal, secure, and CI/CD-friendly.

---

## Live demo
Deployed URL: `https://<your-code-engine-app>.appdomain.cloud` *(replace with your app URL after deploy)*

---

## Architecture (quick)
1. Express app (single container)  
2. Container built by Code Engine from GitHub → stored in IBM container registry (managed)  
3. Container runs on Code Engine; connects to Cloudant for data storage  
4. Logs forwarded to LogDNA for searching and debugging

---

## Endpoints (examples)
- `GET /health` — service + DB health  
- `GET /tasks` — list tasks  
- `POST /tasks` — create a task `{ title, description, done }`  
- `GET /tasks/:id` — get task  
- `PUT /tasks/:id` — update task  
- `DELETE /tasks/:id` — delete task

*(Use Postman or curl for testing)*

---

## Run locally (quick)
1. `git clone <repo>`  
2. `cd server`  
3. Create a `.env` with (example):
