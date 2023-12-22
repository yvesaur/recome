<p align="center">
  <img align="center" src="/doc/img/recome-banner.png" alt="Recome Banner" width="450" height="175"> 

  <div align="center">
    
  ![Static Badge](https://img.shields.io/badge/status-pre_release-green)
  ![GitHub watchers](https://img.shields.io/github/watchers/yvesaur/recome)
  ![GitHub Repo stars](https://img.shields.io/github/stars/yvesaur/recome)
  ![GitHub release (with filter)](https://img.shields.io/github/v/release/yvesaur/recome) 
  ![GitHub License](https://img.shields.io/github/license/yvesaur/recome)
  </div>
</p>

---

**A personalized news web application with a news recommender model using `NLP`, `CNN`, and `Filtering algorithm`**


Join me on this transformative journey in news discovery, where technology meets information, and each user's experience through the news landscape is personalized and intuitive.

<p align="center">
  <img align="center" src="/doc/img/recome_desktopview.png" alt="Recome Banner" width="425" height="300"> 
  <img align="center" src="/doc/img/recome_mobile_view.png" alt="Recome Banner" height="300" width="175"> 
</p>

## :sparkles: Current Features
 - **Browse and read news**
 - **News Recommender**
    - Recommended news based on clicked news
    - Recommended news based on user behavior
 - **User Account**
    - Registration
    - Login
    - Filter news based on keywords, topics, etc.
    - See Recently Visited News

## :computer: Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing.

### Prerequisites

#### Needed:
 - `Node v18.17`
 - `Python v3.7`
 - `PostgreSQL v16.1`
#### Optional:
 - `Postman`
 - `pgAdmin 4`


### Installing - How to run locally and make changes

1. **Fork and Clone the Repository**
    ```bash
    git clone <forked-repository-ssh.git>
    cd recome
    ```

2. **Install dependencies**
    - `Server 0`
  
      ```bash
      cd recome/server
      npm install
      ```
    - `Server 1`
      ```bash
      cd recome/server1
      pip install -r requirements.txt
      ```
     - `Client`
       ```bash
       cd recome/client
       npm install
       ```

3. **Create Environment Variables**
    ```bash
    cd recome/server
    touch .env
    ```
    - Variables
  
      ```properties
      PORT=
      PGUSER=
      PGHOST=
      PGPASSWORD=
      PGDATABASE=
      PGPORT=
      JWT_SECRET=
      ```

4. **Start the local server**

    - `Server 0`
  
      ```bash
      cd recome/server
      npm start
      ```
    - `Server 1`
      ```bash
      cd recome/server1
      python manage.py runserver
      ```
     - `Client`
       ```bash
       cd recome/client
       npm start
       ```

5. **Explore, Test, and Make Changes**

   After following the installation steps outlined above, you're set to explore the project, test its functionalities, and make any necessary changes.

### Making Changes
- To make changes, navigate to the respective directories:
  - For server-side changes, access `server/` or `server1/` directories.
  - For client-side modifications, navigate to `client/`.

- Implement the desired changes following best coding practices.
- Test the changes locally to verify their effectiveness.

Remember to commit changes and push them to your forked repository before creating a pull request.
  
Feel free to explore, experiment, and enhance the project as needed!

## :hammer: Built With 

* [PostgreSQL](https://www.postgresql.org/) - SQL Relational Database
* [Express](https://expressjs.com/) - Backend Web Framework for Node.JS (**Server #0**)
* [Django](https://www.djangoproject.com/) - High-level, open-source web Python Framework (**Server #1**)
* [React](https://react.dev/) - JavaSript User Interface library 
* [Node](https://nodejs.org/en) - Powerful JavaScript runtime environment

## :mailbox: Contributing

I appreciate your interest in contributing to the repository! To ensure a streamlined process and effective collaboration, I encourage contributors to follow these guidelines.

Please read our [Contribution Guidelines](CONTRIBUTING.md) for the process for submitting pull requests.

## :heartbeat: Authors / Contributors

### [**Yves Casio**](https://github.com/yvesaur) - This is the first open-sourced project that I will be doing, contributing to the repository will be a big help in further advancing this project. 

## :key: License 

This project is licensed under the **`GNU Affero General Public License (AGPL) v3`** - see the [LICENSE.md](LICENSE) file for details

