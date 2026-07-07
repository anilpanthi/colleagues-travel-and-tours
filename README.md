# Colleagues Travel and Tours

Colleagues Travel and Tours is a modern travel and tourism platform that enables customers to explore and book a wide range of tour packages across Nepal. The website features a comprehensive admin dashboard for managing travel packages, customer bookings, and website content efficiently.

Built with Progressive Web App (PWA) technology, it delivers a fast, app-like experience, allowing users to install the website on their devices and access key features even with limited internet connectivity.

Website: https://colleaguestravel.com

Designed and Developed by: https://anilpanthi.com.np

Powered by: https://antiqcode.com

## Coolify Deployment

Set the production environment URL to the canonical non-www domain:

```env
NEXT_PUBLIC_SERVER_URL=https://colleaguestravel.com
```

In Coolify, add both domains to the application so the proxy routes both hostnames to the container:

```text
https://colleaguestravel.com
https://www.colleaguestravel.com
```

The app permanently redirects `www.colleaguestravel.com` requests to `colleaguestravel.com`. If `www.colleaguestravel.com` shows "No available server", Coolify is not routing that hostname to this app yet.

## Admin Panel

- Login with email and password
- Manage packages
- Manage bookings
- Manage users

## Frontend

- Home page
- Packages page
- About us page
- Contact us page
- Blog page
- PWA features
- Offline support
- Push notifications


