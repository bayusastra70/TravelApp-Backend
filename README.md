# 🚀 TravelApp Backend (NestJS)

The robust core of **[Mertasari Trans](https://mertasaritrans.com/)**. This backend is built with NestJS and Prisma ORM to manage high-concurrency vehicle bookings, scheduling, and administrative workflows.

## 🛠 Features
- **Booking Engine:** Automated booking code generation (`BT-YYYYMMDD-XXXX`) and overlap validation to prevent double-booking.
- **Multitenancy Support:** Uses `TENANT_SLUG` logic to handle specific provider data.
- **Transaction Safety:** Implements Prisma transactions for booking creation and status logging to ensure data integrity.
- **Status Management:** Real-time status updates (Pending, Confirmed, Done, Cancelled) with automated notification triggers.
- **Payment Logic:** Automatic 30% Down Payment (DP) calculation and payment status tracking.
- **Analytics API:** Specialized endpoints for dashboard stats, active trips, and revenue calculation.

## 🏗 Tech Stack
- **Framework:** NestJS (Node.js)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Class-validator & DTOs
- **Logging:** Custom status log tracking

## ⚙️ Installation & Setup

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/bayusastra70/TravelApp-Backend.git](https://github.com/bayusastra70/TravelApp-Backend.git)
   cd TravelApp-Backend
