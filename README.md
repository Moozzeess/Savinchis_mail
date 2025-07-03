
# EmailCraft Lite

EmailCraft Lite is a powerful, open-source email marketing platform built with Next.js. It's designed to help you manage, send, and analyze email campaigns efficiently, with features like a visual template editor, role-based access control, and detailed performance analytics.

## Main Features

-   **Dashboard**: Get a quick overview of recent activity, key statistics, and important notifications as soon as you log in.
-   **Campaigns & Sending**: Create and send mass email campaigns. Import recipients from files (CSV, Excel), SQL queries (IT role only), or manual entry. Monitor the progress of your sends in real-time.
-   **Visual Template Editor**: Build beautiful, responsive email templates with an intuitive drag-and-drop block editor. No HTML required!
-   **Event & Certificate Management**: Organize events, manage attendees, and design custom, personalized certificates of attendance.
-   **Surveys**: Create custom surveys or import them from external sources like Google Forms using AI to gather valuable feedback from your audience.
-   **Advanced Analytics**: Dive deep into your campaign performance with charts, conversion funnels, and predictive insights to understand what works best.
-   **Role-Based Access Control (RBAC)**: Pre-defined roles (IT, Marketing, HR) with granular permissions. The IT role can manage permissions for other roles.
-   **Modern & Responsive Design**: A clean user interface built with ShadCN UI and Tailwind CSS, featuring a collapsible sidebar for an optimal user experience.

## Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/) (with App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **AI**: [Genkit](https://firebase.google.com/docs/genkit)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **UI Components**: [ShadCN UI](https://ui.shadcn.com/)
-   **Database**: [MySQL](https://www.mysql.com/)
-   **Email Sending**: [Microsoft Graph API](https://developer.microsoft.com/en-us/graph)

## Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or higher)
-   A running [MySQL](https://www.mysql.com/) server.

### Installation

1.  Clone the repository:
    ```bash
    git clone <REPOSITORY_URL>
    cd <DIRECTORY_NAME>
    ```

2.  Install the project dependencies:
    ```bash
    npm install
    ```

### Environment Variable Configuration

1.  Create a file named `.env` in the root of the project.
2.  Add the necessary credentials for the MySQL database connection and the Microsoft Graph API:

    ```env
    # MySQL Database
    MYSQL_HOST=localhost
    MYSQL_PORT=3306
    MYSQL_USER=root
    MYSQL_PASSWORD=your_password
    MYSQL_DATABASE=emailcraft_db

    # Microsoft Graph API (for sending emails)
    GRAPH_CLIENT_ID=your_client_id
    GRAPH_TENANT_ID=your_tenant_id
    GRAPH_CLIENT_SECRET=your_client_secret
    GRAPH_USER_MAIL=email_to_send_from@example.com
    ```

### Database Setup

1.  Make sure your MySQL server is running and create a database (e.g., `emailcraft_db`).
2.  Run the initialization script to create the tables and load sample data.

    ```bash
    # Replace with your credentials
    mysql -u [username] -p[password] [database_name] < sql/init.sql
    ```

### Running the Application

Once you have configured the environment variables and the database, start the development server:

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser to see the application.
