require("dotenv").config();

const app = require("./src/app.js");
const connectToDB = require("./src/config/database.js");

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        await connectToDB();
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1);
    }
})();
