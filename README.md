# Widgestic

Widgestic is a dynamic notification widget application built with the MERN stack (MongoDB, Express, React, Node.js). It allows users to create, manage, and display customizable "toast" notifications on their websites.

## Features

-   **Customizable Toasts:** Create announcements, notifications, and improved engagement widgets.
-   **Targeting:** Display widgets on specific pages or globally.
-   **Analytics:** Track views, clicks, and dismissals.
-   **Dashboard:** specialized admin dashboard for managing toast campaigns.
-   **Easy Integration:** Simple JS snippet for embedding.

## Tech Stack

-   **Frontend:** React, Vite (presumed based on file structure)
-   **Backend:** Node.js, Express
-   **Database:** MongoDB
-   **Styling:** CSS / Tailwind (if applicable)

## Getting Started

### Prerequisites

-   Node.js installed
-   MongoDB instance running

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Shyam-Domadiya/Widgestic.git
    ```

2.  Install Server dependencies:
    ```bash
    cd server
    npm install
    ```

3.  Install Client dependencies:
    ```bash
    cd ../client
    npm install
    ```

4.  Start Development Servers:
    -   Server: `npm run dev` (in /server)
    -   Client: `npm run dev` (in /client)

## Usage

Embed the widget script in your HTML:

```html
<script src="http://localhost:5000/static/widget.js?userId=YOUR_USER_ID"></script>
```
