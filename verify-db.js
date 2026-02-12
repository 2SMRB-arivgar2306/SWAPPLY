const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

function getEnv() {
    try {
        const envPath = path.join(__dirname, '.env.local');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.trim();
            }
        });
        return env;
    } catch (e) {
        console.error('Error reading .env.local:', e);
        return {};
    }
}

const env = getEnv();
process.env.MONGODB_URI = env.MONGODB_URI || process.env.MONGODB_URI;

const { Schema } = mongoose;

const ArticleSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: { type: String, required: true },
    wantsFor: { type: String, required: true },
    image: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
});

const Article = mongoose.models.Article || mongoose.model('Article', ArticleSchema);

async function main() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('MONGODB_URI not found in .env.local');
        return;
    }

    console.log('Connecting to MongoDB...');
    try {
        await mongoose.connect(uri);
        console.log('Connected!');

        console.log('Creating a test article...');
        const article = await Article.create({
            title: 'Test Article',
            description: 'This is a test article',
            category: 'test',
            condition: 'new',
            wantsFor: 'nothing',
            image: 'test.jpg'
        });
        console.log('Article created:', article._id);

        console.log('Fetching articles...');
        const articles = await Article.find({});
        console.log('Found', articles.length, 'articles');

        console.log('Deleting test article...');
        await Article.findByIdAndDelete(article._id);
        console.log('Deleted.');

        console.log('Verification successful!');
    } catch (err) {
        console.error('Verification failed:', err);
    } finally {
        await mongoose.disconnect();
    }
}

main();
