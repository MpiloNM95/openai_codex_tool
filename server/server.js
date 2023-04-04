// import express from 'express' measn that we are importing the express library
import express from 'express'
// import dotenv from 'dotenv' means that we are importing the dotenv library
import * as dotenv from 'dotenv'
// import cors from 'cors' means that we are importing the cors library
import cors from 'cors'
// import { Configuration, OpenAIApi } from 'openai' means that we are importing the Configuration and OpenAIApi classes from the openai library
import { Configuration, OpenAIApi } from 'openai'

// dotenv.config() loads the environment variables from the .env file
dotenv.config()

// const configuration = new Configuration means that we are creating a new instance of the Configuration class
// apiKey: process.env.OPENAI_API_KEY means that we are passing the OPENAI_API_KEY environment variable as the apiKey
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

// const openai = new OpenAIApi(configuration) means that we are creating a new instance of the OpenAIApi class
const openai = new OpenAIApi(configuration);

// const app = express() means that we are creating a new instance of the express class
// app.use(cors({origin:"*"})) means that we are using the cors middleware
// app.use(express.json()) means that we are using the express.json() middleware
const app = express()
app.use(cors({origin:"*"}));
app.use(express.json())

// app.get('/', async (req, res) => means that we are creating a new route
// res.status(200).send({ means that we are sending a response with a status code of 200
// message: 'Hello from CodeX!' means that we are sending a message
app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Hello from CodeX!'
  })
})

// app.post('/', async (req, res) => means that we are creating a new route
// try means that we are trying to run the code inside the try block
// const prompt = req.body.prompt; means that we are getting the prompt value from the request body
app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0, // Higher values means the model will take more risks.
      max_tokens: 3000, // The maximum number of tokens to generate in the completion. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).
      top_p: 1, // alternative to sampling with temperature, called nucleus sampling
      frequency_penalty: 0.5, // Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
      presence_penalty: 0, // Number between -2.0 and 2.0. Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
    });

    // res.status(200).send({ means that we are sending a response with a status code of 200
    // bot: response.data.choices[0].text means that we are sending the bot's response
    res.status(200).send({
      bot: response.data.choices[0].text
    });

    // catch means that we are catching any errors that occur in the try block
    // console.error(error) means that we are logging the error to the console
    // res.status(500).send(error || 'Something went wrong'); means that we are sending a response with a status code of 500
    // error || 'Something went wrong' means that we are sending the error or a message if there is no error
  } catch (error) {
    console.error(error)
    res.status(500).send(error || 'Something went wrong');
  }
})

// app.listen(5050, () => console.log('AI server started on http://localhost:5050')) means that we are listening on port 5050
app.listen(5050, () => console.log('AI server started on http://localhost:5050'))