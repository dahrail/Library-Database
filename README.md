# Team 7 Library Database Project

This project was created for the course Database Systems (3380) at the University of Houston. The objective of our design was to create a library database website named BookFinder where users such as Faculty, Admin, and Student are able to use the library website.

## About 
BookFinder is our custom-made library management system created a university library, which have users such as students, faculty, and administrators. It provides them a digital interface for browsing and managing books, music, and electronics. Since there are three roles with different access to the website, there will exist special features where each role has different checkouts, waitlists, fines, and admin tasks. The website will have triggers and data reports.

## Technologies Used:

### Frontend
![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=flat-square) &nbsp;&nbsp; ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white&style=flat-square)


### Backend
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=flat-square) 

### Database
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?logo=mysql&logoColor=white&style=flat-square) 

### Version Control:
![GitHub](https://img.shields.io/badge/-GitHub-181717?logo=github&logoColor=white&style=flat-square)

### Deployment
![Vercel](https://img.shields.io/badge/-Vercel-000?logo=vercel&logoColor=white&style=flat-square) &nbsp;&nbsp; ![Render](https://img.shields.io/badge/-Render-46E3B7?logo=render&logoColor=white&style=flat-square) &nbsp;&nbsp; ![Azure](https://img.shields.io/badge/-Azure-0078D4?logo=microsoft-azure&logoColor=white&style=flat-square)

## How to host website locally

### Cloning the repository
```bash
git clone https://github.com/dahrail/Library-Database
cd client
code .
```

### Deploying the website
```bash
cd client
npx create-react-app .
npm install react-scripts
npm start
```

### Deploying the backend/server
```bash
Backend:
cd server
npm install react react-dom
npm start
```

Deployed Website: WIP

## 5 Project Requirements

## User Authentication for Different User Roles
Roles and Permissions:

Students:
Has the ability to check out an item per category of Books, Media, and Electronics. These items must be returned in one week.

Faculty: 
Has the ability to check out 2 items per category. These must be returned in two weeks.

Common capabilities:
Browse categories, check out and reserve items, and join waitlists. View accounts where users can see their checked out items, fines, and holds. There is also manage event sign-ups and check-ins

Admins:
Admins are able to manage books, media, electronics, events, and view members.

## Data Entry Forms

Add New Data:
WIP

Modify Existing Data:
WIP

Delete Data:
WIP

## Data Queries

### Queries Supported:

Catalog Search Queries:

WIP

### Reports for Admins:
### Fines Report:

Displays total fines collected over time, filtered by date range.
Includes:
Total fines collected.
List of members with outstanding fines.
Bar graph of fines collected over time.

![Logo](Images/FinesReport.png)

### Checked-Out Books Report:

Displays statistics on books checked out, filtered by category or time range.
Includes:
Total books checked out.
Average return time.
List of books currently checked out.
Line graph of book checkouts over time.

![Logo](Images/CheckedOutBooksReport.png)

### Checked-Out Music Report:

Similar to the books report but focused on music items.
Includes:
Total music items checked out.
List of members who checked out music items.
Pie chart of genres most frequently checked out.

![Logo](Images/CheckedOutMusicReport.png)

## Triggers

### Waitlist Trigger
This trigger is activated when an item that was fully checked out is returned or was previously unavailable. It ensures the waitlist is managed by notifying the next member in the queue about the availability of the item. It does this by sending an email to that user.

WIP

### Fines Trigger
WIP
```

## Addtional Notes
Improvements to be made:

- Fix time zones conversion