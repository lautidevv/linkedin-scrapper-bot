// gpt
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
dotenv.config();
// Creating a new instance of the OpenAI class and passing in the OPENAI_KEY environment variable
const openAI = new OpenAI(process.env.OPENAI_KEY);


const rolesIndex = ["Frontend", "Backend"]

const emojisIndex = {
    net: '<:net:1207123156196786196>',
    C_: '<:C_:1207123045303455784>',
    QA: '<:QA:1207129410222948382>',
    adonisjs: '<:adonisjs:1207123167626403910>',
    android: '<:android:1207129412030570566>',
    angular: '<:angular:1207123624515866634>',
    blazor: '<:blazor:1207123143991369758>',
    dart: '<:dart:1207123146151436308>',
    django: '<:django:1207123147808182392>',
    docker: '<:docker:1207123149317996594>',
    fluter: '<:fluter:1207123046704357507>',
    git: '<:git:1207123169622884392>',
    go: '<:go:1207126527318433852>',
    htmlycss: '<:htmlycss:1207123334945447966>',
    ionic: '<:ionic:1207123151126007849>',
    java: '<:java:1207123418827456562>',
    javascript: '<:javascript:1207123049883897936>',
    kotlin: '<:kotlin:1207123152824438874>',
    python: '<:python:1207123163872497684>',
    postgresql: '<:postgresql:1207123947368349736>',
    php: '<:php:1207123160110071881>',
    node: '<:node:1207123898156712006>',
    nextjs: '<:nextjs:1207126876544573470>',
    mysql: '<:mysql:1207123154477121576>',
    mongo: '<:mongo:1207123142556913705>',
    laravel: '<:laravel:1207123141038444574>',
    reactjs: '<:reactjs:1207123333334700112>',
    rust: '<:rust:1207128502130839612>',
    spring: '<:spring:1207123255048011817>',
    sql: '<:sql:1207123256545509497>',
    swagger: '<:swagger:1207123258109861948>',
    swift: '<:swift:1207123259603292190>',
    symfony: '<:symfony:1207123261033418863>',
    ts: '<:ts:1207123262493163570>',
    unity: '<:unity:1207123263944265728>',
    vue: '<:vue:1207123266771226694>',
    svelte: '<:svelte:1018942335112978572>'
}

export class OpenAI {
  constructor(apiKey) {
    // Create the Configuration and OpenAIApi instances
    this.openai = new OpenAIApi(new Configuration({ apiKey }));
  }
  // Asynchronous function to generate text from the OpenAI API
  async generateText(prompt, model, max_tokens, temperature = 0.1) {
    try {
      // Send a request to the OpenAI API to generate text
      const response = await this.openai.createCompletion({
        model,
        prompt,
        max_tokens,
        n: 1,
        temperature,
      });
      console.log(`request cost: ${response.data.usage.total_tokens} tokens`);
      // Return the text of the response
      return response.data.choices[0].text;
    } catch (error) {
      throw error;
    }
  }
}

async function analyzeDeveloperIntroduction(introduction) {
    const extractedEmojis = [];
    const extractedRoles = [];
    
    const prompt = `Given the introduction "${introduction}", find emojis and developer roles.`;
    const maxTokens = 200;
  
    try {
      const response = await openAI.generateText(prompt, "gpt-3.5-turbo-0125", maxTokens);
      // Parse the response to extract emojis and developer roles
      // Your parsing logic here
      return { emojis: extractedEmojis, roles: extractedRoles };
    } catch (error) {
      throw error;
    }
}