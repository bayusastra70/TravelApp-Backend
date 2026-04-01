# 🚀 TravelApp Backend (NestJS)

[![Live Site](https://img.shields.io/badge/Live-mertasaritrans.com-blue?style=flat-square)](https://mertasaritrans.com/)
[![Frontend Repo](https://img.shields.io/badge/Repo-Frontend-green?style=flat-square)](https://github.com/bayusastra70/TravelApp-FrontendWeb)

The core API engine for **[Mertasari Trans](https://mertasaritrans.com/)**. This backend handles the complex business logic for vehicle rentals, availability validation, and automated scheduling.

## 🔗 Project Links
- **Production URL:** [https://mertasaritrans.com/](https://mertasaritrans.com/)
- **Frontend Repository:** [bayusastra70/TravelApp-FrontendWeb](https://github.com/bayusastra70/TravelApp-FrontendWeb)

## 🛠 Features
- **Booking Engine:** Automated booking code generation (`BT-YYYYMMDD-XXXX`) with overlap validation.
- **Transaction Safety:** Uses Prisma `$transaction` to ensure data integrity between bookings, status logs, and notifications.
- **Dynamic Availability:** Real-time checking to ensure no vehicle is double-booked for the same period.
- **Admin Analytics:** Specialized endpoints for revenue tracking, active trips, and fleet occupancy.
- **Notification System:** Automated internal alerts for every status change.

## 🏗 Tech Stack
- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL + Prisma ORM
- **Architecture:** Modular Pattern

## ⚙️ Quick Start
1. **Clone & Install:** `npm install`
2. **Environment:** Set `DATABASE_URL` and `TENANT_SLUG` in `.env`.
3. **Database:** `npx prisma migrate dev`
4. **Run:** `npm run start:dev`
