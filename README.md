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
    cd Widgestic
    ```

2.  Install Dependencies:
    *   **Server**:
        ```bash
        cd server
        npm install
        ```
    *   **Client**:
        ```bash
        cd ../client
        npm install
        ```

3.  Start Development Servers:
    
    **Option A: Unified Script (Windows)**
    ```bash
    .\start-dev.bat
    ```
    *This will open two terminal windows for server and client automatically.*

    **Option B: Manual Start**
    *   Server: `cd server` then `npm run dev`
    *   Client: `cd client` then `npm run dev`

## Usage

Embed the widget script in your HTML:

```html
<script src="http://localhost:5000/static/widget.js?userId=YOUR_USER_ID"></script>
```
