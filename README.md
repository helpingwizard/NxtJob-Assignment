# NxtJob Assignment

This project is designed to be set up using Node.js locally or with Docker. Below are the instructions for both methods.

## Getting Started

### Prerequisites
- Git
- Node.js and npm
- Docker (for Docker setup)

### Local Development Setup

To run this project locally, follow these steps:

1. **Clone the repository**
   ```bash
   git clone https://github.com/helpingwizard/NxtJob-Assignment.git
cd NxtJob-Assignment
npm install
npm start
Open your web browser and navigate to http://localhost:3000/docs.


git clone https://github.com/helpingwizard/NxtJob-Assignment.git
sudo docker build -t zeus -f /path/NxtJob/DockerFile .
sudo docker run -p 3000:3000 -e DB_URL="postgresql://helloworld_owner:LjIuT1ft7EaN@ep-lucky-boat-a5qz9lr0.us-east-2.aws.neo"
Open your web browser and navigate to http://localhost:3000/docs
