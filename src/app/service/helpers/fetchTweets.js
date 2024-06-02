export default async function fetchTweets (hashtagsString) {
    try {
        const hashtags = JSON.parse(hashtagsString);
        console.log(JSON.stringify({ hashtags: hashtags }));
        const response = await fetch('/api/tweets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ hashtags: hashtags }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.list;
        } else {
            return 'Error fetching tweets:', response.status;
        }
    } catch (error) {
        return 'Error:', error;
    }
};