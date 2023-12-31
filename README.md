# Grade Calculator Web Application

The Grade Calculator Web Application is a tool that allows students to calculate and submit class grades conveniently. It consists of a front end built using React.js and a back end developed with Express.js and MongoDB.

## Features

- Calculate final grades for classes based on section weights and grades.
- Add new classes and assignments with dynamic user interface components.
- Store and manage course data using a MongoDB database.
- Enable seamless communication between the front end and back end through API endpoints.

## Technologies Used

- Front End: React.js
- Back End: Express.js
- Database: MongoDB
- Additional Libraries and Tools: body-parser, cors, mongoose

## Installation

1. Clone the repository: `git clone https://github.com/yourusername/grade-calculator.git`
2. Navigate to the project directory: `cd grade-calculator`
3. Install dependencies for the front end and back end:
   - Front End: `cd client` and `npm install`
   - Back End: `cd server` and `npm install`
4. Configure MongoDB:
   - Set up a MongoDB instance or cluster.
   - Update the `CONNECTION` variable in the `server/index.js` file with your MongoDB connection string.

## Usage

1. Start the back end server:
   - Navigate to the `server` directory: `cd server`
   - Run: `npm start`

2. Start the front end development server:
   - In the root directory, navigate to the `client` directory: `cd client`
   - Run: `npm start`

3. Access the application in your browser at: `http://localhost:3000`

## API Endpoints

- `POST /calculator/add`: Add new courses and calculate final grades based on assignment weights and grades.

## Contributing

Contributions are welcome! If you have any enhancements or fixes, feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).
