This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, go to [https://aistudio.google.com/api-keys](https://aistudio.google.com/api-keys), select `Create API Key` and copy it. Then create in the project root a file named `.env` with the following content: `GEMINI_API_KEY=<your-api-key>`, the `<your-api-key>` should be replaced with the API key you copied from Google.

Second, run the following command to install dependencies:
```bash
npm install
# or
yarn
# or
pnpm install
```

Finally, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## How the Gemini API is integrated
First, create a new instance of the Gemini API, it automatically takes the API key from the environment variable:
```typescript
const ai = new GoogleGenAI({})

```
Then, use the `ai.models.generateContentStream` method to call the API:
```typescript
const response = await ai.models.generateContentStream({
  model: 'gemini-2.5-flash',
  contents: `Prompt: ${prompt}. 
      Answer in the language as in the prompt. 
      The prompt should be about planning a trip, if not return a sentence says that you can only generates answer related to travel. 
      Return only 3 to 5 points showing the most important things in the format of bullet points, also including the markdown of the bullet points so that the answer can be rendered in markdown. At the end, wish a good trip.`,
});
```
Here the method `generateContentStream` is used instead of `generateContent` in order to display the response in real time and we don't need to wait for the whole response to be generated before displaying it. We must also specify the model to use (here `gemini-2.5-flash`) and the prompt to use (here the prompt also specifies that the format of the response).