# React & Mongo Forum

This is a forum application built with JavaScript and MongoDB. It allows users to create threads, post comments, and like posts. The application uses environment variables for configuration and bcrypt for password hashing.

## Contents

- [Introduction](#react--mongo-forum)
- [Prerequisites](#prerequisites)
- [Installing the Project](#installing-the-project)
  - [Automated Install](#automated-install)
    - [1. Configure Environment](#1-configure-environment)
    - [2. Install and Run](#2-install-and-run)
    - [3. Future Runs](#3-future-runs)
  - [Manual Install](#manual-install)
    - [1. Clone the repository](#1-clone-the-repository)
    - [2. Navigate to the project directory](#2-navigate-to-the-project-directory)
    - [3. Install client dependencies](#3-install-client-dependencies)
    - [4. Install server dependencies](#4-install-server-dependencies)
    - [Configuring the Application](#configuring-the-application)
- [Access the webui](#access-the-webui)
- [Technology Used](#technology-used)
  - [React](#react)
  - [MongoDB](#mongodb)
  - [Node.js](#nodejs)
  - [Express](#express)
  - [bcrypt](#bcrypt)
  - [dotenv](#dotenv)


## Prerequisites

Before you begin, ensure you have met the following requirements:

* You have installed the latest version of [Node.js and npm](https://nodejs.org/en/download/).
* You are running a Windows machine. (The program may work on other OS, we have not tested.)
* You have read [this guide](https://docs.mongodb.com/manual/installation/) and installed MongoDB.

## Installing the Project

The project has two main directories, client and server. You must install dependencies and run each in seperate terminals.

To install the project, follow one of these two guides:

### Automated Install
#### 1. Configure Environment: 
Run the `1_Configure_Env.bat` script. This script will automatically rename and configure the required data by prompting you for input.

#### 2. Install and Run:
Run the `2_Install_and_Run.bat` script. This will install both the client and server dependencies and open two additional command prompt windows to run the client and server.

#### 3. Future Runs:
After the initial setup, for subsequent runs, you only need to execute `Run_No_Install.bat`

### Manual install

#### 1. Clone the repository:

```sh
git clone https://github.com/Dylan-M-afk/forum-system.git
```

#### 2. Navigate to the project directory:

```sh
cd forum-system
```

#### 3. Install client dependencies:
Navigate to the client folder, and install, then run the program with start.

```sh
cd client
npm install
npm start
```

#### 4. Install server dependencies:
Open another command prompt and navigate to the server, install, then run the program with start.

```sh
cd server
npm install
npm start
```

#### Configuring the Application

The application uses environment variables for configuration. These are stored in a `.env` file. A sample `.env.sample` file is included in the project.

To configure the application, follow these steps:

1. Rename `.env.sample` to `.env`.
2. Open `.env` and replace the placeholders with your actual values.

Here's what each environment variable is for:

* `MONGODB_URI`: Your MongoDB connection string.
* `DATABASE_NAME`: The name of the MongoDB database you want to use.
* `PEPPER`: A secret value used for password hashing.

## Access the webui
You can access the webui after you have installed and ran both the client and server. [Navigate to localhost:3000](http://localhost:3000) in your browser.


## Technology Used

Explore the technologies powering the React & Mongo Forum.

### [React](https://reactjs.org/)

![React Logo](https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/320px-React-icon.svg.png)

React, developed by Facebook, serves as the frontend library we chose to build the user interface.

### [MongoDB](https://www.mongodb.com/)

![MongoDB Logo](https://webassets.mongodb.com/_com_assets/cms/mongodb-logo-rgb-j6w271g1xn.jpg)

MongoDB, a NoSQL database, is the backbone of the forum's data storage.

### [Node.js](https://nodejs.org/)

![Node.js Logo](https://nodejs.org/static/images/logos/nodejs-new-pantone-black.svg)

Node.js powers the server-side of the React & Mongo Forum, enabling the execution of JavaScript server-side applications.

### [Express](https://expressjs.com/)

![Express Logo](https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png)

Express, a minimalist web application framework for Node.js, simplifies the development of server-side logic. It facilitates the creation of robust APIs and the handling of HTTP requests and responses.

### [bcrypt](https://www.npmjs.com/package/bcrypt)

The bcrypt library is employed for secure password hashing in the React & Mongo Forum. It adds an extra layer of protection by ensuring that user passwords are stored securely.

### [dotenv](https://www.npmjs.com/package/dotenv)

![dotenv Logo](https://github.com/motdotla/dotenv/blob/master/dotenv.png)

Dotenv simplifies the configuration of the application by loading environment variables from a `.env` file. It enhances security by keeping sensitive information, such as API keys and database URIs, separate from the codebase.

