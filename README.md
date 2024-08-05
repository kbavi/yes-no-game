### README.md

# Yes and No Game

The Yes/No Game is a simple yet engaging interactive game where players must answer a series of questions without saying "Yes" or "No". The goal is to respond to each question creatively while avoiding these two forbidden words. The game can be played individually or with multiple players, and it typically ends when a player accidentally says "Yes" or "No". It's a fun way to challenge quick thinking, vocabulary skills, and concentration. Ideal for parties, family gatherings, or just a quick, entertaining break.


## Table of Contents

1. [Project Structure](#project-structure)
2. [Architecture Diagram](#architecture-diagram)
3. [Schema](#schema)
4. [Request Flow](#request-flow)
5. [REST API Documentation](#rest-api-documentation)
6. [Installation](#installation)
7. [Running the Project](#running-the-project)
8. [Possible Improvements](#possible-improvements)

## Project Structure

```
my-project/
│
├── backend/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── src/
│   │   ├── index.ts
│   │   ├── models/
│   │   │   └── conversation.ts
│   │   ├── routes/
│   │   │   └── conversation.ts
│   │   └── services/
│   │       └── flaskService.ts
│
├── python-server/
│   ├── Dockerfile
│   ├── requirements.txt
│   └── app.py
│
├── docker-compose.yml
├── .env
```

### Description

- **backend/**: Contains the Node.js server code written in TypeScript.
  - **Dockerfile**: Dockerfile for building the Node.js server image.
  - **package.json**: NPM dependencies.
  - **tsconfig.json**: TypeScript configuration.
  - **src/**: Source code for the Node.js server.
    - **index.ts**: Entry point of the Node.js server.
    - **models/**: Mongoose models.
      - **conversation.ts**: Schema for the conversation documents.
    - **routes/**: Express routes.
      - **conversation.ts**: Routes for conversation-related endpoints.
    - **services/**: Services for interacting with the Flask server.
      - **flaskService.ts**: Service for querying the Flask server.

- **python-server/**: Contains the Flask server code.
  - **Dockerfile**: Dockerfile for building the Flask server image.
  - **requirements.txt**: Python dependencies.
  - **app.py**: Main Flask application code.

- **docker-compose.yml**: Docker Compose file for orchestrating the services.
- **.env**: Environment variables for the project.

## Architecture Diagram

```plaintext
+-------------+       +-------------+       +---------+
|   Client    | <---> |  Backend    | <---> | MongoDB |
| (Postman,   |       | (Node.js)   |       +---------+
|  Browser)   |       +-------------+
|             |            ^
+-------------+            |
                           v
                      +-------------+       +---------+
                      | Flask Server| <---> | Redis   |
                      | (Python)    |       +---------+
                      +-------------+       
```

## Schema

### Conversation Schema (MongoDB)

```json
{
  "model_name": "string",
  "prompt": "string",
  "response": "string",
  "timestamp": "Date",
  "conversation_id": "string"
}
```

### Conversation History (Redis)

Each conversation ID maps to a list of conversation entries:

```
conversation_id: [
  "You: prompt1",
  "Model: response1",
  "You: prompt2",
  "Model: response2",
  ...
]
```

## Request Flow

1. **Client** sends a request to the **Node.js Backend** to query a model.
2. The **Node.js Backend** forwards the request to the **Flask Server** with the model name, prompt, and conversation ID (if available).
3. The **Flask Server** generates a response using the specified model and updates the conversation history in **Redis**.
4. The **Flask Server** returns the response and updated conversation ID to the **Node.js Backend**.
5. The **Node.js Backend** stores the prompt, response, and conversation ID in **MongoDB** and sends the response back to the **Client**.

## REST API Documentation

### Backend (Node.js) Endpoints

- **POST /conversations/query**
  - Description: Send a query to the specified model and get a response.
  - Request Body:
    ```json
    {
      "model_name": "string",
      "prompt": "string",
      "conversation_id": "string"
    }
    ```
  - Response:
    ```json
    {
      "response": "string",
      "conversation_id": "string"
    }
    ```

- **GET /conversations**
  - Description: List all conversations.
  - Response:
    ```json
    [
      {
        "_id": "string",
        "model_name": "string",
        "prompt": "string",
        "response": "string",
        "timestamp": "Date",
        "conversation_id": "string"
      }
    ]
    ```

- **GET /conversations/:id**
  - Description: Get details of a specific conversation.
  - Response:
    ```json
    {
      "_id": "string",
      "model_name": "string",
      "prompt": "string",
      "response": "string",
      "timestamp": "Date",
      "conversation_id": "string"
    }
    ```

### Flask Server Endpoints

- **POST /query**
  - Description: Query the specified model and get a response.
  - Request Body:
    ```json
    {
      "model_name": "string",
      "pre_prompt": "string",
      "message": "string",
      "conversation_id": "string"
    }
    ```
  - Response:
    ```json
    {
      "response": "string",
      "conversation_id": "string"
    }
    ```


## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/kbavi/yesnogame.git
   cd yesnogame
   ```

2. **Create the .env file**:

   ```bash
   cp .env.example .env
   ```

3. **Edit the .env file** with appropriate values:

   ```env
   BACKEND_PORT=3000
   MONGO_PORT=27017
   FLASK_PORT=5000
   REPLICATE_API_TOKEN=your_replicate_api_token_here
   SESSION_SECRET=your_secret_key
   LLAMA2_MODEL_PATH=replicate/llama2_url_on_replicate
   MISTRAL_MODEL_PATH=replicate/mistral_url_on_replicate
   ```

## Running the Project

1. **Build and run the Docker containers**:

   ```bash
   docker-compose up --build
   ```

2. The services should now be running:
   - Node.js Backend: `http://localhost:3000`
   - Flask Server: `http://localhost:5050`
   - MongoDB: `mongodb://localhost:27017`
   - Redis: `redis://localhost:6379`

3. **Interact with the API** using tools like `curl` or Postman:

   - **Send Query**:
     ```bash
     curl -X POST http://localhost:3000/conversations/query -H "Content-Type: application/json" -d '{"model_name": "Llama2", "prompt": "Once upon a time"}'
     ```

   - **List Conversations**:
     ```bash
     curl http://localhost:3000/conversations
     ```

   - **Get Specific Conversation**:
     ```bash
     curl http://localhost:3000/conversations/{id}
     ```

Replace `{id}` with the actual conversation ID you want to retrieve.

### Notes

- Ensure all environment variables are correctly set in the `.env` file.
- The Node.js server interacts with the Flask server to process queries and uses MongoDB to store and retrieve conversation history.
- The Flask server uses Redis to store conversation history by conversation ID.
- You can further enhance error handling and validation as needed.

## Possible Improvements

To further enhance and optimize the system, especially for production deployment, consider implementing the following improvements:

### 1. Using LangChain for Memory Management

- **Description**: Integrate LangChain to attach memory to model runs, which will provide better context retention and improved conversation flow.
- **Benefits**:
  - Enhanced context management for more coherent and relevant responses.
  - Ability to handle longer and more complex conversations without losing context.
- **Implementation**:
  - Integrate LangChain with the Flask server to manage conversation history.
  - Update the model querying logic to utilize LangChain for context-aware responses.

### 2. User Authentication

- **Description**: Implement user authentication to secure access to the API and manage user-specific conversation history.
- **Benefits**:
  - Ensures that only authenticated users can interact with the system.
  - Allows for personalized conversation history and context management per user.
- **Implementation**:
  - Use JWT (JSON Web Tokens) or OAuth for secure user authentication.
  - Add user management endpoints (registration, login, logout).
  - Associate conversation history in MongoDB and Redis with specific user IDs.

### 3. Use Locally Installed Models

- **Description**: Use locally installed models instead of relying on Replicate API to reduce response latencies and dependency on external services.
- **Benefits**:
  - Improved response times by eliminating network latency to external APIs.
  - Greater control over model versions and configurations.
  - Reduced operational costs associated with API usage.
- **Implementation**:
  - Install and configure Llama2 and Mistral models locally on the server.
  - Update the Flask server to load and run the models locally.
  - Ensure proper resource management (CPU/GPU) for efficient model execution.

### 4. Logging and Monitoring

- **Description**: Implement comprehensive logging and monitoring to track system performance, detect issues, and ensure reliable operation.
- **Benefits**:
  - Real-time monitoring of system health and performance.
  - Easier debugging and issue resolution with detailed logs.
  - Enhanced visibility into user interactions and system usage patterns.
- **Implementation**:
  - Use logging frameworks like Winston (Node.js) and Python's logging module.
  - Integrate monitoring tools like Prometheus and Grafana for real-time metrics.
  - Set up alerting mechanisms for critical issues and thresholds.

### 5. Rate Limiting and Throttling

- **Description**: Implement rate limiting and throttling to prevent abuse and ensure fair usage of the API.
- **Benefits**:
  - Protects the system from being overwhelmed by excessive requests.
  - Ensures equitable access for all users.
  - Helps maintain consistent performance under load.
- **Implementation**:
  - Use middleware in Node.js (e.g., express-rate-limit) to limit the number of requests per user/IP.
  - Implement similar rate-limiting mechanisms in the Flask server.

### 6. Scalability and Load Balancing

- **Description**: Design the system to be horizontally scalable and use load balancing to distribute traffic effectively.
- **Benefits**:
  - Improved system capacity and reliability under high load.
  - Enhanced fault tolerance and availability.
  - Ability to scale out as user demand grows.
- **Implementation**:
  - Containerize services using Docker and orchestrate with Kubernetes for scalable deployments.
  - Use load balancers (e.g., Nginx, HAProxy) to distribute incoming traffic across multiple instances.
  - Implement auto-scaling policies to dynamically adjust the number of running instances based on load.

### 7. Enhanced Security

- **Description**: Implement additional security measures to protect the system and user data.
- **Benefits**:
  - Protects against common security threats (e.g., SQL injection, XSS, CSRF).
  - Ensures data privacy and integrity.
  - Builds trust with users through robust security practices.
- **Implementation**:
  - Use HTTPS for secure communication.
  - Sanitize and validate all user inputs.
  - Implement security headers and best practices for API security.
  - Regularly perform security audits and vulnerability assessments.

### 8. Improved Error Handling

- **Description**: Enhance error handling to provide meaningful feedback and ensure graceful recovery from failures.
- **Benefits**:
  - Better user experience with clear and informative error messages.
  - Easier debugging and maintenance with detailed error logs.
  - Reduced system downtime and improved reliability.
- **Implementation**:
  - Use centralized error handling middleware in Node.js and Flask.
  - Provide descriptive error messages and HTTP status codes.
  - Implement retry mechanisms and fallback strategies for critical operations.

By implementing these improvements, the system will be more robust, secure, and scalable, providing a better experience for users and maintaining high performance under varying loads.