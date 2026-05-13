const app = require("./app");
const env = require("./config/env.config");
const connectMongoDB = require("./database/mongodb.connection");

async function bootstrap() {
    await connectMongoDB();

    app.listen(env.PORT, () => {
        console.log(`Server running on http://localhost:${env.PORT}`);
    });
}

bootstrap();